---
title: 004 Cómputo en ECS Fargate y mensajería RabbitMQ
sidebar_position: 4
---

## Contexto

La API, los consumidores, Airflow y Spark tienen ciclos de vida distintos. Se consideraron EKS para microservicios, Kafka para eventos y un clúster persistente para Spark.

## Decisión

Se eligió ECS Fargate para servicios, Fargate Spot para tareas Spark y RabbitMQ para la mensajería operativa y CeleryExecutor. La API y sus tres workers reutilizan una imagen con comandos de inicio separados. Airflow ejecuta cada etapa en una tarea efímera.

## Consecuencias

Los servicios pueden escalar a cero. Spot puede interrumpir tareas. Los DAGs usan reintentos por defecto y comparten el pool `gold_writer`. Gold histórico deshabilita el reintento automático para evitar un segundo escritor. Los objetivos originales de tiempo y costo dependen de la ejecución y la carga. [DAGs y contrato publicado](../orchestration/index.md).
