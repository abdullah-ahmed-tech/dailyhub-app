import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useMemo } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function RootLayout() {
  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000,
            gcTime: 30 * 60 * 1000,
            retry: 1,
            refetchOnReconnect: true,
            refetchOnMount: false,
            refetchOnWindowFocus: false,
          },
        },
      }),
    []
  );

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
          animation: "fade",
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