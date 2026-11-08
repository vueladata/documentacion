---
id: index
title: VuelaData Technical Documentation
slug: /
description: Central technical documentation for the VuelaData platform.
sidebar_label: Home
sidebar_position: 0
---

# VuelaData Technical Documentation

Welcome to the **VuelaData technical documentation center**. The platform architecture is designed around high cohesion and loose coupling, separating operational responsibilities, event streaming, and big data analytical pipelines.

> [!IMPORTANT]
> ### 🚀 How to Launch the Entire Platform
> The complete platform (PostgreSQL relational database, RabbitMQ message broker, REST API, background workers, OOOI event simulator, and the entire Airflow 3 analytics stack) is launched in a unified, centralized way from the **Orchestration** module:
>
> ```bash
> cd vueladata-orchestration
> docker compose up -d --build
> ```
> Follow the step-by-step setup in the [Platform Orchestration and Deployment](./orchestration/) section.

---

## 📚 Ecosystem Modules

### 1. 🚀 Platform Orchestration and Deployment (`vueladata-orchestration`)

The core orchestration engine and master launchpad for the entire project. Centralizes multi-container infrastructure with Docker Compose, the **Apache Airflow 3.1.5** distributed execution stack powered by Celery and RabbitMQ, and the **Apache Spark 3.5.1** analytics processing engine following the **Medallion Lakehouse** pattern (Bronze, Silver, and Gold).

- **Technologies:** Docker Compose, Apache Airflow 3.1.5, Celery, RabbitMQ, Apache Spark 3.5.1, AWS ECS Fargate & Spot, AWS S3.
- [Open Platform Orchestration and Deployment Documentation →](./orchestration/)
- **Repository:** [github.com/vueladata/vueladata-orchestration](https://github.com/vueladata/vueladata-orchestration)

---

### 2. 🗄️ Transactional Database and Seed (`DB-VuelaData`)

Operational schema on PostgreSQL 16 for VuelaData, complete data dictionary for core business entities, referential integrity rules, and automated scripts for loading repeatable test seed data.

- **Technologies:** PostgreSQL 16, SQL DDL, Python Seed Scripts.
- [Open Transactional Database and Seed Documentation →](./base-datos-transaccional-seed/)
- **Repository:** [github.com/vueladata/DB-VuelaData](https://github.com/vueladata/DB-VuelaData)

---

### 3. ✈️ Flight Schedule and Fleet Rotation (`F6-csv-VuelaData`)

Synthetic route generation, orthodromic distance calculations using the Haversine formula, fictional aircraft tail numbers, and weekly flight schedule generation exported in CSV format.

- **Technologies:** Python, Pandas, NumPy, CSV, uv.
- [Open Flight Schedule and Fleet Rotation Documentation →](./itinerario-rotacion-flota/)
- **Repository:** [github.com/vueladata/F6-csv-VuelaData](https://github.com/vueladata/F6-csv-VuelaData)

---

### 4. 💳 F7 API — Compensation, Payments, and Workers (`API-VuelaData`)

Operational REST service (Source F7) managing operational disruptions, flight delay/cancellation causes, passenger compensation scales, asynchronous payment processing with idempotency, and background workers (`worker_rds`, `worker_lake`, `worker_notificaciones`).

- **Technologies:** FastAPI, SQLAlchemy 2.0, Pydantic v2, PostgreSQL 16, RabbitMQ Topic Exchange, Gmail SMTP, Pytest, Docker.
- [Open F7 API and Workers Documentation →](./api-f7/)
- **Repository:** [github.com/vueladata/API-VuelaData](https://github.com/vueladata/API-VuelaData)

---

### 5. 📡 F4 Stream — OOOI Events Simulator (`Stream-VuelaData`)

Asynchronous telemetry event producer simulating commercial flight lifecycles in real time across aeronautical OOOI phases (*Out*, *Off*, *On*, *In*) with persistent publishing to RabbitMQ and controlled **Chaos Engineering (~10% anomalies)** injection.

- **Technologies:** Python 3.12, Pika (AMQP), RabbitMQ 3, Docker (`python:3.12-slim`), AWS ECS Fargate.
- [Open F4 Stream (OOOI Simulator) Documentation →](./stream-f4/)
- **Repository:** [github.com/vueladata/Stream-VuelaData](https://github.com/vueladata/Stream-VuelaData)

---

:::note[Documentation Scope and Traceability]
All technical documentation is maintained in synchronization with source code repositories, README files, OpenAPI specifications, AMQP messaging contracts, and Infrastructure as Code (IaC) definitions shared by the VuelaData engineering team.
:::
