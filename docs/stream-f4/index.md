---
id: stream-f4-simulator
title: F4 OOOI event simulator
sidebar_label: F4 simulator
sidebar_position: 5
tags: [stream, rabbitmq, oooi, python, docker, fargate, chaos-engineering]
---

F4 generates synthetic flight events to test ingestion and data validation. The OOOI cycle tracks four flight milestones.

| Code | Milestone |
| --- | --- |
| `OUT` | Gate departure. |
| `OFF` | Takeoff. |
| `ON` | Landing. |
| `IN` | Gate arrival. |

Each message contains `id_externo_evento` (UUID), `id_vuelo`, `numero_vuelo`, `codigo_evento`, `fecha_hora_evento_utc` (ISO 8601), and nullable `codigo_causa_original`. The generator injects defects with a probability of 10% per flight. It can omit `ON`, emit cause code `ERROR_99`, or record `IN` before `OUT`.

## Published code {/* #código-publicado */}

The producer runs a finite batch of flights generated in memory. `TOTAL_VUELOS` sets the batch size and `STREAM_DELAY_SECONDS` sets the interval between publications. The producer publishes to the durable `QUEUE_NAME` queue via RabbitMQ's default exchange. The default queue is `eventos_oooi_queue`. Consumers on another queue require compatible routing. [Local setup and test consumer](https://github.com/vueladata/vueladata-stream).

## Configuration tested on AWS {/* #configuración-probada-en-aws */}

The tested ECS revision read an existing flight schedule from RDS. It used publisher confirms and published to the `vueladata.oooi` fanout exchange bound to `q.rds_writer` and `q.lake_writer`. Messages included `simulated=true`, `source=stream_f4`, and `event_type=oooi`. The published code uses the direct queue described above.

To verify delivery end to end, look up the same UUID in CloudWatch, in `vueladata.evento_operacional`, and in S3 under `bronze/events/oooi/`. [ECS status and AWS RabbitMQ access](../orchestration/accesos-aws.md).
