import React from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNetworkState } from 'expo-network';
import { WifiOff } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';
import AppText from './ui/AppText';

export function AppBackground() {
  const { colors, isDark } = useTheme();
  const strength = isDark ? 1 : 0.5;

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <View
        style={[
          styles.glow,
          {
            top: -170,
            left: -130,
            backgroundColor: colors.blue,
            opacity: 0.13 * strength,
          },
        ]}
      />
      <View
        style={[
          styles.glow,
          {
            top: -80,
            right: -150,
            backgroundColor: colors.purple,
            opacity: 0.11 * strength,
          },
        ]}
      />
      <View
        style={[
          styles.glow,
          {
            bottom: -220,
            right: -110,
            backgroundColor: colors.green,
            opacity: 0.1 * strength,
          },
        ]}
      />
    </View>
  );
}

export default function Screen({
  children,
  scroll = true,
  contentContainerStyle,
  style,
  edges = ['top'],
  padded = true,
  background = true,
  refreshing = false,
  onRefresh,
  keyboardShouldPersistTaps = 'handled',
}) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const networkState = useNetworkState();
  const paddingTop = edges.includes('top') ? insets.top : 0;
  const paddingBottom = edges.includes('bottom') ? insets.bottom : 0;
  const offline =
    networkState?.isConnected === false || networkState?.isInternetReachable === false;

  const refreshControl = onRefresh ? (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      tintColor={colors.green}
      colors={[colors.green]}
      progressBackgroundColor={colors.cardSolid}
    />
  ) : undefined;

  return (
    <View style={[styles.root, { backgroundColor: colors.bg }, style]}>
      {background ? <AppBackground /> : null}
      <View style={{ flex: 1, paddingTop, paddingBottom }}>
        {offline ? (
          <View
            accessibilityLiveRegion="polite"
            style={[
              styles.offline,
              {
                backgroundColor: colors.warningSoft,
                borderColor: 'rgba(245,158,11,0.24)',
              },
            ]}
          >
            <WifiOff size={13} color={colors.amber} />
            <AppText weight="medium" size={11} color={colors.amber} style={{ flex: 1 }}>
              You&apos;re offline — some actions may not complete.
            </AppText>
          </View>
        ) : null}
        {scroll ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps={keyboardShouldPersistTaps}
            refreshControl={refreshControl}
            contentContainerStyle={[
              padded && styles.padded,
              contentContainerStyle,
            ]}
          >
            {children}
          </ScrollView>
        ) : (
          children
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  padded: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  offline: {
    marginHorizontal: 20,
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 11,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  glow: {
    position: 'absolute',
    width: 340,
    height: 340,
    borderRadius: 170,
  },
});
