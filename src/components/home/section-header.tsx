import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { theme } from "../../theme";

type Props = {
  title: string;
  subtitle?: string;
};

export function SectionHeader({ title, subtitle }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 4,
    marginBottom: theme.spacing.md,
  },
  title: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: "700",
  },
  subtitle: {
    color: theme.colors.textMuted,
    fontSize: 13,
  },
});