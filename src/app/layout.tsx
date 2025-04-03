"use client";
import React, { useState, useEffect } from "react";
import { AppProps } from "next/app";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LocationProvider } from "./contexts/LocationContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { ChatProvider } from "./contexts/ChatContext";
import "./globals.css";
import { app } from "./config/firebase";
import LoadingScreen from "./components/LoadingScreen";

// Error Boundary Component for Next.js
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("App Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}

// App State Context
export const AppStateContext = React.createContext({
  appState: { theme: "light", language: "en" },
  updateAppState: (newState: Partial<{ theme: string; language: string }>) => {},
});

export default function RootLayout({ Component, pageProps }: AppProps) {
  const [appIsReady, setAppIsReady] = useState(false);
  const [appState, setAppState] = useState({ theme: "light", language: "en" });

  useEffect(() => {
    async function prepare() {
      try {
        if (!app) throw new Error("Firebase app not initialized");

        const savedAppState = localStorage.getItem("appState");
        if (savedAppState) setAppState(JSON.parse(savedAppState));

        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn("Initialization error:", e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const updateAppState = (newState: Partial<{ theme: string; language: string }>) => {
    setAppState((prevState) => {
      const updatedState = { ...prevState, ...newState };
      localStorage.setItem("appState", JSON.stringify(updatedState));
      return updatedState;
    });
  };

  if (!appIsReady) return <LoadingScreen />;

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Waggle | Devon's Digital Solutions</title>
      </head>
      <body>
        <ThemeProvider>
          <ErrorBoundary>
            <AppStateContext.Provider value={{ appState, updateAppState }}>
              <AuthProvider>
                <ChatProvider>
                  <LocationProvider>
                    <NotificationProvider>
                      <Component {...pageProps} />
                    </NotificationProvider>
                  </LocationProvider>
                </ChatProvider>
              </AuthProvider>
            </AppStateContext.Provider>
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  );
}
