---
title: 005 AWS networking and secrets management
sidebar_position: 5
---

## Context {/* #contexto */}

Containers and the operational database require administrative access, outbound access to dependencies, and private broker resolution. The team evaluated direct access, managed connectivity, and a lower-cost development setup.

## Decision {/* #decisión */}

The design separates ingress, compute, and data subnets. It uses an ALB for interfaces, an EC2 bastion for RDS administration, a NAT instance for egress, Cloud Map for private DNS, and Parameter Store for secrets referenced by ECS. RDS security groups control connectivity.

## Consequences {/* #consecuencias */}

The team operates the bastion and NAT instance and needs an authorized route to access RDS. See the [observed AWS configuration](../orchestration/accesos-aws.md) for the development environment.
