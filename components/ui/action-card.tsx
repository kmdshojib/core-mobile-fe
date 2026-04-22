import { Pressable, Text, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const colorStyles = {
  indigo: { surface: 'bg-indigo-500/10', icon: '#818cf8', border: 'border-indigo-200' },
  violet: { surface: 'bg-violet-500/10', icon: '#a78bfa', border: 'border-violet-200' },
  emerald: { surface: 'bg-emerald-500/10', icon: '#34d399', border: 'border-emerald-200' },
  amber: { surface: 'bg-amber-500/10', icon: '#fbbf24', border: 'border-amber-200' },
  rose: { surface: 'bg-rose-500/10', icon: '#fb7185', border: 'border-rose-200' },
};

type ActionCardProps = {
  label: string;
  icon: string;
  color: keyof typeof colorStyles;
  onPress?: () => void;
};

export function ActionCard({ label, icon, color, onPress }: ActionCardProps) {
  const palette = colorStyles[color];

  return (
    <Pressable
      className={`min-h-28 flex-1 rounded-[28px] border bg-card px-4 py-4 shadow-card dark:border-slate-800 dark:bg-slate-900 dark:shadow-none ${palette.border}`}
      onPress={onPress}>
      <View className="gap-4">
        <View className={`h-14 w-14 items-center justify-center rounded-2xl ${palette.surface}`}>
          <MaterialCommunityIcons name={icon as never} size={24} color={palette.icon} />
        </View>
        <Text className="text-sm font-semibold leading-5 text-foreground dark:text-slate-100">{label}</Text>
      </View>
    </Pressable>
  );
}
