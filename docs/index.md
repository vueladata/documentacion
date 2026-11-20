---
id: index
title: Documentación técnica de VuelaData
slug: /
sidebar_label: Inicio
sidebar_position: 0
---

VuelaData integra operación de vuelos, atención a pasajeros y análisis de puntualidad. PostgreSQL conserva el estado transaccional. RabbitMQ distribuye eventos a los consumidores operacionales y al Data Lake. Airflow ejecuta los lotes de Spark que preparan los datos para Athena y Power BI.

Consulta el [estado de AWS y los enlaces del despliegue](./orchestration/accesos-aws.md). [Los ADR](./adr/index.md) registran las decisiones de arquitectura del proyecto.

| Componente | Documentación | Repositorio |
| --- | --- | --- |
| Airflow, Spark e infraestructura AWS | [Orquestación](./orchestration/index.md) | [vueladata-orchestration](https://github.com/vueladata/vueladata-orchestration) |
| Esquema PostgreSQL y datos de prueba | [Base transaccional y seed](./base-datos-transaccional-seed/index.md) | [vueladata-database](https://github.com/vueladata/vueladata-database) |
| Itinerarios y rotación sintéticos | [Generador F6](./itinerario-rotacion-flota/index.md) | [vueladata-csv](https://github.com/vueladata/vueladata-csv) |
| API de pasajeros y F7, workers y notificaciones | [API y consumidores](./api-f7/index.md) | [vueladata-api](https://github.com/vueladata/vueladata-api) |
| Simulación de eventos operacionales | [Simulador F4](./stream-f4/index.md) | [vueladata-stream](https://github.com/vueladata/vueladata-stream) |

La [portada de pasajeros](https://vueladata.github.io/documentacion/) funciona como prototipo visual. Sus formularios se ejecutan en el navegador sin conexión a la API.
