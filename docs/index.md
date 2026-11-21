---
id: index
title: VuelaData technical documentation
slug: /
sidebar_label: Home
sidebar_position: 0
---

VuelaData brings together flight operations, passenger services, and on-time performance analysis. PostgreSQL stores transactional state. RabbitMQ distributes events to operational consumers and the data lake. Airflow runs the Spark batches that prepare data for Athena and Power BI.

See [AWS endpoints and deployment status](./orchestration/accesos-aws.md). The [architecture decision records](./adr/index.md) explain the project's design choices.

| Component | Documentation | Repository |
| --- | --- | --- |
| Airflow, Spark, and AWS infrastructure | [Orchestration](./orchestration/index.md) | [vueladata-orchestration](https://github.com/vueladata/vueladata-orchestration) |
| PostgreSQL schema and test data | [Transactional database and seed](./base-datos-transaccional-seed/index.md) | [vueladata-database](https://github.com/vueladata/vueladata-database) |
| Synthetic schedules and fleet rotation | [F6 generator](./itinerario-rotacion-flota/index.md) | [vueladata-csv](https://github.com/vueladata/vueladata-csv) |
| Passenger and F7 API, workers, and notifications | [API and workers](./api-f7/index.md) | [vueladata-api](https://github.com/vueladata/vueladata-api) |
| Simulated operational events | [F4 simulator](./stream-f4/index.md) | [vueladata-stream](https://github.com/vueladata/vueladata-stream) |

The [passenger homepage](https://vueladata.github.io/documentacion/) is a visual prototype. Its forms run in the browser without calling the API.
