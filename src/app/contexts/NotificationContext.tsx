// src/contexts/NotificationContext.ts
"use client";
import React, { createContext, useState, useContext, useCallback, ReactNode } from 'react';

interface Notification {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (message: string, type: Notification['type']) => void;
  removeNotification: (id: number) => void;
}

// Create and export the context directly
export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

// Define the props interface for NotificationProvider
interface NotificationProviderProps {
  children: ReactNode;
}

// Export NotificationProvider as a named export
export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }: NotificationProviderProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((message: string, type: Notification['type']) => {
    const id = Date.now(); // Using timestamp as a simple unique ID
    setNotifications(prevNotifications => [...prevNotifications, { id, message, type }]);

    // Automatically remove the notification after 5 seconds
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  }, []);

  const removeNotification = useCallback((id: number) => {
    setNotifications(prevNotifications => prevNotifications.filter(notification => notification.id !== id));
  }, []);

  const value: NotificationContextType = {
    notifications,
    addNotification,
    removeNotification
  };

  // Use NotificationContext.Provider directly
  return (
    <NotificationContext.Provider value={value}>
      {children}
      {/* Render notifications */}
      <div className="notification-container">
        {notifications.map(notification => (
          <div key={notification.id} className={`notification ${notification.type}`}>
            {notification.message}
            <button onClick={() => removeNotification(notification.id)}>X</button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};