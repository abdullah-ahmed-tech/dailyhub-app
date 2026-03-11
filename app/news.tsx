import React, { useMemo, useState } from "react";
import {
  Linking,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { formatNewsDate } from "../src/lib/format";
import { useNewsQuery } from "../src/queries";
import { theme } from "../src/theme";

export default function NewsScreen() {
  const [tab, setTab] = useState<"politics" | "sports">("politics");
  const newsQuery = useNewsQuery();

  const items = useMemo(() => {
    return tab === "politics"
      ? newsQuery.data?.politics ?? []
      : newsQuery.data?.sports ?? [];
  }, [newsQuery.data, tab]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={newsQuery.isFetching}
            onRefresh={() => newsQuery.refetch()}
            tintColor="#4DA3FF"
          />
        }
      >
        <View style={styles.hero}>
          <Text style={styles.title}>News</Text>
          <Text style={styles.subtitle}>Live politics and sports digest</Text>
          <Text style={styles.updated}>
            Updated {formatNewsDate(newsQuery.data?.updatedAt)}
          </Text>
        </View>

        <View style={styles.tabs}>
          <Pressable
            style={[styles.tab, tab === "politics" && styles.tabActive]}
            onPress={() => setTab("politics")}
          >
            <Text style={[styles.tabText, tab === "politics" && styles.tabTextActive]}>
              Politics
            </Text>
          </Pressable>

          <Pressable
            style={[styles.tab, tab === "sports" && styles.tabActive]}
            onPress={() => setTab("sports")}
          >
            <Text style={[styles.tabText, tab === "sports" && styles.tabTextActive]}>
              Sports
            </Text>
          </Pressable>
        </View>

        <View style={styles.list}>
          {items.map((item, index) => (
            <Pressable
              key={`${tab}-${item.id}-${index}`}
              style={styles.newsCard}
              onPress={() => Linking.openURL(item.url)}
            >
              <Text style={styles.newsSource}>
                {item.source} · {formatNewsDate(item.publishedAt)}
              </Text>
              <Text style={styles.newsTitle}>{item.title}</Text>
              {item.summary ? (
                <Text numberOfLines={3} style={styles.newsSummary}>
                  {item.summary}
                </Text>
              ) : null}
              <Text style={styles.newsAction}>Open source article</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.footNote}>
          <Text style={styles.footNoteText}>Politics source: The Guardian</Text>
          <Text style={styles.footNoteText}>Sports source: ESPN RSS</Text>
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
  tabs: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  tab: {
    flex: 1,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    paddingVertical: 12,
    alignItems: "center",
  },
  tabActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  tabText: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: "700",
  },
  tabTextActive: {
    color: "#08111F",
  },
  list: {
    gap: theme.spacing.md,
  },
  newsCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    gap: 8,
  },
  newsSource: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: "700",
  },
  newsTitle: {
    color: theme.colors.text,
    fontSize: 17,
    fontWeight: "800",
  },
  newsSummary: {
    color: theme.colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  newsAction: {
    color: theme.colors.success,
    fontSize: 13,
    fontWeight: "700",
  },
  footNote: {
    backgroundColor: theme.colors.surfaceSoft,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    gap: 6,
  },
  footNoteText: {
    color: theme.colors.textMuted,
    fontSize: 13,
  },
});