---
title: Accesos y estado de AWS
sidebar_position: 1
---

Verificación de solo lectura del **20 de noviembre de 2026** en `us-east-1`. El balanceador público `vueladata-alb` sigue activo. La API, Airflow, los tres workers y el productor tienen cero tareas deseadas y en ejecución. RabbitMQ tiene una tarea en ejecución y el balanceador reporta su destino como `unhealthy`. RDS está detenido.

## Endpoints {/* #endpoints */}

| Servicio | URL del despliegue | Estado observado |
| --- | --- | --- |
| FastAPI | [Swagger](http://vueladata-alb-1578856342.us-east-1.elb.amazonaws.com/docs), [OpenAPI JSON](http://vueladata-alb-1578856342.us-east-1.elb.amazonaws.com/openapi.json), [Health](http://vueladata-alb-1578856342.us-east-1.elb.amazonaws.com/health), [Health DB](http://vueladata-alb-1578856342.us-east-1.elb.amazonaws.com/health/db) | Listener HTTP en 80. Sin destinos de API. |
| Airflow | [Interfaz de Airflow](http://vueladata-alb-1578856342.us-east-1.elb.amazonaws.com:8080/) | Listener HTTP en 8080. Sin destinos de Airflow. |
| RabbitMQ | [Consola de administración](http://vueladata-alb-1578856342.us-east-1.elb.amazonaws.com:15672/) | Listener HTTP en 15672. Destino sin salud. |
| RabbitMQ AMQP | `rabbitmq.vueladata.local:5672` | Nombre privado de Cloud Map para clientes dentro de la VPC. |
| PostgreSQL | Instancia `vueladata-postgres-dev` | Detenida y en PostgreSQL 18.3. El atributo `PubliclyAccessible` está habilitado, y la regla observada para 5432 autoriza por grupo de seguridad. |

Los listeners identificados usan HTTP. Los enlaces permiten identificar las rutas desplegadas. Para consultar recursos internos, usa el acceso autorizado de AWS.

## Ingesta y datos {/* #ingesta-y-datos */}

Las reglas EventBridge `opensky-schedule` y `openmeteo-schedule` seguían habilitadas. Estar habilitadas indica que pueden invocar sus funciones. La confirmación de entrega depende del broker y de los dos consumidores. Con los consumidores detenidos, esta revisión no certifica persistencia de eventos nuevos en RDS o S3.

El catálogo `vueladata_gold_db` registra 16 tablas: siete conjuntos para Power BI y nueve tablas del modelo estrella. La consulta fue de metadatos de Glue. Sigue el [contrato Gold y la guía de Athena](./index.md#qué-publica-spark) al consultar o registrar datos.
