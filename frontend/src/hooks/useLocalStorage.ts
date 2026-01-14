import { useState, useCallback } from 'react';

export const useLocalStorage = () => {
  const setItem = useCallback((key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, []);

  const getItem = useCallback((key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error(`Error getting localStorage key "${key}":`, error);
      return null;
    }
  }, []);

  const removeItem = useCallback((key: string) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, []);

  return { setItem, getItem, removeItem };
};

export function useLocalStorageState<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue];
}
