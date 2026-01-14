import React, { createContext, useState, ReactNode } from 'react';
import ErrorModal from '../components/modal/ErrorModal';

export interface ErrorContextType {
  showError: (title: string, description: string) => void;
  clearError: () => void;
}

export const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

interface ErrorProviderProps {
  children: ReactNode;
}

export const ErrorProvider: React.FC<ErrorProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const showError = (errorTitle: string, errorDescription: string) => {
    setTitle(errorTitle);
    setDescription(errorDescription);
    setIsOpen(true);
  };

  const clearError = () => {
    setIsOpen(false);
    setTimeout(() => {
      setTitle('');
      setDescription('');
    }, 300);
  };

  return (
    <ErrorContext.Provider value={{ showError, clearError }}>
      {children}
      <ErrorModal
        isOpen={isOpen}
        onClose={clearError}
        title={title}
        description={description}
      />
    </ErrorContext.Provider>
  );
};
