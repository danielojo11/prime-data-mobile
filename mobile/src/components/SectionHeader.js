import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import AppText from './ui/AppText';
import PressableScale from './ui/PressableScale';

export default function SectionHeader({ title, actionLabel, onAction, style }) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 11,
        },
        style,
      ]}
    >
      <AppText weight="semiBold" size={15.5}>
        {title}
      </AppText>
      {actionLabel ? (
        <PressableScale onPress={onAction} hitSlop={8}>
          <AppText weight="semiBold" size={12.5} color={colors.blue}>
            {actionLabel}
          </AppText>
        </PressableScale>
      ) : null}
    </View>
  );
}
