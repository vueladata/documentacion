---
id: generador-itinerarios
title: Flight Schedule and Fleet Rotation Generator
sidebar_label: Flight Schedule Generator
description: Generation of routes, fictional aircraft, and weekly flight schedules in CSV format.
tags: [python, pandas, numpy, csv, synthetic-data]
---

# Flight Schedule and Fleet Rotation Generator

## Purpose

This generator creates synthetic data for the VuelaData flight schedule and fleet rotation module. It uses an airport catalog to calculate distances and estimated flight times, creates fictional aircraft registrations, and assigns aircraft to flights in a weekly schedule.

The data is for simulation and testing. It is not a real commercial flight schedule.

## Technologies

- Python.
- Pandas to load, clean, transform, and export tabular data.
- NumPy for numerical calculations and repeatable random values.
- CSV as the input and output format.
- `uv` to manage dependencies and run the project.

## Repository Structure

```text
data-sources/
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

The README identifies `airports.csv` as the main source. `airlines.csv` is available as a reference, but the current generator does not need to use it directly. The script does not create an additional airport CSV.

## Source: `airports.csv`

The catalog contains fields such as:

| Column | Description |
|---|---|
| `IATA_CODE` | Airport IATA code. |
| `AIRPORT` | Airport name. |
| `CITY` | City. |
| `STATE` | State or administrative region. |
| `COUNTRY` | Country. |
| `LATITUDE` | Geographic latitude. |
| `LONGITUDE` | Geographic longitude. |

The process converts coordinates to numbers, removes records without valid coordinates, and removes duplicate IATA codes. The documented runs started with 322 records and produced 319 usable airports.

## Generation Process

1. **Load and clean data:** keep airports with an IATA code and valid coordinates. There is no maximum-distance filter.
2. **Calculate distances:** use the Haversine formula to calculate geographic distances.
3. **Estimate duration:** divide the distance by the configured average speed and add extra minutes.
4. **Create synthetic routes:** find the three closest airports to each airport and create routes in both directions, removing duplicates.
5. **Create a fictional fleet:** create 30 aircraft registrations, from `SIM-001` to `SIM-030`.
6. **Create the weekly schedule:** aim to generate 2,700 flights over seven days and assign aircraft registrations to flights.
7. **Validate the schedule:** check overlapping flights, route continuity, ground time, and the seven-day period.

## Duration Formula

```text
Estimated duration (minutes) =
    (Distance in km / Average speed in km/h) × 60
    + Extra minutes
```

The README describes these settings:

| Parameter | Value |
|---|---:|
| Average speed | 750 km/h |
| Extra time | 30 minutes |
| Ground time between consecutive flights | 45 minutes |
| Fictional aircraft registrations | 30 |
| Weekly schedule target | 2,700 flights |

These values are for simulation. The estimated duration does not include every factor involved in a real flight operation.

## Output Files

### `synthetic_routes.csv`

| Column | Description |
|---|---|
| `origin_airport` | Origin airport IATA code. |
| `destination_airport` | Destination airport IATA code. |
| `distance_km` | Estimated geographic distance. |
| `estimated_duration_minutes` | Estimated travel time. |

### `synthetic_fleet.csv`

| Column | Description |
|---|---|
| `aircraft_registration` | Fictional aircraft registration. |

### `synthetic_weekly_itinerary.csv`

| Column | Description |
|---|---|
| `flight_id` | Unique synthetic flight ID. |
| `flight_date` | Scheduled flight date. |
| `origin_airport` | Origin airport. |
| `destination_airport` | Destination airport. |
| `aircraft_registration` | Assigned aircraft registration. |
| `scheduled_departure` | Scheduled departure date and time. |
| `scheduled_arrival` | Estimated arrival date and time. |
| `distance_km` | Estimated distance. |
| `scheduled_duration_minutes` | Estimated duration in minutes. |

## Install and Run

Open a terminal in the `fleet_itinerary` folder.

Install or sync the declared dependencies:

```powershell
uv sync
```

Run the generator:

```powershell
uv run python generate_fleet_itinerary.py
```

The script prints information about airports, routes, the fleet, and validation results. The CSV files are saved in `output/`.

## Validation and Limits

The generator checks:

- Flights do not go beyond the weekly period.
- Flights assigned to the same aircraft do not overlap.
- The destination of one flight matches the origin of the next flight assigned to that aircraft.
- The minimum ground time is respected.
- The expected number of flights is reached.

If the generator cannot create a valid schedule, it should report an error instead of presenting an incomplete schedule as valid.

:::caution[How to Read the Results]
An airport being part of the network does not guarantee that it will appear in the weekly schedule. The number of flights that can be scheduled depends on distances, estimated durations, ground time, and aircraft availability.
:::

## Connection to the Transactional Database

The generator creates CSV files. The README does not describe an automatic load of these files into PostgreSQL or an import contract for the transactional database. This integration should be documented when a confirmed process exists.
