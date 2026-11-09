import React, { useState } from 'react';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  CreditCard,
  Layers,
  Printer,
  ShieldCheck,
  Wifi,
  Zap,
} from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeContext';
import Screen from '../../components/Screen';
import PageHeader from '../../components/PageHeader';
import AppText from '../../components/ui/AppText';
import AppButton from '../../components/ui/AppButton';
import GlassCard from '../../components/ui/GlassCard';
import ServiceFormModal from '../../components/ServiceFormModal';

const FEATURES = [
  { icon: Wifi, title: 'All networks', desc: 'MTN, Airtel, Glo & 9Mobile', color: '#3EAEFF' },
  { icon: CreditCard, title: 'Any denomination', desc: '₦100 up to ₦5,000', color: '#10B981' },
  { icon: Layers, title: 'Bulk quantities', desc: 'Print up to 50 cards at once', color: '#8B5CF6' },
  { icon: Zap, title: 'Instant PINs', desc: 'Generated in seconds', color: '#F59E0B' },
];

const STEPS = [
  { title: 'Pick a network', desc: 'Choose the operator and card value.' },
  { title: 'Set the quantity', desc: 'Buy one card or a bulk batch of 50.' },
  { title: 'Print or share', desc: 'Copy every PIN or print the batch instantly.' },
];

export default function PrintScreen() {
  const { colors, isDark } = useTheme();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <Screen contentContainerStyle={{ gap: 20 }}>
      <PageHeader
        eyebrow="Recharge cards"
        title="Print Cards"
        subtitle="Generate physical recharge card PINs for every network."
        right={
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 15,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: colors.roseSoft,
              borderWidth: 1,
              borderColor: 'rgba(244,63,94,0.2)',
            }}
          >
            <Printer size={20} color={colors.rose} />
          </View>
        }
      />

      <LinearGradient
        colors={
          isDark
            ? ['rgba(244,63,94,0.22)', 'rgba(244,63,94,0.04)']
            : ['rgba(244,63,94,0.14)', 'rgba(244,63,94,0.02)']
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: 24,
          borderWidth: 1,
          borderColor: 'rgba(244,63,94,0.25)',
          paddingHorizontal: 22,
          paddingTop: 26,
          paddingBottom: 22,
          alignItems: 'center',
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            position: 'absolute',
            width: 180,
            height: 180,
            borderRadius: 90,
            backgroundColor: 'rgba(244,63,94,0.13)',
            top: -100,
            right: -50,
          }}
        />

        <View
          style={{
            width: 74,
            height: 74,
            borderRadius: 22,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(244,63,94,0.16)',
            borderWidth: 1,
            borderColor: 'rgba(244,63,94,0.32)',
            shadowColor: colors.rose,
            shadowOpacity: 0.28,
            shadowRadius: 20,
            shadowOffset: { width: 0, height: 8 },
            elevation: 5,
            marginBottom: 16,
          }}
        >
          <Printer size={34} color={colors.rose} />
        </View>

        <AppText weight="extraBold" size={21} align="center" style={{ letterSpacing: -0.4 }}>
          Buy &amp; print cards
        </AppText>
        <AppText
          size={12.5}
          color={colors.textSecondary}
          align="center"
          style={{ marginTop: 7, lineHeight: 19, maxWidth: 300 }}
        >
          Choose a network, denomination and quantity — then copy or print all PINs at once.
        </AppText>

        <AppButton
          title="Get Started"
          variant="rose"
          onPress={() => setModalOpen(true)}
          icon={<Printer size={18} color="#FFFFFF" />}
          style={{ width: '100%', marginTop: 20 }}
        />

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            marginTop: 12,
          }}
        >
          <ShieldCheck size={12} color={colors.textMuted} />
          <AppText size={10} color={colors.textMuted}>
            PINs are encrypted and delivered instantly
          </AppText>
        </View>
      </LinearGradient>

      <View>
        <AppText weight="semiBold" size={16} style={{ marginBottom: 11 }}>
          What you get
        </AppText>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 11 }}>
          {FEATURES.map((feature) => (
            <GlassCard
              key={feature.title}
              borderRadius={16}
              style={{ width: '48%', padding: 14, gap: 8 }}
            >
              <View
                style={{
                  width: 35,
                  height: 35,
                  borderRadius: 11,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: `${feature.color}18`,
                }}
              >
                <feature.icon size={17} color={feature.color} />
              </View>
              <AppText weight="semiBold" size={12.5}>
                {feature.title}
              </AppText>
              <AppText size={10.5} color={colors.textSecondary} style={{ lineHeight: 15 }}>
                {feature.desc}
              </AppText>
            </GlassCard>
          ))}
        </View>
      </View>

      <View>
        <AppText weight="semiBold" size={16} style={{ marginBottom: 11 }}>
          How it works
        </AppText>
        <GlassCard style={{ padding: 16 }}>
          {STEPS.map((step, index) => (
            <View
              key={step.title}
              style={{
                flexDirection: 'row',
                gap: 12,
                paddingVertical: 10,
                borderBottomWidth: index === STEPS.length - 1 ? 0 : 1,
                borderBottomColor: colors.border,
              }}
            >
              <View
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 9,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: colors.roseSoft,
                  borderWidth: 1,
                  borderColor: 'rgba(244,63,94,0.2)',
                }}
              >
                <AppText weight="bold" size={12} color={colors.rose}>
                  {index + 1}
                </AppText>
              </View>
              <View style={{ flex: 1 }}>
                <AppText weight="semiBold" size={12.5}>
                  {step.title}
                </AppText>
                <AppText size={11} color={colors.textSecondary} style={{ marginTop: 2, lineHeight: 16 }}>
                  {step.desc}
                </AppText>
              </View>
            </View>
          ))}
        </GlassCard>
      </View>

      <ServiceFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        serviceName="Print Recharge Card"
      />
    </Screen>
  );
}
