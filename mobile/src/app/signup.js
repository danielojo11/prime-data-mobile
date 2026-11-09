import React, { useState } from 'react';
import { Keyboard, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import {
  AlertCircle,
  Gift,
  Lock,
  Mail,
  Phone,
  User,
} from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useTheme } from '../theme/ThemeContext';
import AppButton from '../components/ui/AppButton';
import AppInput from '../components/ui/AppInput';
import AppText from '../components/ui/AppText';
import AuthShell from '../components/AuthShell';

export default function SignupScreen() {
  const params = useLocalSearchParams();
  const { signup } = useAuth();
  const { showError, showToast } = useToast();
  const { colors } = useTheme();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    transferPin: '',
    invitedByRef: typeof params.ref === 'string' ? params.ref.toUpperCase() : '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (patch) => {
    setForm((current) => ({ ...current, ...patch }));
    if (error) setError('');
  };

  const handleSubmit = async () => {
    Keyboard.dismiss();
    setError('');

    if (form.name.trim().length < 2) {
      setError('Enter your full name');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError('Enter a valid email address');
      return;
    }
    if (form.phone.replace(/\D/g, '').length < 10) {
      setError('Enter a valid phone number');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (form.transferPin.length !== 4) {
      setError('Create a 4-digit transfer PIN');
      return;
    }

    setLoading(true);
    try {
      const result = await signup(form);
      if (!result.success) {
        setError(result.message);
        showError(result.message);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
        return;
      }

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      showToast('Account created. Please log in.');
      router.replace({ pathname: '/login', params: { email: form.email.trim().toLowerCase() } });
    } catch {
      setError('Unable to create your account right now. Please try again.');
      showError('Unable to create your account right now');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      badge="JOIN PRIMEDATA"
      title="Create account"
      subtitle="One account for data, airtime, bills and wallet transfers."
      footer={
        <View style={{ alignItems: 'center' }}>
          <AppText size={13} color={colors.textSecondary}>
            Already have an account?{' '}
            <AppText
              weight="bold"
              size={13}
              color={colors.green}
              onPress={() => router.replace('/login')}
            >
              Log In
            </AppText>
          </AppText>
        </View>
      }
    >
      <View style={{ gap: 14 }}>
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
          label="Full Name"
          placeholder="Ibrahim Musa"
          value={form.name}
          onChangeText={(value) => update({ name: value })}
          icon={<User size={17} color={colors.textSecondary} />}
          autoCapitalize="words"
          autoComplete="name"
          textContentType="name"
        />

        <AppInput
          label="Email Address"
          placeholder="you@example.com"
          value={form.email}
          onChangeText={(value) => update({ email: value })}
          icon={<Mail size={17} color={colors.textSecondary} />}
          keyboardType="email-address"
          autoComplete="email"
          textContentType="emailAddress"
        />

        <AppInput
          label="Phone Number"
          placeholder="08012345678"
          value={form.phone}
          onChangeText={(value) => update({ phone: value.replace(/[^0-9]/g, '') })}
          icon={<Phone size={17} color={colors.textSecondary} />}
          keyboardType="phone-pad"
          maxLength={11}
          autoComplete="tel"
          textContentType="telephoneNumber"
        />

        <AppInput
          label="Password"
          placeholder="Create a password"
          value={form.password}
          onChangeText={(value) => update({ password: value })}
          icon={<Lock size={17} color={colors.textSecondary} />}
          secure
          autoComplete="new-password"
          textContentType="newPassword"
        />

        <AppInput
          label="Transfer PIN (4 digits)"
          placeholder="* * * *"
          value={form.transferPin}
          onChangeText={(value) => update({ transferPin: value.replace(/[^0-9]/g, '') })}
          icon={<Lock size={17} color={colors.textSecondary} />}
          secure
          keyboardType="number-pad"
          maxLength={4}
        />

        <AppInput
          label="Referral Code (optional)"
          placeholder="Enter a friend's code"
          value={form.invitedByRef}
          onChangeText={(value) => update({ invitedByRef: value.toUpperCase() })}
          icon={<Gift size={17} color={colors.textSecondary} />}
          autoCapitalize="characters"
        />

        <AppText size={10.5} color={colors.textMuted} style={{ lineHeight: 16, marginTop: -2 }}>
          Your PIN authorises wallet transfers and checkouts. Never share it with anyone.
        </AppText>

        <AppButton
          title="Create Account"
          onPress={handleSubmit}
          loading={loading}
          style={{ marginTop: 2 }}
        />
      </View>
    </AuthShell>
  );
}
