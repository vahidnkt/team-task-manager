import { useState, useCallback } from "react";

// Generic type for localStorage values
type StorageValue<T> = T | null;

// Local storage hook with TypeScript support
export const useLocalStorage = <T>(key: string, initialValue: T) => {
  // Get value from localStorage or use initial value
  const [storedValue, setStoredValue] = useState<StorageValue<T>>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Set value in localStorage and state
  const setValue = useCallback(
    (value: T | ((val: StorageValue<T>) => T)) => {
      try {
        // Allow value to be a function so we have the same API as useState
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;

        // Save to state
        setStoredValue(valueToStore);

        // Save to localStorage
        if (valueToStore === null) {
          window.localStorage.removeItem(key);
        } else {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  // Remove value from localStorage and state
  const removeValue = useCallback(() => {
    try {
      setStoredValue(null);
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key]);

  // Clear all localStorage
  const clearAll = useCallback(() => {
    try {
      window.localStorage.clear();
      setStoredValue(null);
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }
  }, []);

  return {
    value: storedValue,
    setValue,
    removeValue,
    clearAll,
  };
};

// Specific hooks for common use cases
export const useAuthStorage = () => {
  return useLocalStorage("auth_token", null);
};

export const useThemeStorage = () => {
  return useLocalStorage<"light" | "dark">("theme", "light");
};

export const useSidebarStorage = () => {
  return useLocalStorage("sidebar_collapsed", false);
};

export const useUserPreferencesStorage = () => {
  return useLocalStorage("user_preferences", {
    language: "en",
    timezone: "UTC",
    notifications: true,
  });
};

// Utility functions for localStorage
export const localStorageUtils = {
  // Get item with type safety
  getItem: <T>(key: string, defaultValue: T): T => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  },

  // Set item with type safety
  setItem: <T>(key: string, value: T): void => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  },

  // Remove item
  removeItem: (key: string): void => {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  },

  // Check if key exists
  hasItem: (key: string): boolean => {
    return window.localStorage.getItem(key) !== null;
  },

  // Get all keys
  getAllKeys: (): string[] => {
    return Object.keys(window.localStorage);
  },

  // Get storage size in bytes
  getStorageSize: (): number => {
    let total = 0;
    for (const key in window.localStorage) {
      if (window.localStorage.hasOwnProperty(key)) {
        total += window.localStorage[key].length + key.length;
      }
    }
    return total;
  },
};
