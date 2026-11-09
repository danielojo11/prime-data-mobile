import React, { useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Bell,
  ChevronRight,
  Gift,
  ShieldCheck,
  Sparkles,
} from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useTheme } from '../../theme/ThemeContext';
import { CATEGORIES } from '../../data/mockData';
import { greetingForNow, initialsOf } from '../../utils/format';
import Screen from '../../components/Screen';
import AppText from '../../components/ui/AppText';
import AppButton from '../../components/ui/AppButton';
import GlassCard from '../../components/ui/GlassCard';
import PressableScale from '../../components/ui/PressableScale';
import SheetModal from '../../components/ui/SheetModal';
import WalletCard from '../../components/WalletCard';
import TransactionList from '../../components/TransactionList';
import ServiceFormModal from '../../components/ServiceFormModal';
import ServiceIcon from '../../components/ServiceIcon';

const NOTIFICATIONS = [
  {
    id: 'n1',
    title: 'Wallet funded',
    body: 'Your wallet was credited with ₦5,000 via bank transfer.',
    time: '2h ago',
    tone: 'green',
  },
  {
    id: 'n2',
    title: 'Data delivered',
    body: 'MTN 1GB (SME) was delivered to 0801 234 5678.',
    time: 'Today',
    tone: 'blue',
  },
  {
    id: 'n3',
    title: 'Referral bonus',
    body: 'You earned ₦500 from a friend joining PrimeData.',
    time: 'Yesterday',
    tone: 'amber',
  },
];

const DASHBOARD_CATEGORIES = CATEGORIES.filter(
  (category) => !['Wallet', 'Rewards', 'Support'].includes(category.name)
);

