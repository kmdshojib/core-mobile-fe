import { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ScreenProps = {
  children: ReactNode;
  scroll?: boolean;
  className?: string;
};

export function Screen({ children, scroll = true, className = '' }: ScreenProps) {
  if (scroll) {
    return (
      <SafeAreaView edges={['left', 'right']} className={`flex-1 bg-background dark:bg-slate-950 ${className}`}>
        <ScrollView contentContainerClassName="px-5 pb-32 pt-5">{children}</ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['left', 'right']} className={`flex-1 bg-background dark:bg-slate-950 ${className}`}>
      <View className="flex-1 px-5 pb-10 pt-5">{children}</View>
    </SafeAreaView>
  );
}
