import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import AppText from './ui/AppText';

export default function PageHeader({ eyebrow, title, subtitle, right, style }) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: 8,
          paddingBottom: 18,
        },
        style,
      ]}
    >
      <View style={{ flex: 1, paddingRight: 14 }}>
        {eyebrow ? (
          <AppText
            weight="semiBold"
            size={11}
            color={colors.textSecondary}
            style={{ letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 4 }}
          >
            {eyebrow}
          </AppText>
        ) : null}
        <AppText weight="extraBold" size={eyebrow ? 27 : 25} numberOfLines={1}>
          {title}
        </AppText>
        {subtitle ? (
          <AppText size={13} color={colors.textSecondary} style={{ marginTop: 4, lineHeight: 19 }}>
            {subtitle}
          </AppText>
        ) : null}
      </View>
      {right ? <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>{right}</View> : null}
    </View>
  );
}
