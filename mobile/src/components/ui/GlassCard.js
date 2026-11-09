import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

export default function GlassCard({
  children,
  style,
  borderRadius = 24,
  bordered = true,
  elevated = false,
  ...rest
}) {
  const { colors } = useTheme();
  return (
    <View
      {...rest}
      style={[
        {
          backgroundColor: colors.card,
          borderRadius,
          borderWidth: bordered ? 1 : 0,
          borderColor: colors.border,
        },
        elevated && {
          shadowColor: colors.shadow,
          shadowOpacity: 0.18,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 8 },
          elevation: 4,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
