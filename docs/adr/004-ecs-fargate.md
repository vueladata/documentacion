---
title: 004 ECS Fargate compute and RabbitMQ messaging
sidebar_position: 4
---

## Context {/* #contexto */}

The API, consumers, Airflow, and Spark have different lifecycles. The team considered EKS for microservices, Kafka for events, and a persistent Spark cluster.

## Decision {/* #decisión */}

Use ECS Fargate for services, Fargate Spot for Spark tasks, and RabbitMQ for operational messaging and CeleryExecutor. The API and its three workers share an image with separate startup commands. Airflow runs each stage in an ephemeral task.

## Consequences {/* #consecuencias */}

Services can scale to zero. Spot can interrupt tasks. DAGs retry by default and share the `gold_writer` pool. Historical Gold disables automatic retries to avoid a second writer. Delivery time and cost depend on the run and workload. [DAGs and published contract](../orchestration/index.md).
