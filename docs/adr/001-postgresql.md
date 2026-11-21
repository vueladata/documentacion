---
title: 001 Operational database on PostgreSQL
sidebar_position: 1
---

## Context {/* #contexto */}

Flights, bookings, disruptions, compensation, and payments require relational consistency and traceability. Airflow also needs a metadata store. The team considered self-managed PostgreSQL on EC2, DynamoDB, and two RDS instances.

## Decision {/* #decisión */}

Use Amazon RDS for PostgreSQL with separate logical databases for operations (`vueladata`) and Airflow metadata (`airflow_db`). SQLAlchemy maps the operational schema, and PostgreSQL enforces the unique constraints required by RN-09.

## Consequences {/* #consecuencias */}

RDS manages the engine and backups. Sharing an instance reduces infrastructure and couples the availability of operations and orchestration. The original ADR considered PostgreSQL 16 and Multi-AZ for production. The [AWS environment page](../orchestration/accesos-aws.md) records the development RDS version. [Development schema repository](https://github.com/vueladata/vueladata-database).
