import React, { createContext, useContext, useState } from 'react';

const AssistantContext = createContext();

export const AssistantProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userLanguage, setUserLanguage] = useState('en');
  const [error, setError] = useState(null);

  const openChat = () => setIsOpen(true);
  const closeChat = () => setIsOpen(false);
  const toggleChat = () => setIsOpen(prev => !prev);

  const addMessage = (role, content) => {
    const newMessage = {
      role,
      content,
      timestamp: new Date().toISOString()
    };
    // Keep a reasonable max length for client side history
    setMessages(prev => [...prev.slice(-49), newMessage]);
  };

  const clearMessages = () => setMessages([]);

  const setLoading = (loading) => setIsLoading(loading);

  const setErrorMessage = (errorMsg) => setError(errorMsg);

  const clearError = () => setError(null);

  return (
    <AssistantContext.Provider
      value={{
        isOpen,
        messages,
        isLoading,
        userLanguage,
        error,
        openChat,
        closeChat,
        toggleChat,
        addMessage,
        clearMessages,
        setLoading,
        setError: setErrorMessage,
        clearError,
        setUserLanguage
      }}
    >
      {children}
    </AssistantContext.Provider>
  );
};

export const useAssistant = () => {
  const context = useContext(AssistantContext);
  if (!context) {
    throw new Error('useAssistant must be used within AssistantProvider');
  }
  return context;
};

export default AssistantContext;