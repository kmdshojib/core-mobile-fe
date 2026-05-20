import React from 'react';
import { StyleSheet, TextInput, Platform } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useKeyboardHandler } from 'react-native-keyboard-controller';

export default function FocusedInputHandler() {
  const keyboardHeight = useSharedValue(0);

  useKeyboardHandler(
    {
      onMove: (e) => {
        'worklet';
        keyboardHeight.value = e.height;
      },
      onEnd: (e) => {
        'worklet';
        keyboardHeight.value = e.height;
      },
    },
    []
  );

  // Dynamic style assigning the height directly to a spacer layout view
  const fakeViewStyle = useAnimatedStyle(() => {
    return {
      // Use absolute to avoid inverse sign flips on platform variations
      height: Math.abs(keyboardHeight.value),
    };
  });

  return (
    <Animated.View style={styles.container}>
      {/* Scrollable content or chats can sit up here */}
      <Animated.View style={styles.contentPlaceholder} />

      {/* Input Tray Area */}
      <Animated.View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type something..."
          placeholderTextColor="#999"
        />
      </Animated.View>

      <Animated.View style={fakeViewStyle} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-end',
  },
  contentPlaceholder: {
    flex: 1,
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#ececec',
    backgroundColor: '#fff',
    // Extra safety buffer on iOS device chins when keyboard is hidden
    paddingBottom: Platform.OS === 'ios' ? 20 : 12, 
  },
  input: {
    height: 40,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    color: '#000',
  },
});