import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { SavedCity } from "../types/app";

type PreferencesState = {
  savedCity: SavedCity;
  useDeviceLocation: boolean;
  setSavedCity: (city: SavedCity) => void;
  setUseDeviceLocation: (value: boolean) => void;
};

const defaultCity: SavedCity = {
  name: "Cairo",
  country: "Egypt",
  latitude: 30.0444,
  longitude: 31.2357,
};

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      savedCity: defaultCity,
      useDeviceLocation: true,
      setSavedCity: (savedCity) => set({ savedCity }),
      setUseDeviceLocation: (useDeviceLocation) => set({ useDeviceLocation }),
    }),
    {
      name: "dailyhub-preferences",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);