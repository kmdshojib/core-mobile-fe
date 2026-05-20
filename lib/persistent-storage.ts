import { Platform } from 'react-native';

export const persistentStorage =
  Platform.OS === 'web'
    ? {
        getItem: async (key: string) => {
          if (typeof window === 'undefined') return null;
          return window.localStorage.getItem(key);
        },
        setItem: async (key: string, value: string) => {
          if (typeof window === 'undefined') return;
          window.localStorage.setItem(key, value);
        },
        removeItem: async (key: string) => {
          if (typeof window === 'undefined') return;
          window.localStorage.removeItem(key);
        },
      }
    : require('@react-native-async-storage/async-storage').default;
