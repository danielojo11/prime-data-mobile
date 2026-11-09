import React, { useState } from 'react';
import { Share, StyleSheet, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Activity,
  BarChart2,
  Check,
  ChevronRight,
  Copy,
  CreditCard,
  Database,
  DollarSign,
  Fingerprint,
  Gift,
  LogOut,
  Moon,
  Palette,
  RefreshCw,
  ScanFace,
  Settings,
  Shield,
  Sun,
  User,
  Users,
} from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useTheme } from '../../theme/ThemeContext';
import { formatNaira, initialsOf } from '../../utils/format';
import Screen from '../../components/Screen';
import PageHeader from '../../components/PageHeader';
import AppText from '../../components/ui/AppText';
import AppButton from '../../components/ui/AppButton';
import AppInput from '../../components/ui/AppInput';
import GlassCard from '../../components/ui/GlassCard';
import PressableScale from '../../components/ui/PressableScale';
import SheetModal from '../../components/ui/SheetModal';
import Toggle from '../../components/ui/Toggle';
import TransactionRow from '../../components/TransactionRow';
import EmptyState from '../../components/EmptyState';

function Section({ title, children, style }) {
  return (
    <View style={[{ gap: 10 }, style]}>
      <AppText weight="semiBold" size={15}>
        {title}
      </AppText>
      {children}
    </View>
  );
}

function Row({
  icon: Icon,
  color,
  soft,
  title,
  subtitle,
  onPress,
  right,
  last = false,
}) {
  const { colors } = useTheme();

  return (
    <PressableScale
      onPress={onPress}
      disabled={!onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 13,
        paddingHorizontal: 14,
        borderBottomWidth: last ? 0 : StyleSheet.hairlineWidth,
        borderBottomColor: colors.border,
      }}
    >
      <View
        style={{
          width: 38,
          height: 38,
          borderRadius: 12,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: soft,
          borderWidth: 1,
          borderColor: `${color}30`,
        }}
      >
        <Icon size={18} color={color} />
      </View>

      <View style={{ flex: 1, minWidth: 0 }}>
        <AppText weight="medium" size={13} numberOfLines={1}>
          {title}
        </AppText>
        {subtitle ? (
          <AppText size={10.5} color={colors.textSecondary} style={{ marginTop: 2 }} numberOfLines={1}>
            {subtitle}
          </AppText>
        ) : null}
      </View>

      {right || <ChevronRight size={17} color={colors.textMuted} />}
    </PressableScale>
  );
}

