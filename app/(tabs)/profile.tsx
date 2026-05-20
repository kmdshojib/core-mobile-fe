import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';

import { AppHeader } from '@/components/ui/app-header';
import { PrimaryButton } from '@/components/ui/primary-button';
import { Screen } from '@/components/ui/screen';
import { useAuthStore } from '@/store/auth-store';

export default function ProfileScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);

  return (
    <View className="flex-1 bg-background dark:bg-slate-950">
      <AppHeader title="Profile" subtitle="Account, auth flows, and study overview" />
      <Screen>
        <View className="rounded-[28px] border border-border bg-card p-5 shadow-card dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
          <Text className="text-2xl font-bold text-foreground dark:text-slate-50">{user?.name || 'Student Profile'}</Text>
          <Text className="mt-2 text-sm leading-6 text-muted-foreground dark:text-slate-400">
            {isAuthenticated
              ? `${user?.phone || 'Signed in'}${user?.email ? ` • ${user.email}` : ''}`
              : 'Use the same sign-in, sign-up, OTP, and reset-password flow from the web frontend.'}
          </Text>

          <View className="mt-5 gap-3">
            {isAuthenticated ? (
              <PrimaryButton label="Sign Out" variant="outline" onPress={logout} />
            ) : (
              <>
                <PrimaryButton label="Open Sign In" onPress={() => router.push('/auth/signin')} />
                <PrimaryButton label="Create Account" variant="outline" onPress={() => router.push('/auth/signup')} />
              </>
            )}
          </View>
        </View>
      </Screen>
    </View>
  );
}
