---
id: api-f7
title: Passenger API, compensation, and payments
sidebar_label: API and workers
sidebar_position: 4
tags: [fastapi, sqlalchemy, postgresql, docker, rest-api, rabbitmq, celery, workers]
---

FastAPI provides passenger queries and F7 operations for simulated compensation and payments. The backend and its three workers share a container image. [Repository, setup, and tests](https://github.com/vueladata/vueladata-api). [AWS endpoints and deployment status](../orchestration/accesos-aws.md#endpoints).

## REST API {/* #api-rest */}

| Resource | Operation |
| --- | --- |
| `GET /pasajeros/{id_pasajero}` | Passenger profile. |
| `GET /pasajeros/{id_pasajero}/itinerarios` | The passenger's bookings, flights, connection assessments, and rebooking options. `/pasajeros/{id_pasajero}/reservas` is an alias. |
| `GET /pasajeros/{id_pasajero}/compensaciones` | The passenger's compensation, payments, and notifications. |
| `GET /reservas/{codigo_reserva}/estado` | Consolidated status of one of the passenger's bookings. |
| `/causas/`, `/reglas-compensacion/`, `/compensaciones/` | Create, read, partially update, and delete each resource. |
| `/pagos/`, `/pagos/idempotencia/{clave}` | Disbursement requests and lookup by idempotency key. |
| `/eventos-pago/` | Read and record F7 payment confirmations. |
| `GET /health`, `GET /health/db` | API health and PostgreSQL connectivity, respectively. |

The passenger routes enforce RN-11 by comparing the `X-Pasajero-Id` header with the passenger associated with the resource. They return `401` for a missing header, `403` for an identity mismatch, and `404` when the requested resource does not exist. The prototype accepts an identity supplied by the client. Queries against real passenger data require an authentication layer that verifies that identity.

The `pago` idempotency key and the external `evento_pago` ID support RN-09. SQL constraints enforce one compensation per segment and one payment per compensation. [Data dictionary](../base-datos-transaccional-seed/diccionario-datos.md).

## Consumers {/* #consumidores */}

| Process | Input and output |
| --- | --- |
| `worker_rds` | Consumes `q.rds_writer`. Persists OOOI events, resolves OpenSky records by ICAO24, and matches weather records by IATA code. Sends external events with missing catalog entries to `q.rds_unresolved`. |
| `worker_lake` | Consumes `q.lake_writer` and writes raw data to Bronze. Writes F2 and F3 as NDJSON to `bronze/events/opensky/` and `bronze/events/clima/`. A local disk fallback is optional for development. |
| `worker_notificaciones` | Consumes `q.notificaciones_email` from the `vueladata.notificaciones` topic exchange. Sends HTML emails via SMTP and records their status in PostgreSQL. |

`worker_rds` assesses connections and rebooking options for passengers affected by operational events. The notifications exchange uses routing keys `vuelo.cancelado`, `vuelo.retrasado`, `conexion.en_riesgo`, and `itinerario.cambiado`. Use `EMAIL_DESTINO_PRUEBAS` for SMTP tests and provide credentials through the environment. [Notifications ADR](../adr/006-notificaciones.md).
