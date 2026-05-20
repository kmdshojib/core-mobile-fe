import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import { useEffect, useState } from 'react';

import { AuthShell } from '@/components/ui/auth-shell';
import { PrimaryButton } from '@/components/ui/primary-button';
import { TextField } from '@/components/ui/text-field';
import { useAuthStore } from '@/store/auth-store';

export default function VerifyOtpScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ phone?: string }>();
  const verifyOtp = useAuthStore((state) => state.verifyOtp);
  const pendingPhone = useAuthStore((state) => state.pendingPhone);
  const registrationResult = useAuthStore((state) => state.registrationResult);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const phone = params.phone || pendingPhone || '';
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (canResend) {
      return;
    }

    const interval = setInterval(() => {
      setTimer((value) => {
        if (value <= 1) {
          setCanResend(true);
          clearInterval(interval);
          return 0;
        }

        return value - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [canResend]);

  const handleVerify = async () => {
    if (!phone) return;

    try {
      await verifyOtp({ phone, otp });
      router.replace('/(tabs)');
    } catch {
      // Store exposes the backend error for the UI.
    }
  };

  const handleResend = () => {
    setTimer(60);
    setCanResend(false);
  };

  return (
    <AuthShell title="Verify OTP" description="Enter the OTP sent to your phone">
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
        label="One-Time Password"
        value={otp}
        onChangeText={(value) => {
          setOtp(value.replace(/\D/g, '').slice(0, 6));
          clearError();
        }}
        placeholder="000000"
        keyboardType="numeric"
        maxLength={6}
        helperText={phone ? `Enter the 6-digit code sent to ${phone}.` : 'Please sign up first to receive an OTP.'}
      />
      {registrationResult?.otp ? <Text className="text-xs font-medium text-primary">Dev OTP: {registrationResult.otp}</Text> : null}
      {error ? (
        <View className="rounded-2xl bg-rose-50 p-3 dark:bg-rose-950">
          <Text className="text-sm text-rose-700 dark:text-rose-200">{error}</Text>
        </View>
      ) : null}
      <PrimaryButton label="Verify" onPress={handleVerify} loading={loading} disabled={otp.length !== 6 || !phone} />
      <Text className="text-center text-sm text-muted-foreground">
        {canResend ? (
          <Text className="font-semibold text-primary" onPress={handleResend}>
            Resend
          </Text>
        ) : (
          `Resend OTP in ${timer}s`
        )}
      </Text>
      <Text className="text-center text-sm text-muted-foreground">Back to</Text>
      <Link href="/auth/signin" asChild>
        <Text className="text-center text-sm font-semibold text-primary">Sign In</Text>
      </Link>
    </AuthShell>
  );
}
