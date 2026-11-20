---
id: decisiones-arquitectura
title: Decisiones de arquitectura
---

Estos seis ADR se adaptaron de «ADR VuelaData», el registro de diseño del proyecto. Las decisiones describen la arquitectura elegida. La disponibilidad y configuración del entorno se documentan en [Accesos y estado de AWS](../orchestration/accesos-aws.md).

- [001 Base operativa en PostgreSQL](./001-postgresql.md)
- [002 Ingesta de OpenSky y Open-Meteo](./002-ingesta-externa.md)
- [003 Capa analítica en S3, Glue y Athena](./003-analitica-serverless.md)
- [004 Cómputo en ECS Fargate y mensajería RabbitMQ](./004-ecs-fargate.md)
- [005 Red de AWS y gestión de secretos](./005-red-secretos.md)
- [006 Notificaciones asíncronas por correo](./006-notificaciones.md)
