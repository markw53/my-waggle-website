// src/contexts/ChatContext.ts
import React, { createContext, useState, useContext, useCallback, ReactNode } from 'react';

interface Message {
  id: number;
  sender: string;
  content: string;
  timestamp: Date;
}

interface ChatContextType {
  messages: Message[];
  sendMessage: (sender: string, content: string) => void;
  clearChat: () => void;
}

// Create and export the context directly
export const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

// Define the props interface for ChatProvider
interface ChatProviderProps {
  children: ReactNode;
}

// Export ChatProvider as a named export
export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);

  const sendMessage = useCallback((sender: string, content: string) => {
    const newMessage: Message = {
      id: Date.now(), // Using timestamp as a simple unique ID
      sender,
      content,
      timestamp: new Date()
    };
    setMessages(prevMessages => [...prevMessages, newMessage]);
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
  }, []);

  const value: ChatContextType = {
    messages,
    sendMessage,
    clearChat
  };

  // Use ChatContext.Provider directly
  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};