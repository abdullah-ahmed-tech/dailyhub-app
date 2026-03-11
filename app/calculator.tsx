import React, { useState } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { CalculatorButton } from "../src/features/calculator/calculator-button";
import { theme } from "../src/theme";

function isSafeExpression(expression: string) {
  return /^[0-9+\-*/().\s]+$/.test(expression);
}

export default function CalculatorScreen() {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("0");

  const append = (value: string) => {
    setExpression((prev) => prev + value);
  };

  const clearAll = () => {
    setExpression("");
    setResult("0");
  };

  const removeLast = () => {
    setExpression((prev) => prev.slice(0, -1));
  };

  const calculate = () => {
    try {
      if (!expression.trim()) return;
      if (!isSafeExpression(expression)) {
        setResult("Error");
        return;
      }

      const evalResult = Function(`"use strict"; return (${expression})`)();
      const formatted =
        typeof evalResult === "number" && Number.isFinite(evalResult)
          ? String(evalResult)
          : "Error";

      setResult(formatted);
    } catch {
      setResult("Error");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.display}>
        <Text style={styles.expression}>{expression || "0"}</Text>
        <Text style={styles.result}>{result}</Text>
      </View>

      <View style={styles.rows}>
        <View style={styles.row}>
          <CalculatorButton label="C" variant="danger" onPress={clearAll} />
          <CalculatorButton label="⌫" onPress={removeLast} />
          <CalculatorButton label="/" onPress={() => append("/")} />
          <CalculatorButton label="*" onPress={() => append("*")} />
        </View>

        <View style={styles.row}>
          <CalculatorButton label="7" onPress={() => append("7")} />
          <CalculatorButton label="8" onPress={() => append("8")} />
          <CalculatorButton label="9" onPress={() => append("9")} />
          <CalculatorButton label="-" onPress={() => append("-")} />
        </View>

        <View style={styles.row}>
          <CalculatorButton label="4" onPress={() => append("4")} />
          <CalculatorButton label="5" onPress={() => append("5")} />
          <CalculatorButton label="6" onPress={() => append("6")} />
          <CalculatorButton label="+" onPress={() => append("+")} />
        </View>

        <View style={styles.row}>
          <CalculatorButton label="1" onPress={() => append("1")} />
          <CalculatorButton label="2" onPress={() => append("2")} />
          <CalculatorButton label="3" onPress={() => append("3")} />
          <CalculatorButton label="=" variant="primary" onPress={calculate} />
        </View>

        <View style={styles.row}>
          <CalculatorButton label="0" onPress={() => append("0")} />
          <CalculatorButton label="." onPress={() => append(".")} />
          <CalculatorButton label="(" onPress={() => append("(")} />
          <CalculatorButton label=")" onPress={() => append(")")} />
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
    gap: theme.spacing.lg,
  },
  display: {
    minHeight: 160,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.lg,
    justifyContent: "flex-end",
    gap: 10,
  },
  expression: {
    color: theme.colors.textMuted,
    fontSize: 20,
    textAlign: "right",
  },
  result: {
    color: theme.colors.text,
    fontSize: 38,
    fontWeight: "800",
    textAlign: "right",
  },
  rows: {
    gap: theme.spacing.sm,
  },
  row: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
});