---
title: 002 Ingesta de OpenSky y Open-Meteo
sidebar_position: 2
---

## Contexto

Las posiciones y observaciones meteorológicas alimentan tanto la operación como el Data Lake. Las fuentes tienen cuotas y se consultan periódicamente. Se consideraron contenedores dedicados al polling y una ingesta Lambda con una sola salida a S3.

## Decisión

Se eligieron dos Lambdas en la VPC, programadas desde EventBridge, con publicación confirmada en el exchange fanout `vueladata.external` y dos consumidores independientes. RabbitMQ se descubre mediante Cloud Map DNS privado. Cuando falla la conexión AMQP y se confirma que el broker está en cero, la Lambda guarda el lote en S3 para su republicación.

## Consecuencias

La entrega es al menos una vez. El backlog se procesa por lotes y RDS puede quedar rezagado. Worker RDS requiere un catálogo ICAO24 o IATA para resolver cada evento. Los casos sin referencia quedan en `q.rds_unresolved`. [Contrato de transporte y replay](https://github.com/vueladata/vueladata-orchestration/tree/main/infrastructure/aws/lambdas).
