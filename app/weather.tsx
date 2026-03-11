import React from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getWeatherEmoji, getWeatherLabel } from "../src/constants/weather";
import {
  formatDateLabel,
  formatPercent,
  formatTemp,
  formatTimeLabel,
  formatWind,
} from "../src/lib/format";
import { useResolvedLocation } from "../src/hooks/use-resolved-location";
import { useWeatherQuery } from "../src/queries";
import { theme } from "../src/theme";

export default function WeatherScreen() {
  const { target, notice, refreshDeviceLocation } = useResolvedLocation();
  const weatherQuery = useWeatherQuery(
    target.latitude,
    target.longitude,
    target.name
  );

  const onRefresh = async () => {
    await refreshDeviceLocation();
    await weatherQuery.refetch();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={weatherQuery.isFetching}
            onRefresh={onRefresh}
            tintColor="#4DA3FF"
          />
        }
      >
        <View style={styles.hero}>
          <Text style={styles.place}>{weatherQuery.data?.place ?? target.name}</Text>
          <Text style={styles.condition}>
            {weatherQuery.data
              ? `${getWeatherEmoji(weatherQuery.data.now.weatherCode)} ${getWeatherLabel(
                  weatherQuery.data.now.weatherCode
                )}`
              : "Loading weather..."}
          </Text>
          <Text style={styles.temp}>
            {weatherQuery.data ? formatTemp(weatherQuery.data.now.temperature) : "--"}
          </Text>
          <Text style={styles.sub}>
            {weatherQuery.data
              ? `Feels like ${formatTemp(
                  weatherQuery.data.now.apparentTemperature
                )}`
              : ""}
          </Text>
          {notice ? <Text style={styles.notice}>{notice}</Text> : null}
        </View>

        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Humidity</Text>
            <Text style={styles.metricValue}>
              {weatherQuery.data ? formatPercent(weatherQuery.data.now.humidity) : "--"}
            </Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Wind</Text>
            <Text style={styles.metricValue}>
              {weatherQuery.data ? formatWind(weatherQuery.data.now.windSpeed) : "--"}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Next hours</Text>
        <View style={styles.listCard}>
          {weatherQuery.data?.hourly?.map((item) => (
            <View style={styles.hourRow} key={item.time}>
              <Text style={styles.hourTime}>{formatTimeLabel(item.time)}</Text>
              <Text style={styles.hourIcon}>{getWeatherEmoji(item.weatherCode)}</Text>
              <Text style={styles.hourStatus}>{getWeatherLabel(item.weatherCode)}</Text>
              <Text style={styles.hourTemp}>{formatTemp(item.temperature)}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>7-day forecast</Text>
        <View style={styles.listCard}>
          {weatherQuery.data?.daily?.map((item) => (
            <View style={styles.dayRow} key={item.date}>
              <Text style={styles.dayDate}>{formatDateLabel(item.date)}</Text>
              <Text style={styles.dayIcon}>{getWeatherEmoji(item.weatherCode)}</Text>
              <Text style={styles.dayStatus}>{getWeatherLabel(item.weatherCode)}</Text>
              <Text style={styles.dayTemp}>
                {formatTemp(item.max)} / {formatTemp(item.min)}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.lg,
    gap: theme.spacing.lg,
  },
  hero: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.lg,
    gap: 8,
  },
  place: {
    color: theme.colors.text,
    fontSize: 28,
    fontWeight: "800",
  },
  condition: {
    color: theme.colors.textMuted,
    fontSize: 15,
    fontWeight: "600",
  },
  temp: {
    color: theme.colors.primary,
    fontSize: 48,
    fontWeight: "800",
  },
  sub: {
    color: theme.colors.textMuted,
    fontSize: 14,
  },
  notice: {
    color: theme.colors.warning,
    fontSize: 13,
  },
  metricsRow: {
    flexDirection: "row",
    gap: theme.spacing.md,
  },
  metricCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    gap: 8,
  },
  metricLabel: {
    color: theme.colors.textMuted,
    fontSize: 13,
    fontWeight: "700",
  },
  metricValue: {
    color: theme.colors.text,
    fontSize: 22,
    fontWeight: "800",
  },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: "800",
  },
  listCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.radius.lg,
    overflow: "hidden",
  },
  hourRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    gap: 10,
  },
  hourTime: {
    width: 60,
    color: theme.colors.textMuted,
    fontSize: 13,
    fontWeight: "700",
  },
  hourIcon: {
    width: 32,
    textAlign: "center",
    fontSize: 20,
  },
  hourStatus: {
    flex: 1,
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: "600",
  },
  hourTemp: {
    color: theme.colors.primary,
    fontSize: 15,
    fontWeight: "800",
  },
  dayRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    gap: 10,
  },
  dayDate: {
    width: 70,
    color: theme.colors.textMuted,
    fontSize: 13,
    fontWeight: "700",
  },
  dayIcon: {
    width: 32,
    textAlign: "center",
    fontSize: 20,
  },
  dayStatus: {
    flex: 1,
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: "600",
  },
  dayTemp: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: "800",
  },
});