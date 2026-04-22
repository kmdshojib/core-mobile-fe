import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useColorScheme } from 'nativewind';

import '../global.css';

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <ThemeProvider
      value={{
        ...(isDark ? DarkTheme : DefaultTheme),
        colors: {
          ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
          background: isDark ? '#020617' : '#f8fafc',
          card: isDark ? '#0f172a' : '#ffffff',
          border: isDark ? '#1e293b' : '#e2e8f0',
          primary: isDark ? '#a5b4fc' : '#6366f1',
          text: isDark ? '#f8fafc' : '#0f172a',
        },
      }}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="auth/signin" options={{ headerShown: false }} />
        <Stack.Screen name="auth/signup" options={{ headerShown: false }} />
        <Stack.Screen name="auth/forgot-password" options={{ headerShown: false }} />
        <Stack.Screen name="auth/reset-password" options={{ headerShown: false }} />
        <Stack.Screen name="auth/verify-otp" options={{ headerShown: false }} />
        <Stack.Screen name="reading/[id]" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}
