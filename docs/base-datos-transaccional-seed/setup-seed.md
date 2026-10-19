---
id: setup-seed
title: Seed Setup
sidebar_label: Seed Setup
description: Requirements, configuration, and execution of the repeatable VuelaData Seed.
tags: [postgresql, seed, synthetic-data, data-quality]
---

# Repeatable Seed Setup

## Purpose

The Seed loads test data into the VuelaData operational database. According to the module README, it uses a fixed random seed to support repeatable results, can be run more than once without duplicating records, and can inject operational data quality defects with a configurable probability.

## Requirements

- Python 3.9 or newer, according to the Seed README.
- The `airlines.csv` and `airports.csv` files in the same directory as `seed.py`.
- A running PostgreSQL instance.
- The operational schema created first by running `schema_postgresql.sql`.
- The `psycopg2-binary`, `python-dotenv`, `pandas`, and `faker` dependencies.

## Install Dependencies

```bash
pip install psycopg2-binary python-dotenv pandas faker
```

If the repository includes `requirements.txt`, the README says you can also install the dependencies listed in that file.

## Environment Variables

Create a `.env` file in the same directory as `seed.py`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=vueladata
DB_USER=postgres
DB_PASSWORD=your_password_here
```

Do not upload real credentials to the repository. Use local values and limit access to the `.env` file.

## Run the Seed

### Development: Small Batch Without Defects

```bash
python seed.py
```

The README says the default mode (`small`) creates a small batch for quick development, with 10 flights and 50 passengers.

### Full Batch With Synthetic Defects

```bash
python seed.py --volumen=full --tasa-defectos=0.15
```

The documented `--volumen` values are:

| Parameter | Values | Description |
|---|---|---|
| `--volumen` | `small`, `full` | `small` is the default. `full` is intended for volume testing. |
| `--tasa-defectos` | Decimal from `0.0` to `1.0` | Probability of injecting defects. The default is `0.0`. |

The `full` mode is described as 1,000 flights and 5,000 passengers. These defects are synthetic and are used to test data quality controls; they do not necessarily represent real incidents.

## Reset the Generated Data

The README suggests running the following SQL on the `vueladata` database to remove records from the listed tables and dependent tables reached by `CASCADE`:

```sql
TRUNCATE TABLE
    pais,
    aerolinea,
    estado_vuelo,
    causa,
    pasajero,
    reserva
RESTART IDENTITY CASCADE;
```

:::danger[Warning]
This operation deletes data. Run it only in a development or test environment, and first confirm that you are connected to the correct database. Do not drop the tables or the schema.
:::

`CASCADE` also affects dependent tables, and `RESTART IDENTITY` resets the related identity counters. Check the actual schema dependencies before running this command in a shared environment.

## Check Injected Defects

### Invalid Causes

```sql
SELECT id_vuelo, codigo_evento, codigo_causa_original
FROM vueladata.evento_operacional
WHERE codigo_causa_original IN ('N/A', 'CAUSA_DESCONOCIDA', 'ERROR_99');
```

### Flights With Fewer Than Four Events

```sql
SELECT id_vuelo, COUNT(id_evento) AS total_eventos
FROM vueladata.evento_operacional
GROUP BY id_vuelo
HAVING COUNT(id_evento) < 4;
```

### `IN` Arrivals Earlier Than `OUT` Departures

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

## Notes

- Run the Seed after creating the operational schema.
- Make sure the CSV files are in the location expected by the script.
- The README describes a fixed seed and idempotent behavior. If the code changes, check that the current version still supports these features.
