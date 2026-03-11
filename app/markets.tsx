import React from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { theme } from "../src/theme";

export default function MarketsScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.card}>
        <Text style={styles.title}>Markets</Text>
        <Text style={styles.item}>USD/EGP</Text>
        <Text style={styles.item}>Gold</Text>
        <Text style={styles.item}>Bitcoin</Text>
        <Text style={styles.note}>
          Live market indicators will be connected next.
        </Text>
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
    gap: 12,
  },
  title: {
    color: theme.colors.text,
    fontSize: 28,
    fontWeight: "800",
  },
  item: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: "600",
  },
  note: {
    color: theme.colors.textMuted,
    fontSize: 14,
  },
});