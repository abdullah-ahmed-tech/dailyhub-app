export type SavedCity = {
  name: string;
  country?: string;
  latitude: number;
  longitude: number;
};

export type ResolvedTarget = SavedCity & {
  source: "device" | "saved-city";
};

export type WeatherNow = {
  temperature: number;
  apparentTemperature: number;
  weatherCode: number;
  humidity: number;
  windSpeed: number;
  isDay: boolean;
};

export type HourlyForecastItem = {
  time: string;
  temperature: number;
  weatherCode: number;
};

export type DailyForecastItem = {
  date: string;
  weatherCode: number;
  max: number;
  min: number;
};

export type WeatherPayload = {
  place: string;
  timezone: string;
  now: WeatherNow;
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
  updatedAt: string;
};

export type MarketItem = {
  id: string;
  label: string;
  value: number;
  unit: string;
  change24h?: number | null;
};

export type MarketsPayload = {
  items: MarketItem[];
  updatedAt: string;
};

export type NewsItem = {
  id: string;
  title: string;
  url: string;
  source: string;
  publishedAt?: string;
  image?: string;
  summary?: string;
};

export type NewsPayload = {
  politics: NewsItem[];
  sports: NewsItem[];
  updatedAt: string;
};