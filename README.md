# Weather Scraper API

A Node.js REST API that returns current weather conditions and forecasts for Canadian locations in a clean, normalized JSON format. It geocodes a location name into coordinates, fetches raw weather data from Environment Canada, then enriches and cleans it into a consistent structure with both metric and imperial units.

Built as a portfolio project to demonstrate web scraping, third-party API aggregation, data normalization, and error handling.

## Features

- Current conditions: temperature (F and C), feels-like, dewpoint, humidity, pressure, wind, visibility, and observation station metadata
- 24-hour hourly forecast and multi-day daily forecast
- Automatic timezone resolution via latitude/longitude
- Country and region resolution via reverse geocoding
- Clean, normalized JSON response with consistent key naming across all locations
- Validation and graceful error responses for missing, unknown, or unsupported locations

## Tech Stack

- Node.js (Express 5)
- dotenv for environment configuration
- node-geocoder (OpenStreetMap) for reverse geocoding
- tz-lookup for timezone resolution
- Native fetch for HTTP requests

## How It Works

1. **Geocoding** - the location name is passed to the Open-Meteo geocoding API to resolve coordinates.
2. **Fetch** - the coordinates are used to query the Environment Canada weather API (`weather.gc.ca`).
3. **Enrichment** - the location is reverse-geocoded (country/region) and its timezone resolved.
4. **Normalization** - raw station data is cleaned into a structured, readable format.

## Getting Started

### Prerequisites

- Node.js (version that supports native `fetch`, e.g. Node 18+)

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```
PORT=3000
GEO_CODE_API=https://geocoding-api.open-meteo.com/v1/search?name=
WEB_URL=https://weather.gc.ca/api/app/v3/en/Location/
```

### Running the Server

```bash
npm start
```

The server runs at `http://localhost:3000`.

## Usage

Make a GET request to the root endpoint with a `location` query parameter.

```
GET http://localhost:3000/?location=Toronto
```

### Query Parameters

| Parameter | Type   | Required | Description                          |
|-----------|--------|----------|--------------------------------------|
| location  | string | Yes      | Name of the Canadian city or region  |

### Example Request

```bash
curl "http://localhost:3000/?location=Toronto"
```

### Example Response

```json
{
  "location": {
    "name": "Toronto",
    "Country": "Canada",
    "region": "Ontario",
    "latitude": 43.70643,
    "longitude": -79.39864,
    "timezone": "America/Toronto"
  },
  "current": {
    "observed_At": "Toronto Pearson Int'l Airport",
    "timeStamp": "2026-09-08T13:00:00.000Z",
    "condition": "Partly Cloudy",
    "temperature": {
      "fahrenheit": { "actual": "68.2", "rounded": "68" },
      "celsius": { "actual": "20.1", "rounded": "20" }
    },
    "feelsLike": { "fahrenheit": "75", "celsius": "24" },
    "dewpoint": {
      "fahrenheit": { "actual": "57.6", "rounded": "58" },
      "celsius": { "actual": "14.2", "rounded": "14" },
      "quality": 100
    },
    "humidity": { "value": "69", "quality": 100 },
    "pressure": {
      "fahrenheit": { "current": "30.3", "changed": "0.02" },
      "celsius": { "current": "102.5", "changed": "0.06" },
      "quality": 100
    },
    "wind": {
      "speed": { "fahrenheit": "1", "celsius": "2" },
      "direction": "N",
      "Bearing": "0.0"
    },
    "visibility": {
      "fahrenheit": "15",
      "celsius": "24",
      "quality": 100
    }
  },
  "forecast": {
    "hourly": [
      {
        "time": "10 AM",
        "date": "8 September 2026",
        "epoch": 1788876000,
        "condition": "Mainly sunny",
        "iconCode": "01",
        "temperature": { "fahrenheit": "66", "celsius": "19" },
        "feelsLike": { "fahrenheit": null, "celsius": null },
        "wind": {
          "speed": { "fahrenheit": "6", "celsius": "10" },
          "direction": "SE",
          "gust": { "fahrenheit": null, "celsius": null }
        },
        "precipitation": "0",
        "uvIndex": "4"
      }
    ],
    "daily": [
      {
        "date": "14 September 2026",
        "periodLabel": "Monday Night",
        "summary": "Chance of showers",
        "condition": "Cloudy",
        "iconCode": "06",
        "temperature": {
          "high": { "fahrenheit": "68", "celsius": "20" },
          "low": { "fahrenheit": "68", "celsius": "20" }
        },
        "precipitation": "30",
        "sunHours": "6",
        "title": "Mon, 14 Sep: Chance of showers. High 20. POP 30%"
      }
    ],
    "issuedAt": {
      "hourly": "11:00 AM EDT",
      "daily": "11:00 AM EDT Tuesday 8 September 2026"
    }
  }
}
```

