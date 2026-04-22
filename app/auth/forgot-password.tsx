import { Link, useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import { useState } from 'react';

import { AuthShell } from '@/components/ui/auth-shell';
import { PrimaryButton } from '@/components/ui/primary-button';
import { TextField } from '@/components/ui/text-field';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setTimeout(() => {
        router.push({ pathname: '/auth/reset-password', params: { email } });
      }, 1200);
    }, 900);
  };

  return (
    <AuthShell title={submitted ? 'Email Sent' : 'Forgot Password'} description={submitted ? 'Check your email for password reset instructions.' : 'Enter your email to receive a reset OTP.'}>
      {submitted ? (
        <>
          <View className="rounded-[24px] bg-emerald-50 p-4">
            <Text className="text-sm leading-6 text-emerald-700">We&apos;ve sent a password reset link to {email || 'your@email.com'}.</Text>
          </View>
          <Text className="text-center text-sm text-muted-foreground">You will be redirected to verify your OTP shortly.</Text>
        </>
      ) : (
        <>
          <TextField
            label="Email Address"
            value={email}
            onChangeText={setEmail}
            placeholder="your@email.com"
            keyboardType="email-address"
            helperText="We'll send you an OTP to reset your password."
          />
          <PrimaryButton label="Send OTP" onPress={handleSubmit} loading={loading} />
        </>
      )}

      <Text className="text-center text-sm text-muted-foreground">Remember your password?</Text>
      <Link href="/auth/signin" asChild>
        <Text className="text-center text-sm font-semibold text-primary">Sign In</Text>
      </Link>
    </AuthShell>
  );
}
