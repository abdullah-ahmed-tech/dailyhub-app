import React from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { formatNewsDate, formatNumber } from "../src/lib/format";
import { useMarketsQuery } from "../src/queries";
import { theme } from "../src/theme";

export default function MarketsScreen() {
  const marketsQuery = useMarketsQuery();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={marketsQuery.isFetching}
            onRefresh={() => marketsQuery.refetch()}
            tintColor="#4DA3FF"
          />
        }
      >
        <View style={styles.hero}>
          <Text style={styles.title}>Markets & economy</Text>
          <Text style={styles.subtitle}>
            Fast daily indicators for currency and crypto movement
          </Text>
          <Text style={styles.updated}>
            Updated {formatNewsDate(marketsQuery.data?.updatedAt)}
          </Text>
        </View>

        <View style={styles.grid}>
          {marketsQuery.data?.items?.map((item) => {
            const isPositive = (item.change24h ?? 0) >= 0;
            return (
              <View style={styles.card} key={item.id}>
                <Text style={styles.cardLabel}>{item.label}</Text>
                <Text style={styles.cardValue}>
                  {formatNumber(item.value, 2)} {item.unit}
                </Text>

                {typeof item.change24h === "number" ? (
                  <Text
                    style={[
                      styles.change,
                      isPositive ? styles.positive : styles.negative,
                    ]}
                  >
                    {isPositive ? "+" : ""}
                    {formatNumber(item.change24h, 2)}%
                  </Text>
                ) : (
                  <Text style={styles.muted}>Reference rate</Text>
                )}
              </View>
            );
          })}
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>What is included now</Text>
          <Text style={styles.infoText}>• USD / EGP</Text>
          <Text style={styles.infoText}>• EUR / USD</Text>
          <Text style={styles.infoText}>• Bitcoin / USD</Text>
          <Text style={styles.infoText}>• Ethereum / USD</Text>
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
  title: {
    color: theme.colors.text,
    fontSize: 28,
    fontWeight: "800",
  },
  subtitle: {
    color: theme.colors.textMuted,
    fontSize: 14,
  },
  updated: {
    color: theme.colors.primary,
    fontSize: 13,
    fontWeight: "600",
  },
  grid: {
    gap: theme.spacing.md,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    gap: 8,
  },
  cardLabel: {
    color: theme.colors.textMuted,
    fontSize: 13,
    fontWeight: "700",
  },
  cardValue: {
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: "800",
  },
  change: {
    fontSize: 14,
    fontWeight: "800",
  },
  positive: {
    color: theme.colors.success,
  },
  negative: {
    color: theme.colors.danger,
  },
  muted: {
    color: theme.colors.textMuted,
    fontSize: 13,
  },
  infoBox: {
    backgroundColor: theme.colors.surfaceSoft,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    gap: 8,
  },
  infoTitle: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "800",
  },
  infoText: {
    color: theme.colors.textMuted,
    fontSize: 14,
  },
});