### Response Fields

| Field                | Description                                     |
|----------------------|-------------------------------------------------|
| location             | Resolved place name, country, region, coordinates, timezone |
| current.observed_At  | Observation station name                        |
| current.temperature  | Actual and rounded values in Fahrenheit and Celsius |
| current.feelsLike    | Apparent temperature in F and C                |
| current.dewpoint     | Dew point with quality indicator                |
| current.humidity     | Relative humidity with quality indicator        |
| current.pressure     | Barometric pressure and recent change           |
| current.wind         | Speed, direction, and bearing                   |
| current.visibility   | Visibility distance with quality indicator      |
| forecast.hourly      | 24 hours of conditions, temperature, wind, precipitation, UV index |
| forecast.daily       | Multi-day forecast with high/low, precipitation, sun hours |
| forecast.issuedAt    | Timestamps for when hourly/daily forecasts were issued |

## Error Handling

The API returns clear status codes and JSON messages instead of failing silently.

| Scenario                       | Status | Response                                         |
|--------------------------------|--------|--------------------------------------------------|
| Successful request             | 200    | Weather data                                     |
| Missing `location` parameter   | 400    | `{ "message": "Location Not Found" }`            |
| Location not found by geocoder | 500    | `{ "message": "Location not found" }`            |
| Location outside Canada        | 500    | `{ "message": "Location not supported (Canada only)" }` |
| Upstream service failure       | 500    | Error message                                    |

## Limitations

- Data is sourced from Environment Canada, so this API **only covers Canadian locations**. Non-Canadian cities (e.g. New York, London) return an error.
- Uses the public `weather.gc.ca` application API, which is an unofficial endpoint and is not rate-limited for production use.
- OpenStreetMap reverse geocoding is rate-limited, which can cause occasional slow responses.

## Project Structure

```
├── index.js                  # Server entry point
├── src/
│   ├── app.js                # Express route and request handling
│   └── scripts/
│       ├── intiliazer.js     # Pipeline orchestrator
│       ├── gettingurl.js     # Geocoding + weather URL builder
│       ├── DataCleaner.js    # Response normalization
│       ├── getCountry.js     # Reverse geocoding (country/region)
│       └── GetTimeZone.js    # Timezone resolution
```

---

## For Recruiters

This project demonstrates:

- **API design** - a REST endpoint with query parameters, consistent JSON schema, metadata, and documented error codes
- **Web scraping / API integration** - aggregating data from a government weather API and a geocoding service into a single endpoint
- **Data normalization** - converting inconsistent third-party fields into a clean, predictable structure (dual metric/imperial units, null-safe optional fields)
- **Modular architecture** - a clear pipeline separated into focused modules (geocoding, fetching, cleaning, enrichment)
- **Robustness** - validation of inputs, upstream responses, and error paths with meaningful HTTP status codes
- **Node.js tooling** - Express 5, dotenv configuration, third-party libraries for geocoding and timezones