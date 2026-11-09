import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Stack, useRootNavigationState, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from '@expo-google-fonts/plus-jakarta-sans';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { ToastProvider } from '../context/ToastContext';
import { AppThemeProvider, useTheme } from '../theme/ThemeContext';
import SplashView from '../components/SplashView';

SplashScreen.preventAutoHideAsync().catch(() => {});
SplashScreen.setOptions({ duration: 280, fade: true });

function RootNavigator() {
  const { user, loading } = useAuth();
  const { colors, isDark, ready: themeReady } = useTheme();
  const router = useRouter();
  const segments = useSegments();
  const navigationState = useRootNavigationState();
  const [fontsLoaded, fontError] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });

  const navigationReady = Boolean(navigationState?.key);
  const fontsReady = fontsLoaded || Boolean(fontError);
  const appReady = fontsReady && !loading && themeReady && navigationReady;

  const segmentRoot = segments[0] || '';
  const isAuthRoute = segmentRoot === 'login' || segmentRoot === 'signup';

  useEffect(() => {
    if (!appReady) return;
    SplashScreen.hideAsync().catch(() => {});
  }, [appReady]);

  useEffect(() => {
    if (!appReady) return;

    if (!user && !isAuthRoute) {
      router.replace('/login');
    } else if (user && isAuthRoute) {
      router.replace('/(tabs)');
    }
  }, [appReady, user, isAuthRoute, router]);

  const holding = !appReady || (!user && !isAuthRoute) || (user && isAuthRoute);

  return (
    <View style={[styles.root, { backgroundColor: colors.bg }]}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.bg },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="login" options={{ animation: 'fade' }} />
        <Stack.Screen name="signup" options={{ animation: 'slide_from_right' }} />
      </Stack>

      <StatusBar style={isDark ? 'light' : 'dark'} />

      {holding ? (
        <SplashView
          overlay
          message={
            !appReady
              ? 'Preparing your wallet…'
              : user
                ? 'Welcome back…'
                : 'Securing your session…'
          }
        />
      ) : null}
    </View>
  );
}

export default function RootLayout() {
  return (
    <AppThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <RootNavigator />
        </ToastProvider>
      </AuthProvider>
    </AppThemeProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
