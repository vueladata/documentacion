---
title: 002 OpenSky and Open-Meteo ingestion
sidebar_position: 2
---

## Context {/* #contexto */}

Aircraft positions and weather observations feed the operational database and the data lake. Both sources have quotas and are polled periodically. The team considered dedicated polling containers and Lambda ingestion that writes only to S3.

## Decision {/* #decisión */}

Use two Lambda functions in the VPC, scheduled through EventBridge, with publisher confirms on the `vueladata.external` fanout exchange and two independent consumers. Cloud Map provides private DNS for RabbitMQ. When the AMQP connection fails and the broker is confirmed to have scaled to zero, the function stores the batch in S3 for replay.

## Consequences {/* #consecuencias */}

Delivery is at least once. The backlog is processed in batches, so RDS can lag. Worker RDS needs ICAO24 or IATA catalog entries to resolve events. Unmatched records go to `q.rds_unresolved`. [Transport and replay contract](https://github.com/vueladata/vueladata-orchestration/tree/main/infrastructure/aws/lambdas).
