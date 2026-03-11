import React, { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "../../theme";

type Props = {
  title: string;
  value: string;
  hint?: string;
  onPress?: () => void;
  rightSlot?: ReactNode;
};

export function HomeCard({ title, value, hint, onPress, rightSlot }: Props) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View style={styles.content}>
        <View style={styles.texts}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.value}>{value}</Text>
          {hint ? <Text style={styles.hint}>{hint}</Text> : null}
        </View>

        {rightSlot ? <View style={styles.rightSlot}>{rightSlot}</View> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.md,
  },
  texts: {
    flex: 1,
    gap: 6,
  },
  title: {
    color: theme.colors.textMuted,
    fontSize: 13,
    fontWeight: "600",
  },
  value: {
    color: theme.colors.text,
    fontSize: 22,
    fontWeight: "800",
  },
  hint: {
    color: theme.colors.textMuted,
    fontSize: 13,
  },
  rightSlot: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
});