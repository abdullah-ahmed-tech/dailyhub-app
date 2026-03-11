import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { HomeCard } from "../src/components/home/home-card";
import { SectionHeader } from "../src/components/home/section-header";
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

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const today = useMemo(() => formatDate(now), [now]);
  const liveTime = useMemo(() => formatTime(now), [now]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Text style={styles.heroLabel}>Your daily dashboard</Text>
          <Text style={styles.heroTime}>{liveTime}</Text>
          <Text style={styles.heroDate}>{today}</Text>
        </View>

        <SectionHeader
          title="Quick Access"
          subtitle="Everything important in one place"
        />

        <View style={styles.grid}>
          <HomeCard
            title="Weather"
            value="28°C"
            hint="Tap to view full forecast"
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
            value="Live"
            hint="Gold, USD, BTC and more"
            onPress={() => router.push("/markets")}
          />
          <HomeCard
            title="News"
            value="Top stories"
            hint="Politics and sports updates"
            onPress={() => router.push("/news")}
          />
        </View>

        <SectionHeader
          title="Daily Snapshot"
          subtitle="Temporary placeholder data until API integration"
        />

        <View style={styles.stack}>
          <HomeCard
            title="Weather Now"
            value="Sunny"
            hint="Cairo · Feels like 30°C"
          />
          <HomeCard
            title="Markets Pulse"
            value="USD / Gold / BTC"
            hint="Quick indicators will appear here"
          />
          <HomeCard
            title="Top Headlines"
            value="Politics + Sports"
            hint="Short digest cards will appear here"
          />
          <HomeCard
            title="Settings"
            value="Customize"
            hint="City, language and refresh preferences"
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
  grid: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  stack: {
    gap: theme.spacing.md,
  },
});