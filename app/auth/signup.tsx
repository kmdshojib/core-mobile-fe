import { Link, useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import { useState } from 'react';

import { AuthShell } from '@/components/ui/auth-shell';
import { PrimaryButton } from '@/components/ui/primary-button';
import { TextField } from '@/components/ui/text-field';

export default function SignUpScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push('/auth/verify-otp');
    }, 900);
  };

  return (
    <AuthShell title="Create Account" description="Sign up to get started with the same flow already present on the web frontend.">
      <TextField label="Full Name" value={name} onChangeText={setName} placeholder="John Doe" />
      <TextField label="Email" value={email} onChangeText={setEmail} placeholder="your@email.com" keyboardType="email-address" />
      <TextField label="Password" value={password} onChangeText={setPassword} placeholder="••••••••" secureTextEntry />
      <TextField label="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} placeholder="••••••••" secureTextEntry />
      {error ? <View className="rounded-2xl bg-rose-50 p-3"><Text className="text-sm text-rose-600">{error}</Text></View> : null}
      <PrimaryButton label="Sign Up" onPress={handleSignUp} loading={loading} />

      <Text className="text-center text-sm text-muted-foreground">Already have an account?</Text>
      <Link href="/auth/signin" asChild>
        <Text className="text-center text-sm font-semibold text-primary">Sign In</Text>
      </Link>
    </AuthShell>
  );
}
