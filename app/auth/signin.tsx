import { Link, useRouter } from 'expo-router';
import { Text } from 'react-native';
import { useState } from 'react';

import { AuthShell } from '@/components/ui/auth-shell';
import { PrimaryButton } from '@/components/ui/primary-button';
import { TextField } from '@/components/ui/text-field';

export default function SignInScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.replace('/(tabs)');
    }, 900);
  };

  return (
    <AuthShell title="Sign In" description="Enter your credentials to access your account. This mirrors the web auth entry screen in a mobile card layout.">
      <TextField label="Phone" value={phone} onChangeText={setPhone} placeholder="Enter phone number" keyboardType="phone-pad" />
      <TextField label="Password" value={password} onChangeText={setPassword} placeholder="••••••••" secureTextEntry />
      <PrimaryButton label="Sign In" onPress={handleSignIn} loading={loading} />

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
