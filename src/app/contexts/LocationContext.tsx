// src/contexts/LocationContext.ts
"use client";
import React, { createContext, useState, useContext, useCallback } from 'react';

interface Location {
  latitude: number | null;
  longitude: number | null;
  error?: string | null;
}

interface LocationContextType {
  location: Location;
  getLocation: () => Promise<void>;
}

export const LocationContextInstance = createContext<LocationContextType | undefined>(undefined);

export const useLocation = () => {
  const context = useContext(LocationContextInstance);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

export const LocationProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [location, setLocation] = useState<Location>({ latitude: null, longitude: null });

  const getLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setLocation(prev => ({ ...prev, error: 'Geolocation is not supported by this browser.' }));
      return;
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        error: null
      });
    } catch (error) {
      setLocation(prev => ({ ...prev, error: (error instanceof Error) ? error.message : 'An unknown error occurred' }));
    }
  }, []);

  const value: LocationContextType = {
    location,
    getLocation
  };

  return (
    <LocationContextInstance.Provider value={value as LocationContextType}>
      {children}
    </LocationContextInstance.Provider>
  );
};