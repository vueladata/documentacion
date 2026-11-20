---
id: stream-f4-simulator
title: Simulador F4 de eventos OOOI
sidebar_label: Simulador F4
sidebar_position: 5
tags: [stream, rabbitmq, oooi, python, docker, fargate, chaos-engineering]
---

F4 genera eventos de vuelo sintéticos para probar la ingesta y la validación de datos. El ciclo OOOI distingue cuatro hitos de un vuelo.

| Código | Hito |
| --- | --- |
| `OUT` | Salida de la puerta. |
| `OFF` | Despegue. |
| `ON` | Aterrizaje. |
| `IN` | Llegada a la puerta. |

Cada mensaje contiene `id_externo_evento` (UUID), `id_vuelo`, `numero_vuelo`, `codigo_evento`, `fecha_hora_evento_utc` (ISO 8601) y `codigo_causa_original` (nullable). El generador introduce defectos con una probabilidad del 10 % por vuelo. Puede omitir `ON`, emitir la causa `ERROR_99` o registrar un `IN` anterior a `OUT`.

## Código publicado

El productor ejecuta un lote finito de vuelos generados en memoria. Usa `TOTAL_VUELOS` para el tamaño del lote y `STREAM_DELAY_SECONDS` para la espera entre publicaciones. Publica en la cola durable `QUEUE_NAME` mediante el exchange predeterminado de RabbitMQ. El valor predeterminado es `eventos_oooi_queue`. Para usar un consumidor de otra cola se debe configurar un enrutamiento compatible. [Ejecución local y consumidor de prueba](https://github.com/vueladata/vueladata-stream).

## Configuración probada en AWS

La revisión probada del servicio ECS consultó una agenda de vuelos existentes de RDS en modo lectura. Publicó con confirmación del broker en el exchange fanout `vueladata.oooi` conectado a `q.rds_writer` y `q.lake_writer`. Identificó los mensajes con `simulated=true`, `source=stream_f4` y `event_type=oooi`. El código publicado conserva el modo de cola directa descrito arriba.

Para comprobar una entrega completa, busca el mismo UUID en CloudWatch, en `vueladata.evento_operacional` y en S3 bajo `bronze/events/oooi/`. [Estado de ECS y acceso de RabbitMQ en AWS](../orchestration/accesos-aws.md).
