import React from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { theme } from "../src/theme";

export default function SettingsScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.card}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.item}>Default city</Text>
        <Text style={styles.item}>Language</Text>
        <Text style={styles.item}>Refresh behavior</Text>
        <Text style={styles.note}>
          Settings wiring and persistence will be added after API integration.
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
    fontSize: 17,
    fontWeight: "600",
  },
  note: {
    color: theme.colors.textMuted,
    fontSize: 14,
  },
});