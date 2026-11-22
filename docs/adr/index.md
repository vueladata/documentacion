---
id: decisiones-arquitectura
title: Architecture decision records
---

These six ADRs were adapted from «ADR VuelaData», the project’s design record. The records explain the architecture choices. [AWS endpoints and deployment status](../orchestration/accesos-aws.md) describes the environment and its availability.

- [001 Operational database on PostgreSQL](./001-postgresql.md)
- [002 OpenSky and Open-Meteo ingestion](./002-ingesta-externa.md)
- [003 Analytics with S3, Glue, and Athena](./003-analitica-serverless.md)
- [004 ECS Fargate compute and RabbitMQ messaging](./004-ecs-fargate.md)
- [005 AWS networking and secrets management](./005-red-secretos.md)
- [006 Asynchronous email notifications](./006-notificaciones.md)

## AWS infrastructure {/* #aws-infrastructure */}

![VuelaData AWS architecture showing data sources, ingestion through Lambda and RabbitMQ, processing with Airflow and Spark, and analytics from S3 through Glue, Athena, and Power BI](/img/infraestructura_vueladata_aws.png)

[Open full-size diagram](/img/infraestructura_vueladata_aws.png)
