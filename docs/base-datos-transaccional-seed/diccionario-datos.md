---
id: diccionario-datos
title: Data Dictionary
sidebar_label: Data Dictionary
description: Tables, fields, relationships, and integrity rules in the VuelaData operational schema.
tags: [postgresql, relational-model, data-dictionary]
---

# VuelaData Data Dictionary

## Scope

This document describes the operational `vueladata` schema, based on the supplied data dictionary, which says the schema is defined in `schema_postgresql.sql`. The large F1 historical dataset is processed in the analytical Data Lake and is not part of this transactional database.

## Conventions

| Convention | Meaning |
|---|---|
| `id_*` | Primary key or foreign key. The source document says primary keys use `IDENTITY`. |
| `_utc` | Timestamp stored in UTC using `timestamptz`. |
| `codigo` | Stable, readable technical value used by integrations and rules. |
| `id_externo_*` | External source identifier used for idempotency; it is not a foreign key. |
| `unique` | The value or combination of values cannot be repeated. |
| `nullable` | The field can be empty (`NULL`). |

## 1. Geography, Fleet, and Operations

| Table | Purpose | Main relationships or rules |
|---|---|---|
| `pais` | Country catalog. | `codigo_iso` is unique. |
| `ciudad` | Cities where airports are located. | Foreign key to `pais`; city name is unique within a country. |
| `aeropuerto` | Airports used for departure, arrival, connections, or diversions. | Foreign key to `ciudad`; IATA code is unique; ICAO code is optional and unique. |
| `aerolinea` | Airline catalog. | IATA code is unique. |
| `aeronave` | Aircraft assigned to an airline. | Foreign key to `aerolinea`; registration is unique; capacity must be greater than zero. |
| `ruta` | Route between two airports. | Foreign keys to origin and destination airports; the origin-destination pair is unique and the airports must be different. |
| `estado_vuelo` | Operational flight status catalog. | Includes `PROGRAMADO`, `SALIDA_PUERTA`, `DESPEGADO`, `ATERRIZADO`, `LLEGADA_PUERTA`, `CANCELADO`, and `DESVIADO`. |
| `vuelo` | A scheduled flight instance. | Foreign keys to route, aircraft, and status; stores scheduled times, actual OOOI times, and a possible diversion airport. |
| `evento_operacional` | Immutable record of OOOI messages, cancellations, diversions, and causes received from F4. | `id_externo_evento` is unique to prevent duplicates; validation states are `PENDIENTE`, `VALIDO`, and `RECHAZADO`. |
| `posicion_aeronave` | Aircraft position data received from F2/OpenSky. | Foreign key to aircraft; `id_externo_posicion` is unique. |
| `observacion_clima` | Weather observations from F3/Open-Meteo. | Foreign key to airport; the airport and observation time pair is unique. |

### OOOI Times in a Flight

The `vuelo` table stores four times:

| Field | Event | Meaning |
|---|---|---|
| `salida_real_puerta_utc` | `OUT` | Actual departure from the gate. |
| `despegue_real_utc` | `OFF` | Actual takeoff. |
| `aterrizaje_real_utc` | `ON` | Actual landing. |
| `llegada_real_puerta_utc` | `IN` | Actual arrival at the gate; used for OTP according to the source document. |

The data dictionary says a database trigger updates the flight status and OOOI times when an event has the `VALIDO` status.

## 2. Reservations, Itineraries, and Connections

| Table | Purpose | Main relationships or rules |
|---|---|---|
| `pasajero` | Passenger personal details. | Document number is unique together with document type. |
| `reserva` | Booking reference that can include several passengers. | `codigo_reserva` is unique. |
| `reserva_pasajero` | Link table between a booking and a passenger. | The booking-passenger pair cannot repeat. |
| `itinerario` | A passenger's journey within a booking. | Foreign key to `reserva_pasajero`. |
| `detalle_reserva` | A booked flight segment within an itinerary. | Foreign keys to itinerary and flight; sequence is unique within an itinerary; a seat is unique per flight when provided. |
| `checkin` | Check-in for a booked segment. | Unique foreign key to `detalle_reserva`; boarding pass number is unique when provided. |
| `tiempo_minimo_conexion` | Minimum connection time rules by airport and arrival/departure type. | Types are `NACIONAL` or `INTERNACIONAL`; each rule has a validity period. |
| `conexion_itinerario` | Link between two consecutive segments. | A trigger requires the same itinerary, consecutive segments, and a matching connection airport. |
| `evaluacion_conexion` | History of connection time calculations. | States are `NORMAL`, `EN_RIESGO`, or `PERDIDA`; stores available and required minutes. |

