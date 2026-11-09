import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Tabs } from 'expo-router';
import { BlurView } from 'expo-blur';
import { Headphones, History, Home, Printer, User } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeContext';
import { fonts } from '../../theme/typography';

const TAB_ICONS = {
  index: Home,
  transactions: History,
  print: Printer,
  support: Headphones,
  profile: User,
};

export default function TabLayout() {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        sceneStyle: { backgroundColor: colors.bg },
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: colors.green,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          height: 60 + insets.bottom,
          paddingTop: 8,
          paddingBottom: Math.max(insets.bottom, 8),
          backgroundColor: 'transparent',
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: colors.tabBarBorder,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontFamily: fonts.semiBold,
          fontSize: 10,
          marginTop: 2,
        },
        tabBarItemStyle: {
          paddingVertical: 2,
        },
        tabBarBackground: () => (
          <View style={StyleSheet.absoluteFill}>
            <BlurView
              tint={isDark ? 'dark' : 'light'}
              intensity={isDark ? 55 : 80}
              style={StyleSheet.absoluteFill}
            />
            <View
              style={[StyleSheet.absoluteFill, { backgroundColor: colors.tabBar }]}
            />
          </View>
        ),
        tabBarIcon: ({ color, focused }) => {
          const Icon = TAB_ICONS[route.name] || Home;
          const filled = focused && (route.name === 'index' || route.name === 'profile');
          return (
            <View style={{ width: 36, height: 30, alignItems: 'center', justifyContent: 'center' }}>
              {focused ? (
                <View
                  style={{
                    position: 'absolute',
                    width: 36,
                    height: 28,
                    borderRadius: 10,
                    backgroundColor: colors.successSoft,
                  }}
                />
              ) : null}
              <Icon
                size={21}
                color={color}
                strokeWidth={focused ? 2.4 : 1.9}
                fill={filled ? color : 'none'}
              />
            </View>
          );
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="transactions" options={{ title: 'Transactions' }} />
      <Tabs.Screen name="print" options={{ title: 'Print' }} />
      <Tabs.Screen name="support" options={{ title: 'Support' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
