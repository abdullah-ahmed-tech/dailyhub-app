import { useQuery } from "@tanstack/react-query";
import { getMarkets } from "../services/markets.service";
import { getNews } from "../services/news.service";
import { getWeatherByCoords } from "../services/weather.service";

export function useWeatherQuery(
  latitude?: number,
  longitude?: number,
  place?: string
) {
  return useQuery({
    queryKey: ["weather", latitude, longitude, place],
    queryFn: () => getWeatherByCoords(latitude!, longitude!, place || "Unknown"),
    enabled: Boolean(latitude && longitude && place),
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 1,
  });
}

export function useMarketsQuery() {
  return useQuery({
    queryKey: ["markets"],
    queryFn: getMarkets,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 1,
  });
}

export function useNewsQuery() {
  return useQuery({
    queryKey: ["news"],
    queryFn: getNews,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 1,
  });
}