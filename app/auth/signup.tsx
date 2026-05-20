import { Link, useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import { useState } from 'react';

import { AuthShell } from '@/components/ui/auth-shell';
import { PrimaryButton } from '@/components/ui/primary-button';
import { TextField } from '@/components/ui/text-field';
import { useAuthStore } from '@/store/auth-store';

export default function SignUpScreen() {
  const router = useRouter();
  const register = useAuthStore((state) => state.register);
  const loading = useAuthStore((state) => state.loading);
  const storeError = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError('');

    try {
      await register({ name, email, phone, password });
      router.push({ pathname: '/auth/verify-otp', params: { phone } });
    } catch {
      // Store exposes the backend error for the UI.
    }
  };

  return (
    <AuthShell title="Create Account" description="Sign up to get started with core-eb-fe">
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
      <TextField label="Full Name" value={name} onChangeText={(value) => { setName(value); setError(''); clearError(); }} placeholder="John Doe" />
      <TextField label="Phone" value={phone} onChangeText={(value) => { setPhone(value); setError(''); clearError(); }} placeholder="Enter phone number" keyboardType="phone-pad" />
      <TextField label="Email" value={email} onChangeText={(value) => { setEmail(value); setError(''); clearError(); }} placeholder="your@email.com" keyboardType="email-address" />
      <TextField label="Password" value={password} onChangeText={(value) => { setPassword(value); setError(''); clearError(); }} placeholder="••••••••" secureTextEntry />
      <TextField label="Confirm Password" value={confirmPassword} onChangeText={(value) => { setConfirmPassword(value); setError(''); clearError(); }} placeholder="••••••••" secureTextEntry />
      {error || storeError ? (
        <View className="rounded-2xl bg-rose-50 p-3 dark:bg-rose-950">
          <Text className="text-sm text-rose-700 dark:text-rose-200">{error || storeError}</Text>
        </View>
      ) : null}
      <PrimaryButton label="Sign Up" onPress={handleSignUp} loading={loading} disabled={!name || !phone || !email || !password || !confirmPassword} />

      <Text className="text-center text-sm text-muted-foreground">Already have an account?</Text>
      <Link href="/auth/signin" asChild>
        <Text className="text-center text-sm font-semibold text-primary">Sign In</Text>
      </Link>
    </AuthShell>
  );
}
