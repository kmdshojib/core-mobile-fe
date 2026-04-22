import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';

import { AppHeader } from '@/components/ui/app-header';
import { PrimaryButton } from '@/components/ui/primary-button';
import { Screen } from '@/components/ui/screen';

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-background dark:bg-slate-950">
      <AppHeader title="Profile" subtitle="Account, auth flows, and study overview" />
      <Screen>
        <View className="rounded-[28px] border border-border bg-card p-5 shadow-card dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
          <Text className="text-2xl font-bold text-foreground dark:text-slate-50">Student Profile</Text>
          <Text className="mt-2 text-sm leading-6 text-muted-foreground dark:text-slate-400">
            I used this screen to surface the web app’s sign-in, sign-up, OTP, and reset-password flows inside the mobile build.
          </Text>

          <View className="mt-5 gap-3">
            <PrimaryButton label="Open Sign In" onPress={() => router.push('/auth/signin')} />
            <PrimaryButton label="Create Account" variant="outline" onPress={() => router.push('/auth/signup')} />
          </View>
        </View>
      </Screen>
    </View>
  );
}
