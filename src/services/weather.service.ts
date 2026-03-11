import axios from "axios";
import { readJson, writeJson } from "../lib/storage";
import type { SavedCity, WeatherPayload } from "../types/app";

const WEATHER_CACHE_PREFIX = "cache:weather:";
const CITY_SEARCH_URL = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_URL = "https://api.open-meteo.com/v1/forecast";

type ForecastResponse = {
  timezone: string;
  current: {
    temperature_2m: number;
    apparent_temperature: number;
    weather_code: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    is_day: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    weather_code: number[];
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
  };
};

export async function searchCities(query: string): Promise<SavedCity[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const response = await axios.get(CITY_SEARCH_URL, {
    params: {
      name: trimmed,
      count: 8,
      language: "en",
      format: "json",
    },
    timeout: 15000,
  });

  const results = response.data?.results ?? [];
  return results.map((item: any) => ({
    name: item.name,
    country: item.country,
    latitude: item.latitude,
    longitude: item.longitude,
  }));
}

function mapForecast(place: string, data: ForecastResponse): WeatherPayload {
  return {
    place,
    timezone: data.timezone,
    now: {
      temperature: data.current.temperature_2m,
      apparentTemperature: data.current.apparent_temperature,
      weatherCode: data.current.weather_code,
      humidity: data.current.relative_humidity_2m,
      windSpeed: data.current.wind_speed_10m,
      isDay: Boolean(data.current.is_day),
    },
    hourly: data.hourly.time.slice(0, 12).map((time, index) => ({
      time,
      temperature: data.hourly.temperature_2m[index],
      weatherCode: data.hourly.weather_code[index],
    })),
    daily: data.daily.time.slice(0, 7).map((date, index) => ({
      date,
      weatherCode: data.daily.weather_code[index],
      max: data.daily.temperature_2m_max[index],
      min: data.daily.temperature_2m_min[index],
    })),
    updatedAt: new Date().toISOString(),
  };
}

export async function getWeatherByCoords(
  latitude: number,
  longitude: number,
  place: string
): Promise<WeatherPayload> {
  const cacheKey = `${WEATHER_CACHE_PREFIX}${latitude.toFixed(3)}:${longitude.toFixed(3)}`;

  try {
    const response = await axios.get<ForecastResponse>(WEATHER_URL, {
      params: {
        latitude,
        longitude,
        timezone: "auto",
        current: [
          "temperature_2m",
          "apparent_temperature",
          "weather_code",
          "relative_humidity_2m",
          "wind_speed_10m",
          "is_day",
        ].join(","),
        hourly: ["temperature_2m", "weather_code"].join(","),
        daily: [
          "weather_code",
          "temperature_2m_max",
          "temperature_2m_min",
        ].join(","),
        forecast_days: 7,
      },
      timeout: 20000,
    });

    const payload = mapForecast(place, response.data);
    await writeJson(cacheKey, payload);
    return payload;
  } catch {
    const cached = await readJson<WeatherPayload>(cacheKey);
    if (cached) return cached;
    throw new Error("Unable to load weather data.");
  }
}