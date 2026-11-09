import React from 'react';
import { Pressable } from 'react-native';

export default function PressableScale({
  children,
  style,
  onPress,
  onLongPress,
  disabled = false,
  scaleTo = 0.97,
  hitSlop,
  accessibilityLabel,
  accessibilityRole = 'button',
}) {
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      disabled={disabled}
      hitSlop={hitSlop}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [
        style,
        pressed &&
          !disabled && {
            opacity: 0.82,
            transform: [{ scale: scaleTo }],
          },
      ]}
    >
      {children}
    </Pressable>
  );
}