function StatCard({ label, value, color, icon: Icon }) {
  const { colors } = useTheme();
  return (
    <GlassCard borderRadius={14} style={{ flex: 1, padding: 11 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
        {Icon ? <Icon size={12} color={color || colors.textSecondary} /> : null}
        <AppText size={9.5} color={colors.textSecondary} weight="medium" numberOfLines={1}>
          {label}
        </AppText>
      </View>
      <AppText weight="bold" size={13.5} color={color || colors.text} style={{ marginTop: 3 }} numberOfLines={1}>
        {value}
      </AppText>
    </GlassCard>
  );
}

export default function ProfileScreen() {
  const {
    user,
    transactions,
    isAdmin,
    logout,
    updateUser,
    updateSecurity,
  } = useAuth();
  const { colors, isDark, setTheme } = useTheme();
  const { showToast, showError, showInfo } = useToast();

  const [activeSheet, setActiveSheet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState({ name: '', email: '', phone: '' });
  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    enable2FA: false,
    biometricEnabled: false,
    biometricType: 'fingerprint',
  });
  const [copied, setCopied] = useState(false);
  const [autoRenew, setAutoRenew] = useState(true);

  const accent = isAdmin ? colors.amber : colors.green;
  const accentSoft = isAdmin ? colors.warningSoft : colors.successSoft;

  const history = isAdmin
    ? transactions
    : transactions.filter((transaction) => transaction.userEmail === user?.email);

  const openEdit = () => {
    setEditData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    });
    setActiveSheet('edit');
  };

  const openSecurity = () => {
    setSecurityData({
      currentPassword: '',
      newPassword: '',
      enable2FA: Boolean(user?.twoFactorEnabled),
      biometricEnabled: Boolean(user?.biometricEnabled),
      biometricType: user?.biometricType || 'fingerprint',
    });
    setActiveSheet('security');
  };

  const saveProfile = async () => {
    if (editData.name.trim().length < 2) {
      showError('Enter your full name');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editData.email.trim())) {
      showError('Enter a valid email address');
      return;
    }
    if (editData.phone.replace(/\D/g, '').length < 10) {
      showError('Enter a valid phone number');
      return;
    }

    setLoading(true);
    const result = await updateUser(editData);
    setLoading(false);

    if (!result.success) {
      showError(result.message);
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    showToast(result.message || 'Profile updated successfully');
    setActiveSheet(null);
  };

  const saveSecurity = async () => {
    setLoading(true);
    const result = await updateSecurity(
      securityData.currentPassword,
      securityData.newPassword,
      securityData.enable2FA,
      securityData.biometricEnabled,
      securityData.biometricType
    );
    setLoading(false);

    if (!result.success) {
      showError(result.message);
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    showToast(result.message || 'Security settings updated');
    setActiveSheet(null);
  };

  const copyReferral = async () => {
    await Clipboard.setStringAsync(String(user?.referralCode || ''));
    Haptics.selectionAsync().catch(() => {});
    setCopied(true);
    showToast('Referral code copied');
    setTimeout(() => setCopied(false), 1600);
  };

  const shareReferral = async () => {
    const link = `https://primedata.app/signup?ref=${user?.referralCode || ''}`;
    try {
      await Share.share({
        message: `Join me on PrimeData VTU and get the best rates on data, airtime and bills. Use my code ${user?.referralCode || ''}: ${link}`,
      });
    } catch {
      showError('Unable to open the share sheet');
    }
  };

  const handleLogout = async () => {
    setActiveSheet(null);
    await logout();
    router.replace('/login');
  };

  const comingSoon = (feature) => showInfo(`${feature} panel coming soon`);

  const preferences = (
    <Section title="Preferences">
      <GlassCard style={{ overflow: 'hidden' }}>
        <Row
          icon={Palette}
          color={colors.purple}
          soft={colors.purpleSoft}
          title="Light Mode"
          subtitle="Toggle app brightness"
          last
          right={
            <Toggle
              value={!isDark}
              onChange={(value) => {
                setTheme(value ? 'light' : 'dark');
                Haptics.selectionAsync().catch(() => {});
              }}
            />
          }
        />
      </GlassCard>
    </Section>
  );

  const headerAction = (
    <PressableScale
      onPress={() => {
        setTheme(isDark ? 'light' : 'dark');
        Haptics.selectionAsync().catch(() => {});
      }}
      accessibilityLabel="Toggle color theme"
      style={{
        width: 44,
        height: 44,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.inputBg,
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      {isDark ? <Sun size={19} color={colors.amber} /> : <Moon size={19} color={colors.purple} />}
    </PressableScale>
  );

  return (
    <Screen contentContainerStyle={{ gap: 20 }}>
      <PageHeader
        eyebrow="Account"
        title={isAdmin ? 'Admin Dashboard' : 'My Profile'}
        subtitle={
          isAdmin ? 'Operations, users and financial overview' : 'Manage your account and preferences'
        }
        right={headerAction}
      />

      <GlassCard
        borderRadius={20}
        style={{
          padding: 16,
          backgroundColor: isDark ? colors.card : 'rgba(255,255,255,0.9)',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <LinearGradient
            colors={isAdmin ? ['#F59E0B', '#B45309'] : ['#10B981', '#047857']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: 58,
              height: 58,
              borderRadius: 19,
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: accent,
              shadowOpacity: 0.3,
              shadowRadius: 14,
              shadowOffset: { width: 0, height: 6 },
              elevation: 5,
            }}
          >
            <AppText weight="extraBold" size={20} color="#FFFFFF">
              {initialsOf(user?.name)}
            </AppText>
          </LinearGradient>

          <View style={{ flex: 1, minWidth: 0 }}>
            <AppText weight="bold" size={18} numberOfLines={1}>
              {user?.name || 'Guest User'}
            </AppText>
            <AppText size={11.5} color={colors.textSecondary} numberOfLines={1} style={{ marginTop: 2 }}>
              {user?.email || 'guest@primedata.com'}
            </AppText>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 6 }}>
              <View
                style={{
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                  borderRadius: 7,
                  backgroundColor: accentSoft,
                  borderWidth: 1,
                  borderColor: `${accent}30`,
                }}
              >
                <AppText weight="semiBold" size={9} color={accent} style={{ textTransform: 'capitalize' }}>
                  {user?.role || 'user'}
                </AppText>
              </View>
              <AppText size={10.5} color={colors.textMuted}>
                {user?.phone || '08000000000'}
              </AppText>
            </View>
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: 9, marginTop: 15 }}>
          <StatCard
            label="Balance"
            value={formatNaira(user?.walletBalance || 0)}
            color={colors.green}
          />
          <StatCard
            label="Commission"
            value={formatNaira(user?.commission || 0)}
            icon={DollarSign}
            color={colors.blue}
          />
          <StatCard
            label="Referrals"
            value={String(user?.referralsCount || 0)}
            icon={Users}
            color={colors.purple}
          />
        </View>
      </GlassCard>

      {isAdmin ? (
        <>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              paddingHorizontal: 13,
              paddingVertical: 11,
              borderRadius: 13,
              backgroundColor: colors.warningSoft,
              borderWidth: 1,
              borderColor: 'rgba(245,158,11,0.22)',
            }}
          >
            <Shield size={17} color={colors.amber} />
            <AppText weight="semiBold" size={11.5} color={colors.amber}>
              Admin privileges enabled
            </AppText>
          </View>

          {preferences}

          <Section title="Operations & System">
            <GlassCard style={{ overflow: 'hidden' }}>
              <Row
                icon={User}
                color={colors.green}
                soft={colors.successSoft}
                title="Admin Account Management"
                subtitle="Update admin details & credentials"
                onPress={() => comingSoon('Admin account management')}
              />
              <Row
                icon={Settings}
                color={colors.textSecondary}
                soft={colors.inputBg}
                title="System Settings Control"
                subtitle="Configure app settings & permissions"
                onPress={() => comingSoon('System settings')}
                last
              />
            </GlassCard>
          </Section>

          <Section title="User & Data Management">
            <GlassCard style={{ overflow: 'hidden' }}>
              <Row
                icon={Users}
                color={colors.blue}
                soft={colors.blueSoft}
                title="User Management"
                subtitle="View, edit, suspend or delete users"
                onPress={() => comingSoon('User management')}
              />
              <Row
                icon={BarChart2}
                color={colors.purple}
                soft={colors.purpleSoft}
                title="Monitor User Activities"
                subtitle="Track purchases, usage & logins"
                onPress={() => comingSoon('User activities')}
              />
              <Row
                icon={Database}
                color={colors.green}
                soft={colors.successSoft}
                title="Manage Data Plans"
                subtitle="Create, update, or delete plans"
                onPress={() => comingSoon('Data plan management')}
                last
              />
            </GlassCard>
          </Section>

          <Section title="Financials">
            <GlassCard style={{ overflow: 'hidden' }}>
              <Row
                icon={DollarSign}
                color={colors.green}
                soft={colors.successSoft}
                title="View Transactions & Revenue"
                subtitle="Monitor payments & financial reports"
                onPress={() => setActiveSheet('history')}
                last
              />
            </GlassCard>
          </Section>
        </>
      ) : (
        <>
          <Section title="Account Profile">
            <GlassCard style={{ overflow: 'hidden' }}>
              <Row
                icon={User}
                color={colors.green}
                soft={colors.successSoft}
                title="Edit Personal Information"
                subtitle="Update name, phone and email"
                onPress={openEdit}
              />
              <Row
                icon={Activity}
                color={colors.amber}
                soft={colors.warningSoft}
                title="Data Usage & Balance"
                subtitle="Check active plans & expiry dates"
                onPress={() => setActiveSheet('data')}
                last
              />
            </GlassCard>
          </Section>

          {preferences}

          <Section title="Services & Billing">
            <GlassCard style={{ overflow: 'hidden' }}>
              <Row
                icon={RefreshCw}
                color={colors.blue}
                soft={colors.blueSoft}
                title="Manage Subscription"
                subtitle="Renew or purchase new data plans"
                onPress={() => setActiveSheet('subscription')}
              />
              <Row
                icon={CreditCard}
                color={colors.purple}
                soft={colors.purpleSoft}
                title="Payment History"
                subtitle="View past transactions and receipts"
                onPress={() => setActiveSheet('history')}
              />
              <Row
                icon={Gift}
                color={colors.green}
                soft={colors.successSoft}
                title="Refer & Earn"
                subtitle="Invite friends and earn ₦500 each"
                onPress={() => setActiveSheet('referral')}
                last
              />
            </GlassCard>
          </Section>

          <Section title="Security">
            <GlassCard style={{ overflow: 'hidden' }}>
              <Row
                icon={Shield}
                color={colors.green}
                soft={colors.successSoft}
                title="Security Settings"
                subtitle="Password, 2FA and biometrics"
                onPress={openSecurity}
                last
              />
            </GlassCard>
          </Section>
        </>
      )}

      <AppButton
        title="Log Out"
        variant="danger"
        onPress={() => setActiveSheet('logout')}
        icon={<LogOut size={18} color={colors.red} />}
        style={{ marginTop: 2 }}
      />

      <View style={{ alignItems: 'center', gap: 4 }}>
        <AppText size={10} color={colors.textMuted}>
          PrimeData VTU · Version 1.0.0
        </AppText>
        <AppText size={9.5} color={colors.textMuted}>
          Secure wallet · Instant delivery · 24/7 support
        </AppText>
      </View>

      <SheetModal
        visible={activeSheet === 'edit'}
        onClose={() => setActiveSheet(null)}
        title="Edit Personal Info"
        subtitle="Update the details linked to your wallet"
      >
        <View style={{ gap: 15 }}>
          <AppInput
            label="Full Name"
            value={editData.name}
            onChangeText={(value) => setEditData((current) => ({ ...current, name: value }))}
            autoCapitalize="words"
          />
          <AppInput
            label="Email Address"
            value={editData.email}
            onChangeText={(value) => setEditData((current) => ({ ...current, email: value }))}
            keyboardType="email-address"
          />
          <AppInput
            label="Phone Number"
            value={editData.phone}
            onChangeText={(value) =>
              setEditData((current) => ({ ...current, phone: value.replace(/[^0-9]/g, '') }))
            }
            keyboardType="phone-pad"
            maxLength={11}
          />
          <AppButton title="Save Changes" onPress={saveProfile} loading={loading} />
        </View>
      </SheetModal>

      <SheetModal
        visible={activeSheet === 'security'}
        onClose={() => setActiveSheet(null)}
        title="Security Settings"
        subtitle="Protect your wallet and transactions"
        maxHeight="92%"
      >
        <View style={{ gap: 15 }}>
          <AppInput
            label="Current Password"
            placeholder="Leave blank to keep current"
            value={securityData.currentPassword}
            onChangeText={(value) =>
              setSecurityData((current) => ({ ...current, currentPassword: value }))
            }
            secure
          />
          <AppInput
            label="New Password"
            placeholder="At least 6 characters"
            value={securityData.newPassword}
            onChangeText={(value) =>
              setSecurityData((current) => ({ ...current, newPassword: value }))
            }
            secure
          />

          <GlassCard style={{ overflow: 'hidden' }}>
            <Row
              icon={Shield}
              color={colors.green}
              soft={colors.successSoft}
              title="Two-factor authentication"
              subtitle="Require an OTP at checkout"
              right={
                <Toggle
                  value={securityData.enable2FA}
                  onChange={(value) =>
                    setSecurityData((current) => ({ ...current, enable2FA: value }))
                  }
                />
              }
            />
            <Row
              icon={securityData.biometricType === 'face' ? ScanFace : Fingerprint}
              color={colors.blue}
              soft={colors.blueSoft}
              title="Biometric login & payments"
              subtitle="Use your device biometrics"
              right={
                <Toggle
                  value={securityData.biometricEnabled}
                  onChange={(value) =>
                    setSecurityData((current) => ({ ...current, biometricEnabled: value }))
                  }
                />
              }
              last
            />
          </GlassCard>

          {securityData.biometricEnabled ? (
            <View style={{ flexDirection: 'row', gap: 10 }}>
              {[
                { id: 'fingerprint', label: 'Fingerprint', icon: Fingerprint },
                { id: 'face', label: 'Face ID', icon: ScanFace },
              ].map((option) => {
                const active = securityData.biometricType === option.id;
                return (
                  <PressableScale
                    key={option.id}
                    onPress={() =>
                      setSecurityData((current) => ({ ...current, biometricType: option.id }))
                    }
                    style={{
                      flex: 1,
                      paddingVertical: 14,
                      borderRadius: 14,
                      alignItems: 'center',
                      gap: 7,
                      backgroundColor: active ? colors.successSoft : colors.inputBg,
                      borderWidth: 1.5,
                      borderColor: active ? colors.green : colors.border,
                    }}
                  >
                    <option.icon size={22} color={active ? colors.green : colors.textSecondary} />
                    <AppText
                      weight="semiBold"
                      size={11.5}
                      color={active ? colors.green : colors.textSecondary}
                    >
                      {option.label}
                    </AppText>
                  </PressableScale>
                );
              })}
            </View>
          ) : null}

          <AppText size={10.5} color={colors.textMuted} style={{ lineHeight: 16 }}>
            Leave both password fields blank to keep your current password. Your demo password is
            required when changing it.
          </AppText>

          <AppButton title="Update Security Settings" onPress={saveSecurity} loading={loading} />
        </View>
      </SheetModal>

      <SheetModal
        visible={activeSheet === 'history'}
        onClose={() => setActiveSheet(null)}
        title={isAdmin ? 'All Transactions' : 'Payment History'}
        subtitle={`${history.length} record${history.length === 1 ? '' : 's'} found`}
        maxHeight="90%"
      >
        {history.length === 0 ? (
          <EmptyState
            icon={CreditCard}
            title="No transactions yet"
            message="Your payment history will appear here after your first purchase."
            action={
              <AppButton
                title="Explore services"
                variant="secondary"
                size="sm"
                onPress={() => {
                  setActiveSheet(null);
                  router.push('/(tabs)');
                }}
              />
            }
          />
        ) : (
          <View style={{ gap: 10 }}>
            {history.slice(0, 20).map((transaction) => (
              <TransactionRow key={transaction.id} transaction={transaction} card />
            ))}
            <AppButton
              title="Open full history"
              variant="secondary"
              size="sm"
              onPress={() => {
                setActiveSheet(null);
                router.push('/(tabs)/transactions');
              }}
            />
          </View>
        )}
      </SheetModal>

      <SheetModal
        visible={activeSheet === 'referral'}
        onClose={() => setActiveSheet(null)}
        title="Refer & Earn"
        subtitle="Invite friends and earn on every sign-up"
        maxHeight="90%"
      >
        <View style={{ alignItems: 'center', paddingTop: 6 }}>
          <LinearGradient
            colors={['rgba(16,185,129,0.28)', 'rgba(16,185,129,0.02)']}
            style={{
              width: 84,
              height: 84,
              borderRadius: 42,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: 'rgba(16,185,129,0.3)',
              marginBottom: 16,
            }}
          >
            <Gift size={38} color={colors.green} />
          </LinearGradient>

          <AppText weight="bold" size={20} align="center">
            Invite friends &amp; earn
          </AppText>
          <AppText
            size={12.5}
            color={colors.textSecondary}
            align="center"
            style={{ marginTop: 6, lineHeight: 19, maxWidth: 280 }}
          >
            Get ₦500 for every friend who joins PrimeData with your unique referral code.
          </AppText>

          <View
            style={{
              width: '100%',
              marginTop: 20,
              padding: 18,
              borderRadius: 17,
              backgroundColor: colors.inputBg,
              borderWidth: 1.5,
              borderStyle: 'dashed',
              borderColor: colors.borderStrong,
              alignItems: 'center',
            }}
          >
            <AppText size={10.5} color={colors.textSecondary} style={{ letterSpacing: 0.5 }}>
              YOUR REFERRAL CODE
            </AppText>
            <AppText
              weight="extraBold"
              size={30}
              color={colors.green}
              style={{ letterSpacing: 4, marginTop: 5 }}
            >
              {user?.referralCode || 'N/A'}
            </AppText>
          </View>

          <View style={{ flexDirection: 'row', gap: 10, width: '100%', marginTop: 14 }}>
            <GlassCard borderRadius={14} style={{ flex: 1, padding: 13 }}>
              <AppText size={10} color={colors.textSecondary}>
                Total Referrals
              </AppText>
              <AppText weight="bold" size={20} style={{ marginTop: 3 }}>
                {user?.referralsCount || 0}
              </AppText>
            </GlassCard>
            <GlassCard borderRadius={14} style={{ flex: 1, padding: 13 }}>
              <AppText size={10} color={colors.textSecondary}>
                Total Earned
              </AppText>
              <AppText weight="bold" size={20} color={colors.green} style={{ marginTop: 3 }}>
                {formatNaira(user?.referralsEarned || 0)}
              </AppText>
            </GlassCard>
          </View>

          <View style={{ flexDirection: 'row', gap: 10, width: '100%', marginTop: 16 }}>
            <AppButton
              title={copied ? 'Copied' : 'Copy Code'}
              variant="secondary"
              size="sm"
              icon={copied ? <Check size={15} color={colors.green} /> : <Copy size={15} color={colors.green} />}
              onPress={copyReferral}
              style={{ flex: 1 }}
            />
            <AppButton
              title="Share Invite"
              size="sm"
              icon={<Gift size={15} color="#FFFFFF" />}
              onPress={shareReferral}
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </SheetModal>

      <SheetModal
        visible={activeSheet === 'data'}
        onClose={() => setActiveSheet(null)}
        title="Data Usage & Balance"
        subtitle="Your active data plan and expiry"
        maxHeight="88%"
      >
        <View style={{ gap: 14 }}>
          <GlassCard
            borderRadius={18}
            style={{
              padding: 16,
              backgroundColor: colors.successSoft,
              borderColor: 'rgba(16,185,129,0.22)',
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View>
                <AppText weight="semiBold" size={15}>
                  MTN 10GB (SME)
                </AppText>
                <AppText size={11} color={colors.textSecondary} style={{ marginTop: 3 }}>
                  Expires in 12 days · 0801 234 5678
                </AppText>
              </View>
              <View
                style={{
                  paddingHorizontal: 9,
                  paddingVertical: 5,
                  borderRadius: 8,
                  backgroundColor: colors.green,
                }}
              >
                <AppText weight="semiBold" size={10} color="#FFFFFF">
                  Active
                </AppText>
              </View>
            </View>

            <View
              style={{
                height: 7,
                borderRadius: 4,
                backgroundColor: colors.border,
                marginTop: 16,
                overflow: 'hidden',
              }}
            >
              <View
                style={{
                  width: '62%',
                  height: '100%',
                  borderRadius: 4,
                  backgroundColor: colors.green,
                }}
              />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 7 }}>
              <AppText size={10} color={colors.textSecondary}>
                6.2GB remaining
              </AppText>
              <AppText size={10} color={colors.textSecondary}>
                62%
              </AppText>
            </View>
          </GlassCard>

          <GlassCard style={{ overflow: 'hidden' }}>
            <Row
              icon={RefreshCw}
              color={colors.blue}
              soft={colors.blueSoft}
              title="Auto-renew this plan"
              subtitle="Renew automatically before expiry"
              right={<Toggle value={autoRenew} onChange={setAutoRenew} />}
              last
            />
          </GlassCard>

          <AppButton
            title="Buy More Data"
            onPress={() => {
              setActiveSheet(null);
              router.push('/(tabs)');
              showToast('Choose a data plan from the Services grid');
            }}
            icon={<RefreshCw size={17} color="#FFFFFF" />}
          />
        </View>
      </SheetModal>

      <SheetModal
        visible={activeSheet === 'subscription'}
        onClose={() => setActiveSheet(null)}
        title="Manage Subscription"
        subtitle="Keep your favourite plans renewing automatically"
        maxHeight="85%"
      >
        <View style={{ gap: 14 }}>
          <GlassCard style={{ overflow: 'hidden' }}>
            <Row
              icon={RefreshCw}
              color={colors.green}
              soft={colors.successSoft}
              title="Auto-renewal"
              subtitle="Renew active plans before expiry"
              right={<Toggle value={autoRenew} onChange={setAutoRenew} />}
              last
            />
          </GlassCard>

          <GlassCard borderRadius={16} style={{ padding: 15 }}>
            <AppText weight="semiBold" size={13}>
              MTN 10GB (SME)
            </AppText>
            <AppText size={11} color={colors.textSecondary} style={{ marginTop: 3 }}>
              ₦2,600 · renews on the 28th of every month
            </AppText>
            <View style={{ flexDirection: 'row', gap: 9, marginTop: 14 }}>
              <AppButton
                title="Renew now"
                size="sm"
                onPress={() => {
                  setActiveSheet(null);
                  showToast('Subscription renewal is coming soon', 'info');
                }}
                style={{ flex: 1 }}
              />
              <AppButton
                title="Change plan"
                variant="secondary"
                size="sm"
                onPress={() => {
                  setActiveSheet(null);
                  router.push('/(tabs)');
                }}
                style={{ flex: 1 }}
              />
            </View>
          </GlassCard>
        </View>
      </SheetModal>

      <SheetModal
        visible={activeSheet === 'logout'}
        onClose={() => setActiveSheet(null)}
        title="Log out?"
        subtitle="You can sign back in with your email or biometrics anytime."
        maxHeight="60%"
      >
        <View style={{ gap: 12 }}>
          <AppButton
            title="Log Out"
            variant="danger"
            onPress={handleLogout}
            icon={<LogOut size={18} color={colors.red} />}
          />
          <AppButton title="Stay Signed In" variant="ghost" onPress={() => setActiveSheet(null)} />
        </View>
      </SheetModal>
    </Screen>
  );
}
