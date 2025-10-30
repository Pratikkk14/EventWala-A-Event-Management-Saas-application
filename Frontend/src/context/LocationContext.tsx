import React, { createContext, useContext, ReactNode } from "react";
import { useLocation } from "../hooks/useLocation";

// 1. Create the context type
interface LocationContextType {
  latitude: number | null;
  longitude: number | null;
  loading: boolean;
  error: string | null;
  getCurrentLocation: () => void;
}

// 2. Create the context
export const LocationContext = createContext<LocationContextType | undefined>(undefined);

// 3. Provider component
export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  return (
    <LocationContext.Provider value={location}>
      {children}
    </LocationContext.Provider>
  );
};

// 4. Custom hook for consuming the context
export const useLocationContext = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocationContext must be used within a LocationProvider");
  }
  return context;
};
