---
title: 003 Capa analítica en S3, Glue y Athena
sidebar_position: 3
---

## Contexto {/* #contexto */}

Power BI necesita consultar vuelos históricos y diarios sin trasladar esa carga a la base operativa. Se consideraron Redshift aprovisionado y consultas directas a PostgreSQL.

## Decisión {/* #decisión */}

Spark escribe Parquet en S3 bajo la arquitectura Medallion. Glue Data Catalog expone los conjuntos Gold a Athena para las consultas de Power BI y los controles CT-10. Se versionan siete conjuntos para Power BI y nueve tablas del modelo estrella.

## Consecuencias {/* #consecuencias */}

Las consultas analíticas quedan desacopladas del servicio transaccional. El costo de Athena depende del volumen escaneado. Los cambios de esquema y particiones deben reflejarse en el catálogo. [Contrato Gold y consultas CT-10](../orchestration/index.md#qué-publica-spark).
