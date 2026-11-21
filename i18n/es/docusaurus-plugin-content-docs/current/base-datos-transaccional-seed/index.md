---
id: base-datos-transaccional-seed
title: Base de datos transaccional y datos de prueba
sidebar_label: Base transaccional y datos de prueba
description: Esquema operativo PostgreSQL y carga inicial de datos para VuelaData.
tags: [postgresql, seed, relational-model, vueladata]
sidebar_position: 2
---

# Base de datos transaccional y datos de prueba

Esta sección cubre la estructura de la base de datos operativa y la carga inicial de datos de prueba. La API F7 y el generador de itinerarios tienen su propia documentación.

## Documentos {/* #documents */}

- [Preparación del seed](./setup-seed.md). Requisitos, variables de entorno, ejecución y verificación de defectos sintéticos.
- [Diccionario de datos](./diccionario-datos.md). Tablas, campos, relaciones y reglas de integridad del esquema `vueladata`.

## Alcance del esquema {/* #schema-scope */}

El diccionario describe el esquema operativo `vueladata`. Airflow guarda sus metadatos en `airflow_db`. Spark procesa el histórico F1 en el lago de datos analítico. [Repositorio de base de datos](https://github.com/vueladata/vueladata-database). [ADR de PostgreSQL](../adr/001-postgresql.md).
