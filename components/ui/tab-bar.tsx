import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';

import { navItems } from '@/lib/data';

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <SafeAreaView edges={['bottom']} className="absolute bottom-0 left-0 right-0 bg-transparent">
      <View className="mx-4 mb-3 flex-row rounded-[30px] border border-border bg-white/95 px-2 py-2 shadow-card dark:border-slate-800 dark:bg-slate-900/95 dark:shadow-none">
        {state.routes.map((route, index) => {
          const item = navItems.find((navItem) => navItem.name === route.name);
          const isFocused = state.index === index;
          const { options } = descriptors[route.key];

          if (!item) {
            return null;
          }

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          return (
            <Pressable key={route.key} className={`flex-1 items-center rounded-2xl px-2 py-2 ${isFocused ? 'bg-primary/10 dark:bg-indigo-400/10' : ''}`} onPress={onPress}>
              <View className={`rounded-2xl p-2 ${isFocused ? 'bg-primary/15 dark:bg-indigo-400/15' : ''}`}>
                <MaterialCommunityIcons name={item.icon as never} size={22} color={isFocused ? (isDark ? '#a5b4fc' : '#6366f1') : '#64748b'} />
              </View>
              <Text className={`mt-1 text-[11px] font-medium ${isFocused ? 'text-primary dark:text-indigo-300' : 'text-muted-foreground dark:text-slate-400'}`}>
                {options.title ?? item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}
