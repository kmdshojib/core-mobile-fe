import { ActivityIndicator, Pressable, Text } from 'react-native';

type PrimaryButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  loading?: boolean;
};

const styles = {
  primary: {
    container: 'bg-primary border-primary',
    text: 'text-white',
  },
  secondary: {
    container: 'bg-amber-500 border-amber-500',
    text: 'text-white',
  },
  outline: {
    container: 'bg-white border-border dark:bg-slate-900 dark:border-slate-700',
    text: 'text-foreground dark:text-slate-100',
  },
};

export function PrimaryButton({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
}: PrimaryButtonProps) {
  const palette = styles[variant];

  return (
    <Pressable
      className={`h-12 items-center justify-center rounded-2xl border ${palette.container} ${disabled ? 'opacity-50' : ''}`}
      disabled={disabled || loading}
      onPress={onPress}>
      {loading ? <ActivityIndicator color={variant === 'outline' ? '#0f172a' : '#ffffff'} /> : <Text className={`text-sm font-semibold ${palette.text}`}>{label}</Text>}
    </Pressable>
  );
}
