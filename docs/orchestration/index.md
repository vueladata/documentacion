---
id: orchestration-platform
title: Orquestación con Airflow y Spark
sidebar_label: Orquestación y despliegue
sidebar_position: 6
tags: [orchestration, airflow, spark, docker-compose, celery, rabbitmq, ecs, fargate, medallion]
---

[Repositorio de orquestación y pasos para desarrollo local](https://github.com/vueladata/vueladata-orchestration). [Estado y accesos del entorno AWS](./accesos-aws.md).

## Cómo circulan los datos

| Fuente | Ruta de entrada |
| --- | --- |
| F1, vuelos históricos | CSV en `bronze/f1_kaggle/`. Spark lee los archivos con esquemas explícitos. |
| F2, posiciones OpenSky | `opensky-ingestor` publica en RabbitMQ. Worker Lake guarda NDJSON en `bronze/events/opensky/`. |
| F3, observaciones Open-Meteo | `openmeteo-ingestor` publica en RabbitMQ. Worker Lake guarda NDJSON en `bronze/events/clima/`. |
| F4, eventos OOOI simulados | El productor emite eventos operacionales. La configuración probada en AWS distribuye a los workers de PostgreSQL y S3. |
| F6, rotación sintética | CSV generados por [vueladata-csv](../itinerario-rotacion-flota/index.md) para `bronze/f6_rotacion/`. |
| F7, pagos simulados | La API registra confirmaciones y estados de pago en PostgreSQL. |

EventBridge programa F2 cada cinco minutos y F3 cada quince. Las Lambdas publican mensajes persistentes en el exchange fanout `vueladata.external`, que entrega a `q.rds_writer` y `q.lake_writer`. Si falla la conexión AMQP y ECS confirma que RabbitMQ está en cero, guardan archivos pendientes en S3. Cuando vuelve el broker, cada invocación intenta republicar hasta cinco archivos y marca los confirmados como `replayed`. La entrega es al menos una vez. [Contrato de ingesta F2 y F3](https://github.com/vueladata/vueladata-orchestration/tree/main/infrastructure/aws/lambdas).

## DAGs que contiene el repositorio

| DAG | Disparo | Etapas |
| --- | --- | --- |
| `dag_daily_batch_spark` | 03:00 UTC (22:00 del día anterior en Colombia) | Valida entradas S3 → Bronze → Silver → Gold. |
| `dag_f1_historico_spark` | Manual | Valida F1 y F6 en Bronze → Silver → Gold. |
| `hu11_prueba_celery` | Manual | Verifica ejecución distribuida en Celery. |

Airflow 3.1.5 usa CeleryExecutor con RabbitMQ. Lanza tareas separadas de Spark 3.5.1 en ECS Fargate Spot. Bronze, Silver y Gold comparten la fecha lógica del proceso. Las etapas ocupan el pool `gold_writer` hasta que termina su tarea ECS. Spot puede interrumpir tareas. Gold histórico tiene deshabilitado el reintento automático para evitar lanzar un segundo proceso escritor.

## Qué publica Spark

- **Bronze** conserva archivos de entrada. El lote diario exporta desde RDS un snapshot fechado de la operación.
- **Silver** normaliza tipos y horas en UTC, deduplica eventos y aparta registros inválidos. El histórico y el diario escriben sus conjuntos de datos para que Gold los pueda leer por separado.
- **Gold** publica Parquet en S3 para Athena y Power BI. El diario reemplaza las particiones afectadas. El histórico compacta Gold en una ubicación temporal antes de publicar. Hay siete conjuntos para Power BI y nueve tablas del modelo estrella en el contrato versionado. `--only-star-model` publica solo el modelo estrella desde Silver. La copia de servicio en RDS con `--sync-rds` es opcional y se ejecuta por separado de ese modo.

Para consultar con Athena, el catálogo de Glue debe coincidir con el esquema físico de Parquet y sus prefijos en S3. Usa `anio` y `mes` en las consultas de tablas particionadas. [Contrato Gold](https://github.com/vueladata/vueladata-orchestration/blob/main/tests/spark/gold_contract.json). [Registro en Athena y consultas CT-10](https://github.com/vueladata/vueladata-orchestration/tree/main/infrastructure/aws/athena).

## Despliegue

ECR almacena imágenes separadas de Airflow, Spark, RabbitMQ, backend y Stream. ECS Fargate ejecuta servicios y Fargate Spot ejecuta las tareas de Spark. Las definiciones y el workflow se versionan en el repositorio de orquestación. La configuración sensible se referencia desde Parameter Store. [ADR de cómputo](../adr/004-ecs-fargate.md). [ADR de red y secretos](../adr/005-red-secretos.md).
