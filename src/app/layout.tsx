// pages/layout.tsx
import React, { useState, useEffect } from 'react';
import { AppProps } from 'next/app';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LocationProvider } from './contexts/LocationContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ChatProvider } from "./contexts/ChatContext";
import '../styles/globals.css'; // Import global styles
import { app, auth, storage } from './config/firebase'; // Assuming you've set up Firebase for web
import LoadingScreen from './components/LoadingScreen';

// Error Boundary Component for Next.js
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App Error:', error, errorInfo);
    // In web, you might want to show an error message in a different way, like a modal or redirect
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}

// App State Context
export const AppStateContext = React.createContext<{
  appState: { theme: string; language: string };
  updateAppState: (newState: Partial<{ theme: string; language: string }>) => void;
}>({
  appState: { theme: 'light', language: 'en' },
  updateAppState: () => {},
});

function MyApp({ Component, pageProps }: AppProps) {
  const [appIsReady, setAppIsReady] = useState(false);
  const [appState, setAppState] = useState({
    theme: 'light',
    language: 'en',
    // ... other app-wide state
  });

  useEffect(() => {
    async function prepare() {
      try {
        // Initialize Firebase
        if (!app) {
          throw new Error('Firebase app not initialized');
        }

        // Load fonts (this would typically be done in _document.tsx or through CSS)
        // For simplicity, we're skipping this here, but you'd set up font loading in Next.js differently

        // Restore app state from localStorage
        const savedAppState = localStorage.getItem('appState');
        if (savedAppState) {
          setAppState(JSON.parse(savedAppState));
        }

        // Artificial delay for smooth loading
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn('Initialization error:', e);
        // Handle error display in web context, e.g., show a modal or redirect
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  // Update app state and persist it
  const updateAppState = (newState: Partial<{ theme: string; language: string }>) => {
    setAppState(prevState => {
      const updatedState = { ...prevState, ...newState };
      localStorage.setItem('appState', JSON.stringify(updatedState));
      return updatedState;
    });
  };

  if (!appIsReady) {
    return <LoadingScreen />;
  }

  return (
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
  );
}

export default MyApp;