export default function DashboardScreen() {
  const { user, transactions, refreshTransactions } = useAuth();
  const { showToast } = useToast();
  const { colors, isDark } = useTheme();

  const [activeService, setActiveService] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [readNotifications, setReadNotifications] = useState(false);

  const openService = (name) => {
    Haptics.selectionAsync().catch(() => {});

    if (name === 'History') {
      router.push('/(tabs)/transactions');
      return;
    }
    if (name === 'Referral Program') {
      router.push('/(tabs)/profile');
      return;
    }
    if (['FAQs', 'WhatsApp Support', 'Report Issue', 'Live Chat'].includes(name)) {
      router.push('/(tabs)/support');
      return;
    }

    setActiveService(name);
    setModalOpen(true);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshTransactions();
    setRefreshing(false);
  };

  return (
    <Screen
      contentContainerStyle={{ gap: 20 }}
      refreshing={refreshing}
      onRefresh={handleRefresh}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: 6,
        }}
      >
        <View style={{ flex: 1 }}>
          <AppText size={12.5} color={colors.textSecondary}>
            {greetingForNow()},
          </AppText>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 1 }}>
            <AppText weight="extraBold" size={24} numberOfLines={1} style={{ letterSpacing: -0.5 }}>
              {String(user?.name || 'User').split(' ')[0]}
            </AppText>
            <AppText size={21}>👋</AppText>
          </View>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <PressableScale
            onPress={() => setNotificationsOpen(true)}
            accessibilityLabel="Open notifications"
            style={{
              width: 44,
              height: 44,
              borderRadius: 15,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: colors.card,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Bell size={19} color={colors.text} />
            {!readNotifications ? (
              <View
                style={{
                  position: 'absolute',
                  top: 10,
                  right: 11,
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: colors.red,
                  borderWidth: 2,
                  borderColor: colors.bg,
                }}
              />
            ) : null}
          </PressableScale>

          <PressableScale
            onPress={() => router.push('/(tabs)/profile')}
            accessibilityLabel="Open profile"
          >
            <LinearGradient
              colors={isDark ? ['#17251F', '#0E1714'] : ['#D1FAE5', '#A7F3D0']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                width: 44,
                height: 44,
                borderRadius: 15,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: isDark ? 'rgba(16,185,129,0.28)' : 'rgba(5,150,105,0.22)',
              }}
            >
              <AppText weight="extraBold" size={14} color={colors.green}>
                {initialsOf(user?.name)}
              </AppText>
            </LinearGradient>
          </PressableScale>
        </View>
      </View>

      <WalletCard
        balance={user?.walletBalance || 0}
        commission={user?.commission || 0}
        onAction={openService}
      />

      <View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 13,
          }}
        >
          <View>
            <AppText weight="semiBold" size={16.5}>
              Services
            </AppText>
            <AppText size={11.5} color={colors.textSecondary} style={{ marginTop: 2 }}>
              Everything you need, one tap away
            </AppText>
          </View>
          <Sparkles size={17} color={colors.amber} />
        </View>

        <View style={{ gap: 11 }}>
          {DASHBOARD_CATEGORIES.map((category) => (
            <GlassCard key={category.id} borderRadius={17} style={{ padding: 13 }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 7,
                  marginBottom: 12,
                }}
              >
                <ServiceIcon name={category.icon} size={14} color={category.color} />
                <AppText weight="semiBold" size={11.5} color={colors.textSecondary}>
                  {category.name}
                </AppText>
                <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
                <AppText size={9.5} color={colors.textMuted}>
                  {category.desc}
                </AppText>
              </View>

              <View style={{ flexDirection: 'row' }}>
                {category.services.map((service) => (
                  <PressableScale
                    key={service.id}
                    onPress={() => openService(service.name)}
                    style={{
                      flex: 1,
                      alignItems: 'center',
                      gap: 6,
                      paddingHorizontal: 2,
                    }}
                  >
                    <View
                      style={{
                        width: 43,
                        height: 43,
                        borderRadius: 13,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: colors.inputBg,
                        borderWidth: 1,
                        borderColor: colors.border,
                      }}
                    >
                      <ServiceIcon name={service.icon} size={19} color={service.color} />
                    </View>
                    <AppText
                      weight="medium"
                      size={9.5}
                      align="center"
                      numberOfLines={2}
                      style={{ lineHeight: 12.5, minHeight: 25 }}
                    >
                      {service.name}
                    </AppText>
                    {service.badge ? (
                      <View
                        style={{
                          position: 'absolute',
                          top: -4,
                          right: 4,
                          paddingHorizontal: 4,
                          paddingVertical: 1,
                          borderRadius: 4,
                          backgroundColor: colors.red,
                        }}
                      >
                        <AppText
                          weight="bold"
                          size={6.5}
                          color="#FFFFFF"
                          style={{ letterSpacing: 0.2 }}
                        >
                          {service.badge.toUpperCase()}
                        </AppText>
                      </View>
                    ) : null}
                  </PressableScale>
                ))}
              </View>
            </GlassCard>
          ))}
        </View>
      </View>

      <PressableScale
        onPress={() => router.push('/(tabs)/profile')}
        accessibilityLabel="Refer and earn"
        style={{ borderRadius: 18, overflow: 'hidden' }}
      >
        <LinearGradient
          colors={
            isDark
              ? ['rgba(16,185,129,0.18)', 'rgba(16,185,129,0.04)']
              : ['rgba(16,185,129,0.13)', 'rgba(16,185,129,0.03)']
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            padding: 14,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            borderWidth: 1,
            borderColor: 'rgba(16,185,129,0.22)',
            borderRadius: 18,
          }}
        >
          <View
            style={{
              width: 42,
              height: 42,
              borderRadius: 13,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: colors.successSoft,
              borderWidth: 1,
              borderColor: 'rgba(16,185,129,0.22)',
            }}
          >
            <Gift size={20} color={colors.green} />
          </View>
          <View style={{ flex: 1 }}>
            <AppText weight="semiBold" size={13.5}>
              Refer friends, earn ₦500
            </AppText>
            <AppText size={11} color={colors.textSecondary} style={{ marginTop: 2 }}>
              Share your code and earn on every sign-up
            </AppText>
          </View>
          <ChevronRight size={18} color={colors.green} />
        </LinearGradient>
      </PressableScale>

      <TransactionList
        transactions={transactions}
        onSeeAll={() => router.push('/(tabs)/transactions')}
      />

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          marginTop: 2,
        }}
      >
        <ShieldCheck size={13} color={colors.textMuted} />
        <AppText size={10.5} color={colors.textMuted}>
          Every transaction is protected by PrimeData Secure
        </AppText>
      </View>

      <SheetModal
        visible={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        title="Notifications"
        subtitle="Your latest wallet and service updates"
        maxHeight="82%"
      >
        <View style={{ gap: 10 }}>
          {NOTIFICATIONS.map((item) => {
            const tone =
              item.tone === 'green'
                ? colors.green
                : item.tone === 'blue'
                  ? colors.blue
                  : colors.amber;
            const toneSoft =
              item.tone === 'green'
                ? colors.successSoft
                : item.tone === 'blue'
                  ? colors.blueSoft
                  : colors.warningSoft;

            return (
              <GlassCard key={item.id} borderRadius={15} style={{ padding: 14 }}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 11 }}>
                  <View
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 11,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: toneSoft,
                    }}
                  >
                    <Bell size={16} color={tone} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        gap: 10,
                      }}
                    >
                      <AppText weight="semiBold" size={13} style={{ flex: 1 }}>
                        {item.title}
                      </AppText>
                      <AppText size={9.5} color={colors.textMuted}>
                        {item.time}
                      </AppText>
                    </View>
                    <AppText
                      size={11.5}
                      color={colors.textSecondary}
                      style={{ marginTop: 3, lineHeight: 17 }}
                    >
                      {item.body}
                    </AppText>
                  </View>
                </View>
              </GlassCard>
            );
          })}

          <AppButton
            title="Mark all as read"
            variant="secondary"
            size="sm"
            onPress={() => {
              setReadNotifications(true);
              setNotificationsOpen(false);
              showToast('All notifications marked as read');
            }}
            style={{ marginTop: 4 }}
          />
        </View>
      </SheetModal>

      <ServiceFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        serviceName={activeService}
      />
    </Screen>
  );
}
