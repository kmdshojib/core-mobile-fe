import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { ActionCard } from '@/components/ui/action-card';
import { AppHeader } from '@/components/ui/app-header';
import { Screen } from '@/components/ui/screen';
import { actions } from '@/lib/data';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-background dark:bg-slate-950">
      <AppHeader title="Core English" subtitle="Mobile-first exam prep experience" />
      <Screen>
        <View className="flex-row flex-wrap gap-4 pt-3">
          {actions.map((action, index) => (
            <View
              key={action.key}
              className={actions.length % 2 !== 0 && index === actions.length - 1 ? 'w-full' : 'w-[47%]'}>
              <ActionCard label={action.label} icon={action.icon} color={action.color} onPress={() => action.route && router.push(action.route as never)} />
            </View>
          ))}
        </View>
      </Screen>
    </View>
  );
}
