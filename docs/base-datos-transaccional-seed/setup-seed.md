---
id: setup-seed
title: Seed Setup
sidebar_label: Seed Setup
description: Requirements, configuration, and execution of the repeatable VuelaData Seed.
tags: [postgresql, seed, synthetic-data, data-quality]
---

# Repeatable Seed Setup

## Purpose {/* #purpose */}

The Seed loads test data into the VuelaData operational database. It seeds the pseudo-random generators with 42 by default and inserts batches with `ON CONFLICT DO NOTHING` for the configured unique keys. It can generate missing OOOI events, invalid cause codes, and incorrect arrival times for flights crossing midnight.

## Requirements {/* #requirements */}

- Python and a running PostgreSQL instance.
- The `airlines.csv` and `airports.csv` files in the same directory as `seed.py`.
- A development database named `vueladata` with the operational schema.
- The `psycopg2-binary`, `python-dotenv`, `pandas`, and `faker` dependencies.

## Initialize the database {/* #initialize-the-database */}

Run these commands from the root of [vueladata-database](https://github.com/vueladata/vueladata-database) after creating the development database.

```bash
psql -U postgres -d vueladata -v ON_ERROR_STOP=1 -f schema_postgresql.sql
python -m pip install -r requirements.txt
```

## Environment Variables {/* #environment-variables */}

Create a `.env` file in the same directory as `seed.py`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=vueladata
DB_USER=postgres
DB_PASSWORD=your_password_here
```

Do not upload real credentials to the repository. Use local values and limit access to the `.env` file.

## Run the Seed {/* #run-the-seed */}

### Development: Small Batch Without Defects {/* #development-small-batch-without-defects */}

```bash
python seed.py
```

The default mode (`small`) prepares 10 flights and 50 passengers.

### Full Batch With Synthetic Defects {/* #full-batch-with-synthetic-defects */}

```bash
python seed.py --volumen=full --tasa-defectos=0.15
```

The documented `--volumen` values are:

| Parameter | Values | Description |
|---|---|---|
| `--volumen` | `small`, `full` | `small` is the default. `full` is intended for volume testing. |
| `--tasa-defectos` | Decimal from `0.0` to `1.0` | Probability of injecting defects. The default is `0.0`. |

The `full` mode prepares 1,000 flights and 5,000 passengers. These defects are synthetic and are used to test data quality controls; they do not necessarily represent real incidents.

## Reset the Generated Data {/* #reset-the-generated-data */}

This example resets a disposable development database by truncating the listed tables and dependent tables reached by `CASCADE`.

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

:::danger[Warning]
This operation deletes data. Run it only in a development or test environment, and first confirm that you are connected to the correct database. Do not drop the tables or the schema.
:::

`CASCADE` also affects dependent tables, and `RESTART IDENTITY` resets the related identity counters. Check the actual schema dependencies before running this command in a shared environment.

## Check Injected Defects {/* #check-injected-defects */}

### Invalid Causes {/* #invalid-causes */}

```sql
SELECT id_vuelo, codigo_evento, codigo_causa_original
FROM vueladata.evento_operacional
WHERE codigo_causa_original IN ('N/A', 'CAUSA_DESCONOCIDA', 'ERROR_99');
```

### Flights With Fewer Than Four Events {/* #flights-with-fewer-than-four-events */}

```sql
SELECT id_vuelo, COUNT(id_evento) AS total_eventos
FROM vueladata.evento_operacional
GROUP BY id_vuelo
HAVING COUNT(id_evento) < 4;
```

### `IN` Arrivals Earlier Than `OUT` Departures {/* #in-arrivals-earlier-than-out-departures */}

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

These queries look for examples of defects mentioned in the README. The number of results depends on the generated data and the configured defect rate.
