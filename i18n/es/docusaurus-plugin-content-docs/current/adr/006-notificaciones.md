---
title: 006 Notificaciones asíncronas por correo
sidebar_position: 6
---

## Contexto {/* #contexto */}

Los retrasos, cancelaciones, conexiones en riesgo y reubicaciones requieren avisos trazables. Se consideró enviar correo dentro de la transacción o procesar el envío en un servicio independiente.

## Decisión {/* #decisión */}

Worker RDS publica avisos en el exchange topic `vueladata.notificaciones`. El consumidor `worker_notificaciones` lee `q.notificaciones_email`, envía correo HTML por SMTP y registra `PENDIENTE`, `ENVIADA` o `FALLIDA` en PostgreSQL.

## Consecuencias {/* #consecuencias */}

SMTP queda fuera de la transacción operacional. Los reintentos y el estado del mensaje permiten seguir los fallos. En desarrollo, `EMAIL_DESTINO_PRUEBAS` redirige los mensajes a un buzón controlado. [Flujo de notificaciones y API](../api-f7/index.md).
