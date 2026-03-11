import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { theme } from "../../theme";

type Props = {
  label: string;
  variant?: "default" | "primary" | "danger";
  onPress?: () => void;
};

export function CalculatorButton({
  label,
  variant = "default",
  onPress,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.button,
        variant === "primary" && styles.primaryButton,
        variant === "danger" && styles.dangerButton,
      ]}
    >
      <Text
        style={[
          styles.label,
          variant === "primary" && styles.primaryLabel,
          variant === "danger" && styles.dangerLabel,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    minHeight: 68,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surfaceSoft,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  dangerButton: {
    backgroundColor: "#3A1E26",
    borderColor: "#5B2D38",
  },
  label: {
    color: theme.colors.text,
    fontSize: 22,
    fontWeight: "700",
  },
  primaryLabel: {
    color: "#08111F",
  },
  dangerLabel: {
    color: "#FFB8C2",
  },
});