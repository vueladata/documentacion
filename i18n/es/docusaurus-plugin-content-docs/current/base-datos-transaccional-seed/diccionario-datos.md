---
id: diccionario-datos
title: Diccionario de datos
sidebar_label: Diccionario de datos
description: Tablas, campos, relaciones y reglas de integridad del esquema operativo de VuelaData.
tags: [postgresql, relational-model, data-dictionary]
---

# Diccionario de datos de VuelaData

## Alcance {/* #scope */}

Esta página describe el esquema operativo `vueladata`. [Definición en SQL](https://github.com/vueladata/vueladata-database/blob/master/schema_postgresql.sql).

## Convenciones {/* #conventions */}

| Convención | Significado |
| --- | --- |
| `id_*` | Clave primaria o foránea. Las claves primarias usan `IDENTITY`. |
| `_utc` | Marca de tiempo en UTC almacenada como `timestamptz`. |
| `codigo` | Valor técnico legible y estable que usan las integraciones y reglas. |
| `id_externo_*` | Identificador de origen externo para idempotencia. |
| `unique` | El valor o la combinación de valores es única. |
| `nullable` | El campo admite `NULL`. |

## 1. Geografía, flota y operación {/* #1-geography-fleet-and-operations */}

| Tabla | Propósito | Relaciones o reglas principales |
| --- | --- | --- |
| `pais` | Catálogo de países. | `codigo_iso` es único. |
| `ciudad` | Ciudades en las que se encuentran los aeropuertos. | Clave foránea a `pais`. El nombre de la ciudad es único dentro del país. |
| `aeropuerto` | Aeropuertos de salida, llegada, conexión y desvío. | Clave foránea a `ciudad`. El código IATA es único, y el código ICAO es opcional y único. |
| `aerolinea` | Catálogo de aerolíneas. | El código IATA es único. |
| `aeronave` | Aeronave asignada a una aerolínea. | Clave foránea a `aerolinea`. La matrícula es única y la capacidad debe ser positiva. El `codigo_icao24` opcional y único vincula registros de OpenSky. |
| `ruta` | Trayecto entre dos aeropuertos. | Claves foráneas a origen y destino. El par es único y los aeropuertos deben ser distintos. |
| `estado_vuelo` | Catálogo de estados operativos. | Incluye `PROGRAMADO`, `SALIDA_PUERTA`, `DESPEGADO`, `ATERRIZADO`, `LLEGADA_PUERTA`, `CANCELADO` y `DESVIADO`. |
| `vuelo` | Instancia de un vuelo programado. | Claves foráneas a ruta, aeronave y estado. Guarda los horarios programados, los tiempos OOOI reales y un posible aeropuerto de desvío. |
| `evento_operacional` | Mensajes OOOI, cancelaciones, desvíos y causas de F4. | `id_externo_evento` evita duplicados. Estados de validación `PENDIENTE`, `VALIDO` y `RECHAZADO`. |
| `posicion_aeronave` | Posiciones recibidas de F2/OpenSky. | Clave foránea a aeronave. `id_externo_posicion` es único. |
| `observacion_clima` | Observaciones de F3/Open-Meteo. | Clave foránea a aeropuerto. El par aeropuerto y hora de observación es único. |

### Tiempos OOOI de un vuelo {/* #oooi-times-in-a-flight */}

| Campo | Evento | Significado |
| --- | --- | --- |
| `salida_real_puerta_utc` | `OUT` | Salida real de la puerta. |
| `despegue_real_utc` | `OFF` | Despegue real. |
| `aterrizaje_real_utc` | `ON` | Aterrizaje real. |
| `llegada_real_puerta_utc` | `IN` | Llegada real a la puerta. Se usa para calcular OTP. |

El trigger `trg_actualizar_estado_vuelo_desde_evento` actualiza el estado del vuelo y los tiempos OOOI cuando el evento está en estado `VALIDO`.

## 2. Reservas, itinerarios y conexiones {/* #2-reservations-itineraries-and-connections */}

| Tabla | Propósito | Relaciones o reglas principales |
| --- | --- | --- |
| `pasajero` | Datos personales del pasajero. | El número y el tipo de documento son únicos en conjunto. |
| `reserva` | Reserva que puede incluir a varios pasajeros. | `codigo_reserva` es único. |
| `reserva_pasajero` | Asociación entre una reserva y un pasajero. | El par reserva y pasajero es único. |
| `itinerario` | Viaje de un pasajero dentro de una reserva. | Clave foránea a `reserva_pasajero`. |
| `detalle_reserva` | Tramo de vuelo reservado dentro de un itinerario. | Claves foráneas a itinerario y vuelo. La secuencia es única en el itinerario. El asiento, cuando se informa, es único por vuelo. |
| `checkin` | Registro de embarque para un tramo reservado. | Clave foránea única a `detalle_reserva`. El número de pase de abordar es único cuando se informa. |
| `tiempo_minimo_conexion` | Reglas de conexión por aeropuerto y tipo de entrada o salida. | Tipos `NACIONAL` e `INTERNACIONAL`. Cada regla tiene un período de vigencia. |
| `conexion_itinerario` | Enlace entre tramos consecutivos. | Un trigger exige el mismo itinerario, tramos consecutivos y el mismo aeropuerto de conexión. |
| `evaluacion_conexion` | Historial de cálculos de conexión. | Estados `NORMAL`, `EN_RIESGO` y `PERDIDA`. Registra los minutos disponibles y requeridos. |

## 3. Incidencias, compensación y comunicación {/* #3-disruptions-compensation-and-communication */}

| Tabla | Propósito | Relaciones o reglas principales |
| --- | --- | --- |
| `causa` | Catálogo de causas normalizadas. | `es_imputable` indica la responsabilidad de la aerolínea. |
| `incidencia_vuelo` | Clasificación de un evento operacional. | Conserva la causa original y normalizada. Tipos `RETRASO` y `CANCELACION`. |
| `auditoria_causa` | Evidencia cuando una causa técnica coincide con clima adverso. | Vincula la incidencia con observaciones del origen o destino dentro de una hora del evento. |
| `regla_rotacion` | Tiempos mínimos de rotación con vigencia. | Valores iniciales de 45 minutos para vuelos nacionales y 60 para internacionales. |
| `proyeccion_propagacion` | Proyección del retraso hacia el próximo vuelo de la aeronave. | Un trigger valida la aeronave y que el vuelo afectado sea el próximo programado. |
| `regla_compensacion` | Reglas de compensación con vigencia. | Define porcentajes, rangos de demora, tiempo máximo de aviso y necesidad de reubicación. |
| `compensacion` | Compensación calculada para un pasajero y un tramo. | Única por tramo. Un trigger verifica el vuelo, la causa, la regla, la vigencia, la tarifa y el monto. |
| `pago` | Solicitud de pago a F7. | Una compensación admite como máximo un pago. La clave de idempotencia es única. |
| `evento_pago` | Historial de respuestas asíncronas de F7. | El identificador externo es único. Un trigger actualiza el estado del pago. |
| `reubicacion` | Viaje alternativo para el tramo afectado. | El tramo y la incidencia deben corresponder al mismo vuelo. |
| `notificacion` | Mensajes enviados o programados para pasajeros. | Tipos `CONEXION_RIESGO`, `COMPENSACION`, `REUBICACION` e `INTERRUPCION`. Canales `EMAIL`, `SMS` y `PUSH`. |

## Reglas de integridad {/* #documented-integrity-rules */}

| Regla | Implementación |
| --- | --- |
| RN-01, puntualidad de llegada | `vuelo.llegada_real_puerta_utc` almacena `IN` para compararlo con la llegada programada. |
| RN-02, horas en UTC | Los tiempos operativos usan `timestamptz` y campos con el sufijo `_utc`. |
| RN-03, responsabilidad de la aerolínea | `causa.es_imputable` determina si una incidencia puede dar lugar a una compensación. |
| RN-04, auditoría climática | `auditoria_causa` vincula la incidencia con observaciones meteorológicas válidas. |
| RN-05, escala de compensación | `regla_compensacion` y su trigger verifican porcentajes, rangos y vigencia. |
| RN-06, causa no imputable | El trigger rechaza la compensación económica para causas no imputables. Se pueden aplicar notificaciones y reubicación. |
| RN-07, conexión en riesgo | `conexion_itinerario`, `tiempo_minimo_conexion` y `evaluacion_conexion` documentan la evaluación. |
| RN-08, propagación de retrasos | `proyeccion_propagacion` y `regla_rotacion` modelan retrasos entre vuelos consecutivos de una aeronave. |
| RN-09, pago único | Restricciones de unicidad para `compensacion.id_detalle_reserva`, `pago.id_compensacion` y las claves de idempotencia. |
| RN-10, vuelos desviados | `vuelo.id_aeropuerto_desvio` y `DESVIADO` permiten reportar desvíos y excluirlos del cálculo OTP. |
| RN-11, aislamiento de pasajeros | La ruta `pasajero → reserva_pasajero → itinerario → detalle_reserva` permite comprobar la autorización en la API. |

Consulta los campos, tipos y restricciones en el [diccionario detallado](https://github.com/vueladata/vueladata-database/blob/master/website/docs/database/diccionario_datos_vueladata.md) y la [definición en SQL](https://github.com/vueladata/vueladata-database/blob/master/schema_postgresql.sql).
