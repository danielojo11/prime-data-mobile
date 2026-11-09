import React from 'react';
import { Text } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { fonts } from '../../theme/typography';

const weights = {
  regular: fonts.regular,
  medium: fonts.medium,
  semiBold: fonts.semiBold,
  bold: fonts.bold,
  extraBold: fonts.extraBold,
};

export default function AppText({
  children,
  style,
  color,
  weight = 'regular',
  size,
  align,
  ...rest
}) {
  const { colors } = useTheme();
  return (
    <Text
      {...rest}
      style={[
        {
          color: color || colors.text,
          fontFamily: weights[weight] || fonts.regular,
          ...(size ? { fontSize: size } : null),
          ...(align ? { textAlign: align } : null),
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}
