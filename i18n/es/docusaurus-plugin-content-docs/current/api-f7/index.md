---
id: api-f7
title: API de pasajeros, compensaciones y pagos
sidebar_label: API y workers
sidebar_position: 4
tags: [fastapi, sqlalchemy, postgresql, docker, rest-api, rabbitmq, celery, workers]
---

FastAPI ofrece consultas a pasajeros y las operaciones de F7 para compensaciones y pagos simulados. El backend y los tres workers comparten una imagen de contenedor. [Repositorio, instalación y pruebas](https://github.com/vueladata/vueladata-api). [URLs de AWS y estado del despliegue](../orchestration/accesos-aws.md#endpoints).

## API REST {/* #api-rest */}

| Recurso | Operación |
| --- | --- |
| `GET /pasajeros/{id_pasajero}` | Perfil del pasajero. |
| `GET /pasajeros/{id_pasajero}/itinerarios` | Reservas propias, vuelos, evaluaciones de conexión y reubicaciones. `/pasajeros/{id_pasajero}/reservas` es un alias. |
| `GET /pasajeros/{id_pasajero}/compensaciones` | Compensaciones, pagos y notificaciones propios. |
| `GET /reservas/{codigo_reserva}/estado` | Estado consolidado de una reserva del pasajero. |
| `/causas/`, `/reglas-compensacion/`, `/compensaciones/` | Alta, consulta, actualización parcial y eliminación por recurso. |
| `/pagos/`, `/pagos/idempotencia/{clave}` | Solicitudes de desembolso y consulta por clave de idempotencia. |
| `/eventos-pago/` | Consulta y registro de confirmaciones F7. |
| `GET /health`, `GET /health/db` | Salud de la API y conectividad a PostgreSQL, respectivamente. |

Las rutas de pasajeros aplican RN-11 comparando la cabecera `X-Pasajero-Id` con el pasajero del recurso. Responden `401` si falta, `403` si la identidad declarada no corresponde y `404` si el recurso solicitado no existe. El prototipo acepta la identidad declarada por el cliente. Para exponer estas consultas con datos reales se requiere una capa de autenticación que verifique la identidad.

La clave de idempotencia de `pago` y el identificador externo de `evento_pago` respaldan RN-09. El esquema SQL impone la unicidad de la compensación por segmento y del pago por compensación. [Diccionario de datos](../base-datos-transaccional-seed/diccionario-datos.md).

## Consumidores {/* #consumidores */}

| Proceso | Entrada y salida |
| --- | --- |
| `worker_rds` | Consume `q.rds_writer`. Persiste OOOI, resuelve OpenSky por ICAO24 y clima por IATA. Publica en `q.rds_unresolved` los eventos de fuentes externas que carecen de catálogo. |
| `worker_lake` | Consume `q.lake_writer` y guarda datos crudos en Bronze. Para F2 y F3 escribe NDJSON en `bronze/events/opensky/` y `bronze/events/clima/`. El fallback a disco es opcional para desarrollo. |
| `worker_notificaciones` | Consume `q.notificaciones_email` del exchange topic `vueladata.notificaciones`. Envía correo HTML por SMTP y registra su estado en PostgreSQL. |

`worker_rds` evalúa conexiones y reubicaciones para pasajeros afectados al procesar eventos operacionales. El exchange de notificaciones usa las claves `vuelo.cancelado`, `vuelo.retrasado`, `conexion.en_riesgo` e `itinerario.cambiado`. Para pruebas SMTP usa `EMAIL_DESTINO_PRUEBAS` y suministra las credenciales desde el entorno. [ADR de notificaciones](../adr/006-notificaciones.md).
