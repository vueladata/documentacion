---
title: 001 Base operativa en PostgreSQL
sidebar_position: 1
---

## Contexto

Vuelos, reservas, incidencias, compensaciones y pagos requieren consistencia relacional y trazabilidad. Airflow también requiere un almacén de metadatos. Se consideraron PostgreSQL autogestionado en EC2, DynamoDB y dos instancias RDS.

## Decisión

Se eligió Amazon RDS for PostgreSQL con separación lógica entre la base operativa `vueladata` y `airflow_db`. SQLAlchemy mapea el esquema operativo y PostgreSQL impone las restricciones de unicidad de RN-09.

## Consecuencias

RDS administra el motor y las copias de seguridad. Compartir instancia reduce infraestructura y acopla la disponibilidad de operación y orquestación. El ADR original contemplaba PostgreSQL 16 y Multi-AZ para producción. La versión del RDS de desarrollo se registra en la [ficha del entorno](../orchestration/accesos-aws.md). El esquema usado para desarrollo está en [vueladata-database](https://github.com/vueladata/vueladata-database).
