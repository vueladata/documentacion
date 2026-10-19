---
id: index
title: Technical Documentation
slug: /
description: Technical documentation for the VuelaData project.
sidebar_label: Home
sidebar_position: 0
---
# VuelaData Technical Documentation

Welcome to the **VuelaData** technical documentation center. The modules are organized by responsibility, so each component has its own instructions and references.

## Documented Modules

### Transactional Database and Seed

PostgreSQL operational schema, data dictionary, and the process for loading repeatable test data.

[Open Transactional Database and Seed →](./base-datos-transaccional-seed/)

LINK REPO: [github.com/vueladata/DB-VuelaData](https://github.com/vueladata/DB-VuelaData)

### Flight Schedule and Fleet Rotation

Generation of routes, fictional aircraft registrations, and weekly flight schedules in CSV files.

[Open Flight Schedule and Fleet Rotation →](./itinerario-rotacion-flota/)

LINK REPO: [github.com/vueladata/F6-csv-VuelaData](https://github.com/vueladata/F6-csv-VuelaData)

### F7 API — Compensation and Payments

REST service for operational causes, compensation rules, compensation records, payments, and payment events.

[Open F7 API →](./api-f7/)

LINK REPO: [github.com/vueladata/API-VuelaData](https://github.com/vueladata/API-VuelaData)

### F4 Simulator — OOOI Events

Generation and publishing of synthetic OOOI events through RabbitMQ.

[Open F4 Simulator →](./stream-f4-simlator.md)

LINK REPO: [github.com/vueladata/Stream-VuelaData](https://github.com/vueladata/Stream-VuelaData)

:::note[Documentation Scope]
This documentation is based on the README and Markdown files shared by the team. Integrations not described in those files are not presented as confirmed implementations.
:::
