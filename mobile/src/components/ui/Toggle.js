import React, { useEffect } from 'react';
import { Animated, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../theme/ThemeContext';
import useAnimatedValue from '../../utils/useAnimatedValue';

export default function Toggle({ value, onChange, disabled = false }) {
  const { colors } = useTheme();
  const progress = useAnimatedValue(value ? 1 : 0);

  useEffect(() => {
    Animated.spring(progress, {
      toValue: value ? 1 : 0,
      speed: 22,
      bounciness: 5,
      useNativeDriver: true,
    }).start();
  }, [value, progress]);

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      disabled={disabled}
      onPress={() => {
        Haptics.selectionAsync().catch(() => {});
        onChange(!value);
      }}
      style={{
        width: 48,
        height: 27,
        borderRadius: 14,
        padding: 3,
        justifyContent: 'center',
        backgroundColor: value ? colors.green : colors.borderStrong,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <Animated.View
        style={{
          width: 21,
          height: 21,
          borderRadius: 11,
          backgroundColor: '#FFFFFF',
          shadowColor: '#000',
          shadowOpacity: 0.2,
          shadowRadius: 3,
          shadowOffset: { width: 0, height: 1 },
          elevation: 2,
          transform: [
            {
              translateX: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 21],
              }),
            },
          ],
        }}
      />
    </Pressable>
  );
}
