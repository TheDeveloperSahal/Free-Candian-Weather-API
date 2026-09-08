const getTimeZone = require('./GetTimeZone');
const GetCountry = require('./getCountry');
async function DataCleaner(blob, lati, long) {
    let data = [];
    await blob.json()
        .then(async ([response]) => {
            const location = {
                "name": response["observation"]["observedAt"].split(" ")[0],
                "Country": (await GetCountry(lati, long)).country,
                "region": (await GetCountry(lati, long)).state,
                "latitide": lati,
                "longitude": long,
                "timezone": await getTimeZone(lati, long),
            }
            const current = {
                "observed_At": response["observation"]["observedAt"],
                "timeStamp": response["observation"]["timeStamp"],
                "condition": response["observation"]["condition"],
                "temperature": {
                    "fahrenheit": {
                        "actual": response["observation"]["temperature"]["imperialUnrounded"],
                        "rounded": response["observation"]["temperature"]["imperial"],
                    },
                    "celsius": {
                        "Actual": response["observation"]["temperature"]["metricUnrounded"],
                        "rounded": response["observation"]["temperature"]["metric"],
                    }
                },
                "feelsLike": {
                    "fahrenheit": response["observation"]["feelsLike"]["imperial"],
                    "celsius": response["observation"]["feelsLike"]["metric"]
                },
                "dewpoint": {
                    "fahrenheit": {
                        "actual": response["observation"]["dewpoint"]["imperialUnrounded"],
                        "rounded": response["observation"]["dewpoint"]["imperial"],
                    },
                    "celsius": {
                        "Actual": response["observation"]["dewpoint"]["metricUnrounded"],
                        "rounded": response["observation"]["dewpoint"]["metric"],
                    },
                    "quality": response["observation"]["dewpoint"]["qaValue"]
                },
                "humidity": {
                    "value": response["observation"]["humidity"],
                    "quality": response["observation"]["humidityQaValue"]
                },
                "pressure": {
                    "fahrenheit": {
                        "current": response["observation"]["pressure"]["imperial"],
                        "changed": response["observation"]["pressure"]["changeImperial"],
                    },
                    "celsius": {
                        "current": response["observation"]["pressure"]["metric"],
                        "changed": response["observation"]["pressure"]["changeMetric"],
                    },
                    "quality": response["observation"]["pressure"]["qaValue"]
                },
                "wind": {
                    "speed": {
                        "fahrenheit": response["observation"]["windSpeed"]["imperial"],
                        "celsius": response["observation"]["windSpeed"]["metric"],
                    },
                    "direction": response["observation"]["windDirection"],
                    "Bearing": response["observation"]["windBearing"]
                },
                "visibility": {
                    "fahrenheit": response["observation"]["visibility"]["imperial"],
                    "celsius": response["observation"]["visibility"]["metric"],
                    "quality": response["observation"]["visibility"]["qaValue"]
                }
            }
            const forecast = {
                hourly: response.hourlyFcst?.hourly?.map(hour => ({
                    time: hour.time,
                    date: hour.date,
                    epoch: hour.epochTime,
                    condition: hour.condition,
                    iconCode: hour.iconCode,
                    temperature: {
                        fahrenheit: hour.temperature?.imperial,
                        celsius: hour.temperature?.metric
                    },
                    feelsLike: {
                        fahrenheit: hour.feelsLike?.imperial || null,
                        celsius: hour.feelsLike?.metric || null
                    },
                    wind: {
                        speed: {
                            fahrenheit: hour.windSpeed?.imperial,
                            celsius: hour.windSpeed?.metric
                        },
                        direction: hour.windDir,
                        gust: {
                            fahrenheit: hour.windGust?.imperial || null,
                            celsius: hour.windGust?.metric || null
                        }
                    },
                    precipitation: hour.precip || null,
                    uvIndex: hour.uv?.index || null
                })) || [],

                daily: response.dailyFcst?.daily?.map(day => ({
                    date: day.date,
                    periodLabel: day.periodLabel,
                    summary: day.summary,
                    condition: day.text,
                    iconCode: day.iconCode,
                    temperature: {
                        high: {
                            fahrenheit: day.temperature?.imperial,
                            celsius: day.temperature?.metric || day.temperature?.periodHigh
                        },
                        low: {
                            fahrenheit: day.temperature?.imperial,
                            celsius: day.temperature?.periodLow || day.temperature?.metric
                        }
                    },
                    precipitation: day.precip || null,
                    sunHours: day.sun?.value || null,
                    title: day.titleText
                })) || [],

                issuedAt: {
                    hourly: response.hourlyFcst?.hourlyIssuedTimeShrt || null,
                    daily: response.dailyFcst?.dailyIssuedTime || null
                }
            };
            data.push({ location: location, current: current, forecast: forecast })
        })

    return data;
}
module.exports = DataCleaner;