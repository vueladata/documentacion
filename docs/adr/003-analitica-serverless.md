---
title: 003 Analytics with S3, Glue, and Athena
sidebar_position: 3
---

## Context {/* #contexto */}

Power BI needs to query historical and daily flights without placing that load on the operational database. The team considered provisioned Redshift and direct PostgreSQL queries.

## Decision {/* #decisión */}

Spark writes Parquet to S3 in a medallion architecture. Glue Data Catalog exposes Gold datasets to Athena for Power BI queries and CT-10 checks. Seven Power BI datasets and nine star-schema tables are versioned.

## Consequences {/* #consecuencias */}

Analytical queries run independently of the transactional service. Athena costs depend on the amount of data scanned. Schema and partition changes must be reflected in the catalog. [Gold contract and CT-10 queries](../orchestration/index.md#qué-publica-spark).
