import React, { useState } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LocationProvider } from "./contexts/LocationContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { ChatProvider } from "./contexts/ChatContext";
import { AppStateContext } from "./contexts/AppStateContext";
import "./globals.css";
import { app } from "./config/firebase";
import LoadingScreen from "./components/LoadingScreen";

export const metadata = {
  title: "Waggle | Devon's Digital Solutions",
  description: "A modern platform for digital solutions.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [appIsReady, setAppIsReady] = useState(false);
  const [appState, setAppState] = useState({ theme: "light", language: "en" });

  // useEffect(() => {
  //   async function prepare() {
  //     try {
  //       if (!app) throw new Error("Firebase app not initialized");

  //       const savedAppState = localStorage.getItem("appState");
  //       if (savedAppState) setAppState(JSON.parse(savedAppState));

  //       await new Promise((resolve) => setTimeout(resolve, 1000));
  //     } catch (e) {
  //       console.warn("Initialization error:", e);
  //     } finally {
  //       setAppIsReady(true);
  //     }
  //   }

  //   prepare();
  // }, []);

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
      <body>
        <ThemeProvider>
          <AuthProvider>
            <ChatProvider>
              <LocationProvider>
                <NotificationProvider>
                  <AppStateContext.Provider value={{ appState, updateAppState }}>
                    {children}
                  </AppStateContext.Provider>
                </NotificationProvider>
              </LocationProvider>
            </ChatProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
