import React from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { theme } from "../src/theme";

export default function NewsScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.card}>
        <Text style={styles.title}>News</Text>
        <Text style={styles.subtitle}>Politics and sports quick updates</Text>

        <View style={styles.newsItem}>
          <Text style={styles.newsCategory}>Politics</Text>
          <Text style={styles.newsHeadline}>
            Political headlines will appear here.
          </Text>
        </View>

        <View style={styles.newsItem}>
          <Text style={styles.newsCategory}>Sports</Text>
          <Text style={styles.newsHeadline}>
            Sports headlines will appear here.
          </Text>
        </View>
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
    gap: 16,
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
  newsItem: {
    gap: 8,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surfaceSoft,
    borderRadius: theme.radius.md,
  },
  newsCategory: {
    color: theme.colors.primary,
    fontSize: 13,
    fontWeight: "700",
  },
  newsHeadline: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "600",
  },
});