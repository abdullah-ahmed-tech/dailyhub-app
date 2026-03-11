import React, { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { searchCities } from "../src/services/weather.service";
import { usePreferencesStore } from "../src/store/preferences-store";
import { theme } from "../src/theme";
import type { SavedCity } from "../src/types/app";

export default function SettingsScreen() {
  const {
    savedCity,
    useDeviceLocation,
    setSavedCity,
    setUseDeviceLocation,
  } = usePreferencesStore();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SavedCity[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const found = await searchCities(query);
      setResults(found);
    } finally {
      setLoading(false);
    }
  };

  const applyCity = (city: SavedCity) => {
    setSavedCity(city);
    setUseDeviceLocation(false);
    setResults([]);
    setQuery(`${city.name}${city.country ? `, ${city.country}` : ""}`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location source</Text>
          <View style={styles.rowBetween}>
            <View style={styles.textBlock}>
              <Text style={styles.primaryText}>Use current device location</Text>
              <Text style={styles.secondaryText}>
                When enabled, weather follows the device position
              </Text>
            </View>
            <Switch
              value={useDeviceLocation}
              onValueChange={setUseDeviceLocation}
              trackColor={{ false: "#24324D", true: "#4DA3FF" }}
              thumbColor="#F3F7FF"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Saved city</Text>
          <Text style={styles.primaryText}>
            {savedCity.name}
            {savedCity.country ? `, ${savedCity.country}` : ""}
          </Text>
          <Text style={styles.secondaryText}>
            Used automatically when location access is off or denied
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Search another city</Text>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Type city name..."
            placeholderTextColor="#7286AA"
            style={styles.input}
          />

          <Pressable style={styles.button} onPress={handleSearch}>
            <Text style={styles.buttonText}>Search city</Text>
          </Pressable>

          {loading ? (
            <ActivityIndicator color="#4DA3FF" style={{ marginTop: 12 }} />
          ) : null}

          <View style={styles.results}>
            {results.map((city) => (
              <Pressable
                key={`${city.name}-${city.latitude}-${city.longitude}`}
                style={styles.resultCard}
                onPress={() => applyCity(city)}
              >
                <Text style={styles.resultTitle}>
                  {city.name}
                  {city.country ? `, ${city.country}` : ""}
                </Text>
                <Text style={styles.resultMeta}>
                  {city.latitude.toFixed(3)}, {city.longitude.toFixed(3)}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current mode</Text>
          <Text style={styles.primaryText}>
            {useDeviceLocation ? "Device location" : "Saved city"}
          </Text>
          <Text style={styles.secondaryText}>
            This choice affects the Home and Weather screens immediately
          </Text>
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
  section: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    gap: 12,
  },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: "800",
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.md,
  },
  textBlock: {
    flex: 1,
    gap: 6,
  },
  primaryText: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryText: {
    color: theme.colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
  },
  input: {
    backgroundColor: theme.colors.surfaceSoft,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.radius.md,
    paddingHorizontal: 14,
    paddingVertical: 14,
    color: theme.colors.text,
    fontSize: 15,
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonText: {
    color: "#08111F",
    fontSize: 15,
    fontWeight: "800",
  },
  results: {
    gap: theme.spacing.sm,
  },
  resultCard: {
    backgroundColor: theme.colors.surfaceSoft,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    gap: 6,
  },
  resultTitle: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: "700",
  },
  resultMeta: {
    color: theme.colors.textMuted,
    fontSize: 12,
  },
});