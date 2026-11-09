import React, { useState } from 'react';
import { Keyboard, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import {
  AlertCircle,
  Fingerprint,
  Lock,
  Mail,
  Sparkles,
} from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useTheme } from '../theme/ThemeContext';
import AppButton from '../components/ui/AppButton';
import AppInput from '../components/ui/AppInput';
import AppText from '../components/ui/AppText';
import PressableScale from '../components/ui/PressableScale';
import AuthShell from '../components/AuthShell';
import BiometricPrompt from '../components/BiometricPrompt';

const DEMO_EMAIL = 'demo@primedata.com';
const DEMO_PASSWORD = 'demo1234';

export default function LoginScreen() {
  const params = useLocalSearchParams();
  const { login, loginWithBiometric } = useAuth();
  const { showError, showToast } = useToast();
  const { colors } = useTheme();

  const [email, setEmail] = useState(typeof params.email === 'string' ? params.email : '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [biometricOpen, setBiometricOpen] = useState(false);

  const fillDemo = () => {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
    setError('');
    Haptics.selectionAsync().catch(() => {});
  };

  const handleSubmit = async () => {
    Keyboard.dismiss();
    setError('');

    if (!email.trim() || !password) {
      setError('Enter your email and password to continue');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
      return;
    }

    setLoading(true);
    try {
      const result = await login(email, password);
      if (!result.success) {
        setError(result.message);
        showError(result.message);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
        return;
      }

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      showToast('Welcome back to PrimeData');
      router.replace('/(tabs)');
    } catch {
      setError('Unable to sign in right now. Please try again.');
      showError('Unable to sign in right now');
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricSuccess = async () => {
    setBiometricOpen(false);
    const result = await loginWithBiometric();

    if (!result?.success) {
      setError(result?.message || 'Biometric sign-in failed');
      showError(result?.message || 'Biometric sign-in failed');
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    showToast(`Welcome back, ${result.user?.name || 'PrimeData user'}`);
    router.replace('/(tabs)');
  };

  return (
    <AuthShell
      badge="SECURE SIGN IN"
      title="Welcome back"
      subtitle="Log in to fund your wallet and pay bills in seconds."
      footer={
        <View style={{ alignItems: 'center' }}>
          <AppText size={13} color={colors.textSecondary}>
            Don&apos;t have an account?{' '}
            <AppText
              weight="bold"
              size={13}
              color={colors.green}
              onPress={() => router.push('/signup')}
            >
              Sign Up
            </AppText>
          </AppText>
          <AppText
            size={11.5}
            color={colors.textMuted}
            align="center"
            style={{ marginTop: 12 }}
            onPress={() => showToast('A password reset link has been sent to your email', 'info')}
          >
            Forgot password?
          </AppText>
        </View>
      }
    >
      <View style={{ gap: 16 }}>
        {error ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 9,
              backgroundColor: colors.dangerSoft,
              borderWidth: 1,
              borderColor: 'rgba(239,68,68,0.22)',
              borderRadius: 12,
              paddingHorizontal: 12,
              paddingVertical: 10,
            }}
          >
            <AlertCircle size={16} color={colors.red} />
            <AppText size={12} color={colors.red} style={{ flex: 1 }}>
              {error}
            </AppText>
          </View>
        ) : null}

        <AppInput
          label="Email Address"
          placeholder="you@example.com"
          value={email}
          onChangeText={(value) => {
            setEmail(value);
            if (error) setError('');
          }}
          icon={<Mail size={17} color={colors.textSecondary} />}
          keyboardType="email-address"
          autoComplete="email"
          textContentType="emailAddress"
          returnKeyType="next"
        />

        <AppInput
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={(value) => {
            setPassword(value);
            if (error) setError('');
          }}
          icon={<Lock size={17} color={colors.textSecondary} />}
          secure
          autoComplete="password"
          textContentType="password"
          returnKeyType="go"
          onSubmitEditing={handleSubmit}
        />

        <AppButton
          title="Log In"
          onPress={handleSubmit}
          loading={loading}
          style={{ marginTop: 2 }}
        />

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
          <AppText size={10} color={colors.textMuted} style={{ letterSpacing: 0.7 }}>
            OR
          </AppText>
          <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
        </View>

        <AppButton
          title="Log In with Touch ID"
          variant="secondary"
          onPress={() => setBiometricOpen(true)}
          icon={<Fingerprint size={20} color={colors.green} />}
        />

        <PressableScale
          onPress={fillDemo}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 11,
            paddingHorizontal: 13,
            paddingVertical: 12,
            borderRadius: 13,
            backgroundColor: colors.blueSoft,
            borderWidth: 1,
            borderColor: 'rgba(62,174,255,0.18)',
          }}
        >
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(62,174,255,0.14)',
            }}
          >
            <Sparkles size={16} color={colors.blue} />
          </View>
          <View style={{ flex: 1 }}>
            <AppText weight="semiBold" size={11.5} color={colors.blue}>
              Try the demo account
            </AppText>
            <AppText size={10.5} color={colors.textSecondary} style={{ marginTop: 2 }}>
              {DEMO_EMAIL} · {DEMO_PASSWORD}
            </AppText>
          </View>
          <AppText weight="bold" size={11} color={colors.blue}>
            Autofill
          </AppText>
        </PressableScale>
      </View>

      <BiometricPrompt
        isOpen={biometricOpen}
        onClose={() => setBiometricOpen(false)}
        onSuccess={handleBiometricSuccess}
        type="fingerprint"
        userName="PrimeData User"
      />
    </AuthShell>
  );
}
