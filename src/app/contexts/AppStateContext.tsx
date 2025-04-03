"use client";
import React, { createContext, useState, useEffect } from "react";

interface AppState {
  theme: string;
  language: string;
}

interface AppStateContextType {
  appState: AppState;
  updateAppState: (newState: Partial<AppState>) => void;
}

export const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [appState, setAppState] = useState<AppState>({ theme: "light", language: "en" });

  useEffect(() => {
    const savedAppState = localStorage.getItem("appState");
    if (savedAppState) setAppState(JSON.parse(savedAppState));
  }, []);

  const updateAppState = (newState: Partial<AppState>) => {
    setAppState((prevState) => {
      const updatedState = { ...prevState, ...newState };
      localStorage.setItem("appState", JSON.stringify(updatedState));
      return updatedState;
    });
  };

  return (
    <AppStateContext.Provider value={{ appState, updateAppState }}>
      {children}
    </AppStateContext.Provider>
  );
}
