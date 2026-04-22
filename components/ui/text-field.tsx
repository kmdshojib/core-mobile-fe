import { Text, TextInput, View } from 'react-native';

type TextFieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  helperText?: string;
  maxLength?: number;
};

export function TextField({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType = 'default',
  helperText,
  maxLength,
}: TextFieldProps) {
  return (
    <View className="gap-2">
      <Text className="text-sm font-medium text-foreground dark:text-slate-100">{label}</Text>
      <TextInput
        className="rounded-2xl border border-border bg-white px-4 py-3 text-base text-foreground dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
        placeholder={placeholder}
        placeholderTextColor="#94a3b8"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        maxLength={maxLength}
      />
      {helperText ? <Text className="text-xs text-muted-foreground dark:text-slate-400">{helperText}</Text> : null}
    </View>
  );
}
