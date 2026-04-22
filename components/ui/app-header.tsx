import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useColorScheme } from 'nativewind';

type AppHeaderProps = {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBackPress?: () => void;
};

export function AppHeader({ title, subtitle, showBack = false, onBackPress }: AppHeaderProps) {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <SafeAreaView edges={['top']} className="bg-background dark:bg-slate-950">
      <View className="border-b border-border/70 bg-white/90 px-5 pb-4 pt-2 dark:border-slate-800 dark:bg-slate-950/95">
        <View className="flex-row items-center gap-3">
          {showBack ? (
            <Pressable
              className="h-11 w-11 items-center justify-center rounded-2xl border border-border bg-white dark:border-slate-700 dark:bg-slate-900"
              onPress={onBackPress}>
              <MaterialCommunityIcons name="arrow-left" size={20} color={isDark ? '#f8fafc' : '#0f172a'} />
            </Pressable>
          ) : (
            <View className="h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 dark:bg-indigo-400/15">
              <MaterialCommunityIcons name="book-education-outline" size={22} color={isDark ? '#a5b4fc' : '#6366f1'} />
            </View>
          )}
          <View className="flex-1">
            <Text className="text-lg font-bold text-foreground dark:text-slate-50">{title}</Text>
            {subtitle ? <Text className="mt-1 text-sm text-muted-foreground dark:text-slate-400">{subtitle}</Text> : null}
          </View>
          <Pressable
            className="h-11 w-11 items-center justify-center rounded-2xl border border-border bg-white dark:border-slate-700 dark:bg-slate-900"
            onPress={toggleColorScheme}>
            <MaterialCommunityIcons
              name={isDark ? 'weather-sunny' : 'moon-waning-crescent'}
              size={20}
              color={isDark ? '#fbbf24' : '#6366f1'}
            />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