## 3. Disruptions, Compensation, and Communication

| Table | Purpose | Main relationships or rules |
|---|---|---|
| `causa` | Catalog of normalized causes. | `es_imputable` indicates whether the airline is responsible. |
| `incidencia_vuelo` | Business classification based on an operational event. | Keeps the original cause separate from the normalized cause; type is `RETRASO` or `CANCELACION`. |
| `auditoria_causa` | Review evidence when a technical cause matches severe weather. | Links a disruption to weather observations; weather must match the origin or destination and be within one hour of the event. |
| `regla_rotacion` | Versioned minimum aircraft turnaround times. | Initial values in the source are 45 minutes for domestic flights and 60 minutes for international flights. |
| `proyeccion_propagacion` | Forecast of a delay affecting the next flight operated by the same aircraft. | A trigger checks that both flights use the same aircraft and that the affected flight is the next scheduled flight. |
| `regla_compensacion` | Versioned compensation rules. | Defines percentages, delay ranges, maximum notice time, and whether rebooking is required. |
| `compensacion` | Compensation calculated for an affected passenger and segment. | Unique per segment; a trigger checks the flight, cause, rule, validity, fare, and amount. |
| `pago` | Payment request sent to F7. | A compensation can have at most one payment; the idempotency key is unique. |
| `evento_pago` | History of asynchronous responses from F7. | External event ID is unique; a trigger updates the current payment status. |
| `reubicacion` | Management of an alternative trip for an affected segment. | The segment and disruption must belong to the same flight. |
| `notificacion` | Messages sent or scheduled for passengers. | Types include `CONEXION_RIESGO`, `COMPENSACION`, `REUBICACION`, and `INTERRUPCION`; channels are `EMAIL`, `SMS`, or `PUSH`. |

## Documented Integrity Rules

| Rule | Described implementation |
|---|---|
| RN-01: OTP uses actual gate arrival | `vuelo.llegada_real_puerta_utc` stores the `IN` event for comparison with the scheduled arrival. |
| RN-02: UTC timestamps | Operational timestamps use `timestamptz` and field names ending in `_utc`. |
| RN-03: Airline responsibility | `causa.es_imputable` determines whether a disruption can qualify for compensation. |
| RN-04: Weather audit | `auditoria_causa` links a disruption to valid weather observations. |
| RN-05: Compensation scale | `regla_compensacion` and the `compensacion` trigger check percentages, ranges, and validity. |
| RN-06: Cause not assigned to the airline | The trigger rejects financial compensation for causes that are not the airline's responsibility; notifications and rebooking may still be used. |
| RN-07: Connection at risk | `conexion_itinerario`, `tiempo_minimo_conexion`, and `evaluacion_conexion` store the evaluation. |
| RN-08: Delay propagation | `proyeccion_propagacion` and `regla_rotacion` model delays between consecutive flights using the same aircraft. |
| RN-09: One payment per compensation | Unique constraints on `compensacion.id_detalle_reserva`, `pago.id_compensacion`, and idempotency keys. |
| RN-10: Diverted flights | `vuelo.id_aeropuerto_desvio` and the `DESVIADO` status allow diverted flights to be reported separately and excluded from OTP. |
| RN-11: Passenger isolation | The path `pasajero → reserva_pasajero → itinerario → detalle_reserva` can support authorization checks in the API. |

:::note[Level of Detail]
This page summarizes the purpose, relationships, and main rules of the tables. For every field, SQL type, and table constraint, use the team's source file `diccionario_datos_vueladata.md` and the related `schema_postgresql.sql` file.
:::
