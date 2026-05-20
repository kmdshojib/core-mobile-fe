import { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type AuthShellProps = {
  title: string;
  description: string;
  children: ReactNode;
  headerAction?: ReactNode;
};

export function AuthShell({ title, description, children, headerAction }: AuthShellProps) {
  return (
    <SafeAreaView edges={['top', 'left', 'right']} className="flex-1 bg-background dark:bg-slate-950">
      <KeyboardAvoidingView
        className="flex-1 justify-center px-5"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View className="overflow-hidden rounded-[32px] border border-primary/15 bg-white px-5 py-6 shadow-card dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
          <View className="flex-row items-start justify-between gap-4">
            <View className="min-w-0 flex-1">
              <Text className="text-3xl font-bold text-foreground dark:text-slate-50">{title}</Text>
              <Text className="mt-2 text-sm leading-6 text-muted-foreground dark:text-slate-400">{description}</Text>
            </View>
            {headerAction ? <View>{headerAction}</View> : null}
          </View>
          <View className="mt-6 gap-4">{children}</View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
