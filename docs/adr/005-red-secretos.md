---
title: 005 Red de AWS y gestión de secretos
sidebar_position: 5
---

## Contexto

Los contenedores y la base operativa requieren acceso administrativo, salida para dependencias y resolución privada del broker. Se evaluaron acceso directo, servicios administrados de conectividad y una configuración de menor costo para desarrollo.

## Decisión

El diseño separa las subredes de entrada, cómputo y datos. Usa ALB para las interfaces, bastión EC2 para administración de RDS, instancia NAT para salida, Cloud Map para DNS privado y Parameter Store para secretos referenciados por ECS. La conectividad a RDS se controla mediante sus grupos de seguridad.

## Consecuencias

El equipo administra bastión y NAT, y requiere una ruta autorizada para acceder a RDS. La topología descrita es la decisión de diseño. Consulta la [configuración observada en AWS](../orchestration/accesos-aws.md) para el entorno de desarrollo.
