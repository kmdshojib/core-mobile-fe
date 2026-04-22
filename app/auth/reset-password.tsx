import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import { useEffect, useState } from 'react';

import { AuthShell } from '@/components/ui/auth-shell';
import { PrimaryButton } from '@/components/ui/primary-button';
import { TextField } from '@/components/ui/text-field';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email?: string }>();
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState<'otp' | 'password'>('otp');
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

  const handleVerifyOtp = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('password');
    }, 900);
  };

  const handleResetPassword = () => {
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.replace('/auth/signin');
    }, 900);
  };

  const handleResend = () => {
    setTimer(60);
    setCanResend(false);
  };

  return (
    <AuthShell
      title={step === 'otp' ? 'Verify OTP' : 'Set New Password'}
      description={
        step === 'otp'
          ? `Enter the OTP sent to ${email || 'your email'}.`
          : 'Create a strong password for your account.'
      }>
      {step === 'otp' ? (
        <>
          <TextField
            label="One-Time Password"
            value={otp}
            onChangeText={(value) => setOtp(value.replace(/\D/g, '').slice(0, 6))}
            placeholder="000000"
            keyboardType="numeric"
            maxLength={6}
            helperText="Enter the 6-digit code from your email."
          />
          <PrimaryButton label="Verify" onPress={handleVerifyOtp} loading={loading} disabled={otp.length !== 6} />
          <Text className="text-center text-sm text-muted-foreground">
            {canResend ? (
              <Text className="font-semibold text-primary" onPress={handleResend}>
                Resend OTP
              </Text>
            ) : (
              `Resend OTP in ${timer}s`
            )}
          </Text>
        </>
      ) : (
        <>
          <TextField
            label="New Password"
            value={newPassword}
            onChangeText={(value) => {
              setNewPassword(value);
              setError('');
            }}
            placeholder="••••••••"
            secureTextEntry
            helperText="At least 8 characters long."
          />
          <TextField
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={(value) => {
              setConfirmPassword(value);
              setError('');
            }}
            placeholder="••••••••"
            secureTextEntry
          />
          {error ? <View className="rounded-2xl bg-rose-50 p-3"><Text className="text-sm text-rose-600">{error}</Text></View> : null}
          <PrimaryButton label="Reset Password" onPress={handleResetPassword} loading={loading} />
        </>
      )}

      <Text className="text-center text-sm text-muted-foreground">Back to</Text>
      <Link href="/auth/signin" asChild>
        <Text className="text-center text-sm font-semibold text-primary">Sign In</Text>
      </Link>
    </AuthShell>
  );
}
