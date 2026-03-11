import axios from "axios";

const WEATHER_API = "https://api.open-meteo.com/v1/forecast";

export async function getWeather(lat: number, lon: number) {
  const res = await axios.get(WEATHER_API, {
    params: {
      latitude: lat,
      longitude: lon,
      current_weather: true
    }
  });

  return res.data.current_weather;
}