import { useContext } from 'react';
import { ErrorContext, ErrorContextType } from '../context/ErrorContext';

export const useError = (): ErrorContextType => {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
};
