import React from 'react';
import { ActivityIndicator } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import AppText from './AppText';
import PressableScale from './PressableScale';

const VARIANTS = {
  primary: {
    backgroundColor: 'green',
    borderWidth: 0,
    text: '#FFFFFF',
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'green',
    text: 'green',
  },
  contrast: {
    backgroundColor: 'text',
    borderWidth: 0,
    text: 'bg',
  },
  danger: {
    backgroundColor: 'dangerSoft',
    borderWidth: 1,
    borderColor: 'danger',
    text: 'danger',
  },
  rose: {
    backgroundColor: 'rose',
    borderWidth: 0,
    text: '#FFFFFF',
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    text: 'textSecondary',
  },
};

export default function AppButton({
  title,
  onPress,
  variant = 'primary',
  icon,
  loading = false,
  disabled = false,
  style,
  textStyle,
  size = 'md',
}) {
  const { colors } = useTheme();
  const config = VARIANTS[variant] || VARIANTS.primary;
  const isDisabled = disabled || loading;

  const backgroundColor =
    config.backgroundColor === 'green'
      ? colors.green
      : config.backgroundColor === 'text'
        ? colors.text
        : config.backgroundColor === 'rose'
          ? colors.rose
          : config.backgroundColor === 'dangerSoft'
            ? colors.dangerSoft
            : colors[config.backgroundColor] || 'transparent';

  const textColor =
    config.text === 'green'
      ? colors.green
      : config.text === 'bg'
        ? colors.bg
        : config.text === 'danger'
          ? colors.red
          : config.text === 'textSecondary'
            ? colors.textSecondary
            : config.text;

  const height = size === 'sm' ? 44 : size === 'lg' ? 58 : 54;

  return (
    <PressableScale
      onPress={onPress}
      disabled={isDisabled}
      accessibilityLabel={title}
      style={[
        {
          height,
          borderRadius: 14,
          backgroundColor,
          borderWidth: config.borderWidth,
          borderColor: config.borderColor
            ? colors[config.borderColor] || config.borderColor
            : 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          gap: 8,
          opacity: isDisabled ? 0.55 : 1,
        },
        variant === 'primary' && !isDisabled
          ? {
              shadowColor: colors.green,
              shadowOpacity: 0.28,
              shadowRadius: 12,
              shadowOffset: { width: 0, height: 5 },
              elevation: 4,
            }
          : null,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <>
          {icon}
          {title ? (
            <AppText
              weight="semiBold"
              size={size === 'sm' ? 14 : 15}
              color={textColor}
              style={textStyle}
            >
              {title}
            </AppText>
          ) : null}
        </>
      )}
    </PressableScale>
  );
}
