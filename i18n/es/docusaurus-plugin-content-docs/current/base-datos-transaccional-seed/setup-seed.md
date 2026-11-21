---
id: setup-seed
title: Preparación del seed
sidebar_label: Preparación del seed
description: Requisitos y pasos para ejecutar el seed reproducible de VuelaData.
tags: [postgresql, seed, synthetic-data, data-quality]
---

# Carga reproducible de datos de prueba

## Propósito {/* #purpose */}

El seed carga datos de prueba en la base operativa. Inicializa los generadores pseudoaleatorios con 42 e inserta lotes con `ON CONFLICT DO NOTHING` para las claves únicas configuradas. Puede omitir eventos OOOI, generar códigos de causa inválidos y registrar horas de llegada incorrectas en vuelos que cruzan la medianoche.

## Requisitos {/* #requirements */}

- Python y una instancia de PostgreSQL en ejecución.
- `airlines.csv` y `airports.csv` junto a `seed.py`.
- Una base de datos de desarrollo `vueladata` con el esquema operativo.
- Las dependencias de `requirements.txt`.

## Inicializar la base de datos {/* #initialize-the-database */}

Crea la base de desarrollo y ejecuta desde la raíz de [vueladata-database](https://github.com/vueladata/vueladata-database):

```bash
psql -U postgres -d vueladata -v ON_ERROR_STOP=1 -f schema_postgresql.sql
python -m pip install -r requirements.txt
```

## Variables de entorno {/* #environment-variables */}

Crea un archivo `.env` junto a `seed.py` con los datos de tu entorno local.

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=vueladata
DB_USER=postgres
DB_PASSWORD=tu_contraseña
```

Mantén las credenciales fuera del repositorio y restringe el acceso al archivo `.env`.

## Ejecutar el seed {/* #run-the-seed */}

### Lote pequeño sin defectos {/* #development-small-batch-without-defects */}

```bash
python seed.py
```

El modo predeterminado (`small`) prepara 10 vuelos y 50 pasajeros.

### Lote completo con defectos sintéticos {/* #full-batch-with-synthetic-defects */}

```bash
python seed.py --volumen=full --tasa-defectos=0.15
```

| Parámetro | Valores | Descripción |
| --- | --- | --- |
| `--volumen` | `small`, `full` | `small` es el valor predeterminado. `full` prepara 1.000 vuelos y 5.000 pasajeros. |
| `--tasa-defectos` | Decimal entre `0.0` y `1.0` | Probabilidad de inyectar defectos. El valor predeterminado es `0.0`. |

Los defectos sirven para probar controles de calidad con datos sintéticos.

## Restablecer los datos de prueba {/* #reset-the-generated-data */}

Este ejemplo elimina filas de las tablas indicadas y de las dependientes mediante `CASCADE` en una base de desarrollo desechable.

```sql
TRUNCATE TABLE
    vueladata.pais,
    vueladata.aerolinea,
    vueladata.estado_vuelo,
    vueladata.causa,
    vueladata.pasajero,
    vueladata.reserva
RESTART IDENTITY CASCADE;
```

:::danger[Advertencia]
Esta operación elimina datos y reinicia los contadores de identidad. Confirma que estás conectado a la base de pruebas y revisa todas las dependencias antes de ejecutarla.
:::

## Verificar los defectos generados {/* #check-injected-defects */}

### Causas inválidas {/* #invalid-causes */}

```sql
SELECT id_vuelo, codigo_evento, codigo_causa_original
FROM vueladata.evento_operacional
WHERE codigo_causa_original IN ('N/A', 'CAUSA_DESCONOCIDA', 'ERROR_99');
```

### Vuelos con menos de cuatro eventos {/* #flights-with-fewer-than-four-events */}

```sql
SELECT id_vuelo, COUNT(id_evento) AS total_eventos
FROM vueladata.evento_operacional
GROUP BY id_vuelo
HAVING COUNT(id_evento) < 4;
```

### Llegadas `IN` anteriores a la salida `OUT` {/* #in-arrivals-earlier-than-out-departures */}

```sql
SELECT
    e_in.id_vuelo,
    e_out.fecha_hora_evento_utc AS salida_out,
    e_in.fecha_hora_evento_utc AS llegada_in_erronea
FROM vueladata.evento_operacional e_in
JOIN vueladata.evento_operacional e_out
    ON e_in.id_vuelo = e_out.id_vuelo
WHERE e_in.codigo_evento = 'IN'
  AND e_out.codigo_evento = 'OUT'
  AND e_in.fecha_hora_evento_utc < e_out.fecha_hora_evento_utc;
```

La cantidad de resultados depende de los datos generados y de la tasa de defectos configurada.
