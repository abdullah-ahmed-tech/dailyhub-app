import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { HomeCard } from "../src/components/home/home-card";
import { SectionHeader } from "../src/components/home/section-header";
import { getWeatherEmoji, getWeatherLabel } from "../src/constants/weather";
import { formatNewsDate, formatNumber, formatTemp } from "../src/lib/format";
import { useResolvedLocation } from "../src/hooks/use-resolved-location";
import {
  useMarketsQuery,
  useNewsQuery,
  useWeatherQuery,
} from "../src/queries";
import { theme } from "../src/theme";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatTime(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
}

export default function HomeScreen() {
  const router = useRouter();
  const [now, setNow] = useState(new Date());
  const { target, loading: locationLoading, notice, refreshDeviceLocation } =
    useResolvedLocation();

  const weatherQuery = useWeatherQuery(
    target.latitude,
    target.longitude,
    target.name
  );
  const marketsQuery = useMarketsQuery();
  const newsQuery = useNewsQuery();

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const today = useMemo(() => formatDate(now), [now]);
  const liveTime = useMemo(() => formatTime(now), [now]);

  const refreshAll = async () => {
    await refreshDeviceLocation();
    await Promise.all([
      weatherQuery.refetch(),
      marketsQuery.refetch(),
      newsQuery.refetch(),
    ]);
  };

  const topPolitics = newsQuery.data?.politics?.[0];
  const topSports = newsQuery.data?.sports?.[0];
  const usdEgp = marketsQuery.data?.items?.find((item) => item.id === "usd-egp");
  const btc = marketsQuery.data?.items?.find((item) => item.id === "btc-usd");

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={
              weatherQuery.isFetching ||
              marketsQuery.isFetching ||
              newsQuery.isFetching
            }
            onRefresh={refreshAll}
            tintColor="#4DA3FF"
          />
        }
      >
        <View style={styles.hero}>
          <Text style={styles.heroLabel}>Your daily dashboard</Text>
          <Text style={styles.heroTime}>{liveTime}</Text>
          <Text style={styles.heroDate}>{today}</Text>
          <Text style={styles.heroMeta}>
            {target.source === "device"
              ? "Using device location"
              : `Using saved city · ${target.name}`}
          </Text>
          {notice ? <Text style={styles.notice}>{notice}</Text> : null}
        </View>

        <SectionHeader
          title="Live widgets"
          subtitle="Real data, cached locally for smoother daily use"
        />

        <View style={styles.grid}>
          <HomeCard
            title="Weather"
            value={
              weatherQuery.data
                ? `${getWeatherEmoji(weatherQuery.data.now.weatherCode)} ${formatTemp(
                    weatherQuery.data.now.temperature
                  )}`
                : weatherQuery.isLoading || locationLoading
                ? "Loading..."
                : "Unavailable"
            }
            hint={
              weatherQuery.data
                ? `${target.name} · ${getWeatherLabel(
                    weatherQuery.data.now.weatherCode
                  )}`
                : "Tap to open weather details"
            }
            onPress={() => router.push("/weather")}
          />

          <HomeCard
            title="Calculator"
            value="Ready"
            hint="Fast daily calculations"
            onPress={() => router.push("/calculator")}
          />

          <HomeCard
            title="Markets"
            value={
              usdEgp ? `${formatNumber(usdEgp.value, 2)} ${usdEgp.unit}` : "Loading..."
            }
            hint={btc ? `BTC ${formatNumber(btc.value, 0)} USD` : "Live quick indicators"}
            onPress={() => router.push("/markets")}
          />

          <HomeCard
            title="News"
            value="Live feed"
            hint="Politics + sports"
            onPress={() => router.push("/news")}
          />
        </View>

        <SectionHeader
          title="Daily snapshot"
          subtitle="Quick scan without opening every screen"
        />

        <View style={styles.stack}>
          <View style={styles.snapshotCard}>
            <Text style={styles.snapshotLabel}>Weather now</Text>
            <Text style={styles.snapshotValue}>
              {weatherQuery.data
                ? `${getWeatherEmoji(weatherQuery.data.now.weatherCode)} ${getWeatherLabel(
                    weatherQuery.data.now.weatherCode
                  )}`
                : "Loading..."}
            </Text>
            <Text style={styles.snapshotHint}>
              {weatherQuery.data
                ? `${formatTemp(weatherQuery.data.now.temperature)} · feels like ${formatTemp(
                    weatherQuery.data.now.apparentTemperature
                  )}`
                : "Waiting for forecast data"}
            </Text>
          </View>

          <View style={styles.snapshotCard}>
            <Text style={styles.snapshotLabel}>Politics</Text>
            <Text style={styles.snapshotValue} numberOfLines={2}>
              {topPolitics?.title ?? "Loading top political headline..."}
            </Text>
            <Text style={styles.snapshotHint}>
              {topPolitics ? `${topPolitics.source} · ${formatNewsDate(topPolitics.publishedAt)}` : ""}
            </Text>
          </View>

          <View style={styles.snapshotCard}>
            <Text style={styles.snapshotLabel}>Sports</Text>
            <Text style={styles.snapshotValue} numberOfLines={2}>
              {topSports?.title ?? "Loading top sports headline..."}
            </Text>
            <Text style={styles.snapshotHint}>
              {topSports ? `${topSports.source} · ${formatNewsDate(topSports.publishedAt)}` : ""}
            </Text>
          </View>

          <HomeCard
            title="Settings"
            value={target.name}
            hint="Change city or use current location"
            onPress={() => router.push("/settings")}
          />
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
  contentContainer: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },
  hero: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    gap: 8,
  },
  heroLabel: {
    color: theme.colors.textMuted,
    fontSize: 14,
    fontWeight: "600",
  },
  heroTime: {
    color: theme.colors.text,
    fontSize: 38,
    fontWeight: "800",
  },
  heroDate: {
    color: theme.colors.textMuted,
    fontSize: 15,
  },
  heroMeta: {
    color: theme.colors.primary,
    fontSize: 13,
    fontWeight: "600",
  },
  notice: {
    color: theme.colors.warning,
    fontSize: 13,
  },
  grid: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  stack: {
    gap: theme.spacing.md,
  },
  snapshotCard: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    gap: 8,
  },
  snapshotLabel: {
    color: theme.colors.textMuted,
    fontSize: 13,
    fontWeight: "700",
  },
  snapshotValue: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: "700",
  },
  snapshotHint: {
    color: theme.colors.textMuted,
    fontSize: 13,
  },
});