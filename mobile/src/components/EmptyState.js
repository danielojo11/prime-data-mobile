import React from 'react';
import { View } from 'react-native';
import { Inbox } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';
import AppText from './ui/AppText';

export default function EmptyState({
  icon: Icon = Inbox,
  title = 'Nothing here yet',
  message = 'New activity will show up here.',
  action,
  style,
}) {
  const { colors } = useTheme();

  return (
    <View style={[{ alignItems: 'center', paddingVertical: 34, paddingHorizontal: 20 }, style]}>
      <View
        style={{
          width: 58,
          height: 58,
          borderRadius: 19,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.inputBg,
          borderWidth: 1,
          borderColor: colors.border,
          marginBottom: 14,
        }}
      >
        <Icon size={25} color={colors.textMuted} />
      </View>
      <AppText weight="semiBold" size={15} align="center">
        {title}
      </AppText>
      <AppText
        size={12.5}
        color={colors.textSecondary}
        align="center"
        style={{ marginTop: 4, lineHeight: 18, maxWidth: 260 }}
      >
        {message}
      </AppText>
      {action ? <View style={{ marginTop: 16, width: '100%', maxWidth: 220 }}>{action}</View> : null}
    </View>
  );
}
