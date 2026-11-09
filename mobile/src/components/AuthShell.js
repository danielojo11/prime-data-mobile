import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Moon, Sun } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import AppText from './ui/AppText';
import GlassCard from './ui/GlassCard';
import PressableScale from './ui/PressableScale';
import { AppBackground } from './Screen';

export default function AuthShell({ title, subtitle, children, footer, badge }) {
  const { colors, isDark, toggleTheme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <AppBackground />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            flexGrow: 1,
            paddingTop: insets.top + 18,
            paddingBottom: insets.bottom + 28,
            paddingHorizontal: 22,
            justifyContent: 'center',
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 26,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 11 }}>
              <LinearGradient
                colors={['#10B981', '#059669']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 13,
                  alignItems: 'center',
                  justifyContent: 'center',
                  shadowColor: '#10B981',
                  shadowOpacity: 0.35,
                  shadowRadius: 12,
                  shadowOffset: { width: 0, height: 5 },
                  elevation: 5,
                }}
              >
                <AppText weight="extraBold" size={15} color="#FFFFFF">
                  PD
                </AppText>
              </LinearGradient>
              <View>
                <AppText weight="extraBold" size={16.5} style={{ letterSpacing: -0.2 }}>
                  PrimeData
                </AppText>
                <AppText
                  size={9}
                  weight="semiBold"
                  color={colors.textMuted}
                  style={{ letterSpacing: 1.7, marginTop: 1 }}
                >
                  VTU PLATFORM
                </AppText>
              </View>
            </View>

            <PressableScale
              onPress={toggleTheme}
              accessibilityLabel="Toggle color theme"
              style={{
                width: 42,
                height: 42,
                borderRadius: 14,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: colors.inputBg,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              {isDark ? (
                <Sun size={19} color={colors.amber} />
              ) : (
                <Moon size={19} color={colors.purple} />
              )}
            </PressableScale>
          </View>

          <GlassCard
            borderRadius={26}
            style={{
              paddingHorizontal: 22,
              paddingTop: 26,
              paddingBottom: 24,
              backgroundColor: isDark ? colors.card : 'rgba(255,255,255,0.92)',
            }}
          >
            {badge ? (
              <View
                style={{
                  alignSelf: 'flex-start',
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 8,
                  backgroundColor: colors.successSoft,
                  borderWidth: 1,
                  borderColor: 'rgba(16,185,129,0.22)',
                  marginBottom: 14,
                }}
              >
                <AppText weight="semiBold" size={10} color={colors.green} style={{ letterSpacing: 0.6 }}>
                  {badge}
                </AppText>
              </View>
            ) : null}

            <AppText weight="extraBold" size={27} style={{ letterSpacing: -0.6 }}>
              {title}
            </AppText>
            <AppText
              size={13}
              color={colors.textSecondary}
              style={{ marginTop: 6, lineHeight: 19 }}
            >
              {subtitle}
            </AppText>

            <View style={{ marginTop: 24 }}>{children}</View>
          </GlassCard>

          {footer ? <View style={{ marginTop: 20 }}>{footer}</View> : null}

          <AppText
            size={10.5}
            color={colors.textMuted}
            align="center"
            style={{ marginTop: 26, lineHeight: 16 }}
          >
            Secured by PrimeData · 256-bit encryption
          </AppText>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
