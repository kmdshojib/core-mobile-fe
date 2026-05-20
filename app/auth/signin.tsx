import { Link, useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import { useState } from 'react';

import { AuthShell } from '@/components/ui/auth-shell';
import { PrimaryButton } from '@/components/ui/primary-button';
import { TextField } from '@/components/ui/text-field';
import { useAuthStore } from '@/store/auth-store';

export default function SignInScreen() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    try {
      await login({ emailOrPhone: phone, password });
      router.replace('/(tabs)');
    } catch {
      // Store exposes the backend error for the UI.
    }
  };

  return (
    <AuthShell title="Sign In" description="Enter your credentials to access your account">
      {isAuthenticated ? (
        <PrimaryButton
          label="Sign Out"
          variant="outline"
          onPress={() => {
            logout();
            router.replace('/auth/signin');
          }}
        />
      ) : null}
      <TextField
        label="Phone"
        value={phone}
        onChangeText={(value) => {
          setPhone(value);
          clearError();
        }}
        placeholder="Enter phone number"
        keyboardType="phone-pad"
      />
      <TextField
        label="Password"
        value={password}
        onChangeText={(value) => {
          setPassword(value);
          clearError();
        }}
        placeholder="••••••••"
        secureTextEntry
      />
      {error ? (
        <View className="rounded-2xl bg-rose-50 p-3 dark:bg-rose-950">
          <Text className="text-sm text-rose-700 dark:text-rose-200">{error}</Text>
        </View>
      ) : null}
      <PrimaryButton label="Sign In" onPress={handleSignIn} loading={loading} disabled={!phone || !password} />

      <Link href="/auth/forgot-password" asChild>
        <Text className="text-center text-sm font-medium text-primary">Forgot Password?</Text>
      </Link>
      <Text className="text-center text-sm text-muted-foreground">Don&apos;t have an account?</Text>
      <Link href="/auth/signup" asChild>
        <Text className="text-center text-sm font-semibold text-primary">Sign Up</Text>
      </Link>
    </AuthShell>
  );
}
