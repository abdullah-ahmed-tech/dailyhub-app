import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#0B1220",
          },
          headerTintColor: "#F3F7FF",
          headerTitleStyle: {
            fontWeight: "700",
          },
          contentStyle: {
            backgroundColor: "#0B1220",
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{ title: "DailyHub", headerShown: true }}
        />
        <Stack.Screen name="weather" options={{ title: "Weather" }} />
        <Stack.Screen name="calculator" options={{ title: "Calculator" }} />
        <Stack.Screen name="markets" options={{ title: "Markets" }} />
        <Stack.Screen name="news" options={{ title: "News" }} />
        <Stack.Screen name="settings" options={{ title: "Settings" }} />
      </Stack>
    </QueryClientProvider>
  );
}