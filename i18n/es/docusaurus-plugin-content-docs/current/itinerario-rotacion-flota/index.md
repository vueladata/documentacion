---
id: generador-itinerarios
title: Generador de itinerarios y rotación de flota
sidebar_label: Generador de itinerarios
description: Generación de rutas, aeronaves ficticias e itinerarios semanales en CSV.
tags: [python, pandas, numpy, csv, synthetic-data]
---

# Generador de itinerarios y rotación de flota

## Propósito {/* #purpose */}

F6 genera datos sintéticos para simulación y pruebas. Usa un catálogo de aeropuertos para calcular distancias y tiempos estimados, crea matrículas ficticias y asigna una aeronave a cada vuelo de un itinerario semanal.

## Tecnologías {/* #technologies */}

- Python 3.13 o posterior.
- Pandas para leer, limpiar, transformar y exportar los datos.
- NumPy para cálculos numéricos y resultados pseudoaleatorios reproducibles.
- CSV para las entradas y resultados.
- `uv` para instalar dependencias y ejecutar el proyecto.

## Estructura del repositorio {/* #repository-structure */}

```text
vueladata-csv/
├── reference/
│   ├── airports.csv
│   └── airlines.csv
└── fleet_itinerary/
    ├── generate_fleet_itinerary.py
    ├── pyproject.toml
    ├── uv.lock
    └── output/
        ├── synthetic_routes.csv
        ├── synthetic_fleet.csv
        └── synthetic_weekly_itinerary.csv
```

El generador usa `reference/airports.csv`. El archivo `airlines.csv` sirve como referencia. El script produce los tres CSV de `output/`.

## Catálogo `airports.csv` {/* #source-airportscsv */}

| Columna | Descripción |
| --- | --- |
| `IATA_CODE` | Código IATA del aeropuerto. |
| `AIRPORT` | Nombre del aeropuerto. |
| `CITY` | Ciudad. |
| `STATE` | Estado o región administrativa. |
| `COUNTRY` | País. |
| `LATITUDE` | Latitud. |
| `LONGITUDE` | Longitud. |

El script convierte las coordenadas a números, descarta registros con coordenadas inválidas y elimina códigos IATA duplicados. De 322 registros quedaron 319 aeropuertos válidos en la ejecución de referencia.

## Proceso de generación {/* #generation-process */}

1. Conserva los aeropuertos con código IATA y coordenadas válidas. La red admite cualquier distancia.
2. Calcula distancias geográficas con la fórmula de Haversine.
3. Divide la distancia por la velocidad configurada y añade minutos para estimar la duración.
4. Crea rutas de ida y vuelta entre cada aeropuerto y sus tres vecinos más cercanos. Elimina duplicados.
5. Genera 30 matrículas ficticias, de `SIM-001` a `SIM-030`.
6. Asigna matrículas a los 2.700 vuelos previstos durante siete días.
7. Valida solapamientos, continuidad, tiempo en tierra y el período semanal.

## Duración estimada {/* #duration-formula */}

```text
Duración estimada (minutos) =
    (Distancia en km / Velocidad media en km/h) × 60
    + Minutos adicionales
```

| Parámetro | Valor |
| --- | ---: |
| Velocidad media | 750 km/h |
| Tiempo adicional | 30 minutos |
| Tiempo en tierra entre vuelos consecutivos | 45 minutos |
| Matrículas ficticias | 30 |
| Objetivo semanal | 2.700 vuelos |
| Inicio de semana | 2026-10-19 |
| Semilla aleatoria | 42 |

Los valores son parámetros de simulación. La duración estimada simplifica las variables de la operación real.

## Archivos de salida {/* #output-files */}

### `synthetic_routes.csv` {/* #synthetic_routescsv */}

| Columna | Descripción |
| --- | --- |
| `origin_airport` | Código IATA de origen. |
| `destination_airport` | Código IATA de destino. |
| `distance_km` | Distancia geográfica estimada. |
| `estimated_duration_minutes` | Duración estimada en minutos. |

### `synthetic_fleet.csv` {/* #synthetic_fleetcsv */}

| Columna | Descripción |
| --- | --- |
| `aircraft_registration` | Matrícula ficticia. |

### `synthetic_weekly_itinerary.csv` {/* #synthetic_weekly_itinerarycsv */}

| Columna | Descripción |
| --- | --- |
| `flight_id` | Identificador único del vuelo sintético. |
| `flight_date` | Fecha programada del vuelo. |
| `origin_airport` | Aeropuerto de origen. |
| `destination_airport` | Aeropuerto de destino. |
| `aircraft_registration` | Matrícula asignada. |
| `scheduled_departure` | Fecha y hora programadas de salida. |
| `scheduled_arrival` | Fecha y hora estimadas de llegada. |
| `distance_km` | Distancia geográfica estimada. |
| `scheduled_duration_minutes` | Duración estimada en minutos. |

## Instalar y ejecutar {/* #install-and-run */}

Desde el directorio `fleet_itinerary`, instala las dependencias y ejecuta el generador.

```powershell
uv sync --locked --no-install-project
uv run --no-sync python generate_fleet_itinerary.py
```

El script imprime el resumen de aeropuertos, rutas, flota y validaciones. Los CSV se guardan en `output/`.

## Validaciones y límites {/* #validation-and-limits */}

El generador verifica que los vuelos estén dentro de la semana, que una aeronave no tenga vuelos solapados, que el destino de un vuelo coincida con el origen del siguiente, que se cumpla el tiempo mínimo en tierra y que se alcance el número de vuelos previsto. Si no puede generar un itinerario válido, emite un error.

La presencia de un aeropuerto en la red no garantiza que aparezca en el itinerario. El número de vuelos depende de distancias, duraciones, tiempo en tierra y disponibilidad de aeronaves.

## Integración con el lago de datos {/* #data-lake-integration */}

El generador escribe los tres CSV de F6 localmente. Spark los lee desde `bronze/f6_rotacion/` una vez que se cargan en S3. [Entradas del ETL](../orchestration/index.md#cómo-circulan-los-datos). [Repositorio del generador](https://github.com/vueladata/vueladata-csv).
