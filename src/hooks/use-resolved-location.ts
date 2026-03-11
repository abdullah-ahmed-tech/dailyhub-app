import { useCallback, useEffect, useState } from "react";
import * as Location from "expo-location";
import type { ResolvedTarget } from "../types/app";
import { usePreferencesStore } from "../store/preferences-store";

type HookState = {
  target: ResolvedTarget;
  loading: boolean;
  notice: string | null;
  refreshDeviceLocation: () => Promise<void>;
};

export function useResolvedLocation(): HookState {
  const { savedCity, useDeviceLocation } = usePreferencesStore();
  const [target, setTarget] = useState<ResolvedTarget>({
    ...savedCity,
    source: "saved-city",
  });
  const [loading, setLoading] = useState(useDeviceLocation);
  const [notice, setNotice] = useState<string | null>(null);

  const loadDeviceLocation = useCallback(async () => {
    if (!useDeviceLocation) {
      setTarget({ ...savedCity, source: "saved-city" });
      setNotice(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const servicesEnabled = await Location.hasServicesEnabledAsync();
      if (!servicesEnabled) {
        setTarget({ ...savedCity, source: "saved-city" });
        setNotice("Location service is off. Using saved city.");
        setLoading(false);
        return;
      }

      const permission = await Location.requestForegroundPermissionsAsync();
      if (!permission.granted) {
        setTarget({ ...savedCity, source: "saved-city" });
        setNotice("Location permission denied. Using saved city.");
        setLoading(false);
        return;
      }

      const lastKnown = await Location.getLastKnownPositionAsync();
      const current =
        lastKnown ??
        (await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        }));

      setTarget({
        name: "Current location",
        country: "",
        latitude: current.coords.latitude,
        longitude: current.coords.longitude,
        source: "device",
      });
      setNotice(null);
    } catch {
      setTarget({ ...savedCity, source: "saved-city" });
      setNotice("Could not detect device location. Using saved city.");
    } finally {
      setLoading(false);
    }
  }, [savedCity, useDeviceLocation]);

  useEffect(() => {
    loadDeviceLocation();
  }, [loadDeviceLocation]);

  return {
    target,
    loading,
    notice,
    refreshDeviceLocation: loadDeviceLocation,
  };
}