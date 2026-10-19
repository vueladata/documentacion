---
id: base-datos-transaccional-seed
title: Transactional Database and Seed
sidebar_label: Transactional DB and Seed
description: PostgreSQL operational schema and initial data loading process for VuelaData.
tags: [postgresql, seed, relational-model, vueladata]
sidebar_position: 2
---

# Transactional Database and Seed

This section contains documents about the operational database structure and the initial loading of test data. The F7 API and the flight schedule generator are documented in separate sections, even though they may use or produce related data.

## Documents

- [Seed Setup](./setup-seed.md): requirements, environment variables, execution, and checks for synthetic data defects.
- [Data Dictionary](./diccionario-datos.md): tables, fields, relationships, and integrity rules described for the `vueladata` schema.

## Schema Scope

The data dictionary describes the operational `vueladata` schema. According to the supplied material, the large F1 historical dataset is processed in the analytical Data Lake and is not part of this transactional database.
