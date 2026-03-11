import React from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { theme } from "../src/theme";

export default function WeatherScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.card}>
        <Text style={styles.title}>Weather</Text>
        <Text style={styles.subtitle}>
          Current weather integration will be added in the next step.
        </Text>
        <Text style={styles.value}>28°C · Sunny</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    gap: 10,
  },
  title: {
    color: theme.colors.text,
    fontSize: 28,
    fontWeight: "800",
  },
  subtitle: {
    color: theme.colors.textMuted,
    fontSize: 14,
  },
  value: {
    color: theme.colors.primary,
    fontSize: 24,
    fontWeight: "700",
  },
});