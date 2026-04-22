import { Link, useRouter } from 'expo-router';
import { Text } from 'react-native';
import { useEffect, useState } from 'react';

import { AuthShell } from '@/components/ui/auth-shell';
import { PrimaryButton } from '@/components/ui/primary-button';
import { TextField } from '@/components/ui/text-field';

export default function VerifyOtpScreen() {
  const router = useRouter();
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
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

  const handleVerify = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.replace('/(tabs)');
    }, 900);
  };

  const handleResend = () => {
    setTimer(60);
    setCanResend(false);
  };

  return (
    <AuthShell title="Verify OTP" description="Enter the OTP sent to your email to complete sign up.">
      <TextField
        label="One-Time Password"
        value={otp}
        onChangeText={(value) => setOtp(value.replace(/\D/g, '').slice(0, 6))}
        placeholder="000000"
        keyboardType="numeric"
        maxLength={6}
        helperText="Enter the 6-digit code sent to your email."
      />
      <PrimaryButton label="Verify" onPress={handleVerify} loading={loading} disabled={otp.length !== 6} />
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
