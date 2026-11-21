---
title: AWS endpoints and deployment status
sidebar_position: 1
---

Read-only verification on **November 20, 2026** in `us-east-1`. The public `vueladata-alb` load balancer was active. The API, Airflow, the three workers, and the producer had zero desired and running tasks. RabbitMQ had one running task, and the load balancer marked its target as `unhealthy`. RDS was stopped.

## Endpoints {/* #endpoints */}

| Service | Deployment URL | Observed status |
| --- | --- | --- |
| FastAPI | [Swagger](http://vueladata-alb-1578856342.us-east-1.elb.amazonaws.com/docs), [OpenAPI JSON](http://vueladata-alb-1578856342.us-east-1.elb.amazonaws.com/openapi.json), [Health](http://vueladata-alb-1578856342.us-east-1.elb.amazonaws.com/health), [Health DB](http://vueladata-alb-1578856342.us-east-1.elb.amazonaws.com/health/db) | HTTP listener on port 80. No API targets. |
| Airflow | [Airflow interface](http://vueladata-alb-1578856342.us-east-1.elb.amazonaws.com:8080/) | HTTP listener on port 8080. No Airflow targets. |
| RabbitMQ | [Management console](http://vueladata-alb-1578856342.us-east-1.elb.amazonaws.com:15672/) | HTTP listener on port 15672. Unhealthy target. |
| RabbitMQ AMQP | `rabbitmq.vueladata.local:5672` | Private Cloud Map name for clients within the VPC. |
| PostgreSQL | Instance `vueladata-postgres-dev` | Stopped, running PostgreSQL 18.3 when active. `PubliclyAccessible` is enabled, and the observed rule for port 5432 grants access by security group. |

The listeners use HTTP. These links identify the deployed routes. Use authorized AWS access to inspect internal resources.

## Ingestion and data {/* #ingesta-y-datos */}

The `opensky-schedule` and `openmeteo-schedule` EventBridge rules were enabled and could invoke their functions. Confirmed delivery depends on the broker and both consumers. With the consumers stopped, the review could not verify persistence of new events in RDS or S3.

Glue metadata showed 16 tables in `vueladata_gold_db`: seven Power BI datasets and nine star-schema tables. Follow the [Gold contract and Athena guide](./index.md#qué-publica-spark) when querying or registering data.
