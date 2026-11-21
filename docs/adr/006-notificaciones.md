---
title: 006 Asynchronous email notifications
sidebar_position: 6
---

## Context {/* #contexto */}

Delays, cancellations, at-risk connections, and rebooking require traceable notifications. The team considered sending email within the transaction or processing it in a separate service.

## Decision {/* #decisión */}

Worker RDS publishes notices to the `vueladata.notificaciones` topic exchange. The `worker_notificaciones` consumer reads `q.notificaciones_email`, sends HTML email via SMTP, and records `PENDIENTE`, `ENVIADA`, or `FALLIDA` in PostgreSQL.

## Consequences {/* #consecuencias */}

SMTP runs outside the operational transaction. Retries and message status help track delivery failures. In development, `EMAIL_DESTINO_PRUEBAS` reroutes messages to a controlled mailbox. [Notifications and API](../api-f7/index.md).
