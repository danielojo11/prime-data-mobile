import React, { useState } from 'react';
import { Platform, StyleSheet, TextInput, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import * as Print from 'expo-print';
import * as Haptics from 'expo-haptics';
import {
  Check,
  Copy,
  CreditCard,
  Fingerprint,
  Info,
  Printer,
  ScanFace,
  ShieldCheck,
  Smartphone,
  Wallet,
} from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useTheme } from '../theme/ThemeContext';
import { fonts } from '../theme/typography';
import {
  CABLE_PACKAGES,
  CABLE_PROVIDERS,
  CARD_DENOMINATIONS,
  DATA_PLANS,
  ELECTRICITY_PROVIDERS,
  EXAM_TYPES,
  NETWORKS,
} from '../data/mockData';
import { formatNaira, makeId } from '../utils/format';
import AppButton from './ui/AppButton';
import AppInput from './ui/AppInput';
import AppText from './ui/AppText';
import GlassCard from './ui/GlassCard';
import PressableScale from './ui/PressableScale';
import SelectField from './ui/SelectField';
import SheetModal from './ui/SheetModal';
import BiometricPrompt from './BiometricPrompt';

const EMPTY_STATE = {
  step: 1,
  phone: '',
  amount: '',
  network: '',
  plan: '',
  iuc: '',
  meterType: '',
  denomination: '',
  quantity: 1,
  examYear: '',
  pin: '',
  recipient: '',
  note: '',
  pins: [],
  refId: '',
};

function SummaryRow({ label, value, accent, last = false }) {
  const { colors } = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 6,
        borderBottomWidth: last ? 0 : StyleSheet.hairlineWidth,
        borderBottomColor: colors.border,
      }}
    >
      <AppText size={12.5} color={colors.textSecondary}>
        {label}
      </AppText>
      <AppText weight="semiBold" size={12.5} color={accent || colors.text} style={{ maxWidth: '65%' }} numberOfLines={1}>
        {value}
      </AppText>
    </View>
  );
}

export default function ServiceFormModal({ isOpen, onClose, serviceName }) {
  const { user, addTransaction } = useAuth();
  const { showToast, showError } = useToast();
  const { colors } = useTheme();

  const [state, setState] = useState(EMPTY_STATE);
  const [loading, setLoading] = useState(false);
  const [biometricOpen, setBiometricOpen] = useState(false);

  const update = (patch) => setState((current) => ({ ...current, ...patch }));

  const reset = () => {
    setState(EMPTY_STATE);
    setLoading(false);
    setBiometricOpen(false);
  };

  const close = () => {
    onClose?.();
    setTimeout(reset, 320);
  };

  const isData = ['Buy Data', 'Data Pins', 'SME Data', 'Corporate Data'].includes(serviceName);
  const isAirtime = ['Buy Airtime', 'Airtime to Cash', 'Airtime Transfer'].includes(serviceName);
  const isWallet = serviceName === 'Fund Wallet';
  const isTransfer = serviceName === 'Transfer Funds' || serviceName === 'Transfer to User';
  const isElectricity = serviceName === 'Electricity';
  const isExam = serviceName === 'Exam Pins';
  const isCableTV = serviceName === 'Cable TV';
  const isPrintCard = serviceName === 'Print Recharge Card';

  const selectedPlan = isData
    ? DATA_PLANS[state.network]?.find((item) => item.label === state.plan)
    : null;
  const selectedCable = isCableTV
    ? CABLE_PACKAGES[state.network]?.find((item) => item.label === state.plan)
    : null;
  const selectedExam = isExam ? EXAM_TYPES.find((item) => item.value === state.network) : null;
  const cardTotal = Number(state.denomination || 0) * Number(state.quantity || 0);

  const payableAmount = isPrintCard
    ? String(cardTotal)
    : isData
      ? selectedPlan?.price || ''
      : isCableTV
        ? selectedCable?.price || ''
        : isExam
          ? selectedExam?.price || ''
          : state.amount;

  const receiverLabel = isCableTV
    ? `IUC ${state.iuc || '—'}`
    : isPrintCard
      ? `${state.quantity} recharge card${Number(state.quantity) > 1 ? 's' : ''}`
      : isTransfer
        ? state.recipient || '—'
        : state.phone || '—';

  const description = isData
    ? `${state.network} ${state.plan}`
    : isCableTV
      ? `${state.network} ${state.plan}`
      : isElectricity
        ? `${state.network} ${state.meterType}`
        : isExam
          ? `${state.network} ${selectedExam?.label || ''}`
          : isPrintCard
            ? `${state.quantity} × ${formatNaira(state.denomination)} ${state.network} recharge cards`
            : isTransfer
              ? `Wallet transfer to ${state.recipient}`
              : isAirtime
                ? `${state.network} airtime`
                : serviceName;

  const stepSubtitle =
    state.step === 1
      ? 'Step 1 of 2 · Fill in the details'
      : state.step === 2
        ? 'Step 2 of 2 · Confirm payment'
        : 'Payment complete';

  const handleCopy = async (text) => {
    await Clipboard.setStringAsync(String(text));
    showToast('Account number copied');
  };

  const validateDetails = () => {
    if (isData) {
      if (!state.network) return 'Select a network provider';
      if (!state.plan) return 'Select a data plan';
      if (state.phone.replace(/\D/g, '').length < 10) return 'Enter a valid phone number';
      return null;
    }
    if (isAirtime) {
      if (!state.network) return 'Select a network provider';
      if (state.phone.replace(/\D/g, '').length < 10) return 'Enter a valid phone number';
      if (!state.amount || Number(state.amount) < 50) return 'Enter an amount of at least ₦50';
      return null;
    }
    if (isElectricity) {
      if (!state.network) return 'Select an electricity provider';
      if (!state.meterType) return 'Select a meter type';
      if (state.phone.replace(/\D/g, '').length < 6) return 'Enter a valid meter number';
      if (!state.amount || Number(state.amount) < 100) return 'Enter an amount of at least ₦100';
      return null;
    }
    if (isCableTV) {
      if (!state.network) return 'Select a TV provider';
      if (!state.plan) return 'Select a package';
      if (state.iuc.replace(/\D/g, '').length < 6) return 'Enter a valid IUC / smart card number';
      return null;
    }
    if (isExam) {
      if (!state.network) return 'Select an exam type';
      if (!state.phone.trim()) return 'Enter your exam number';
      return null;
    }
    if (isPrintCard) {
      if (!state.network) return 'Select a network';
      if (!state.denomination) return 'Select a denomination';
      if (!state.quantity) return 'Select a quantity';
      return null;
    }
    if (isTransfer) {
      if (!state.recipient.trim()) return 'Enter a recipient email or phone number';
      if (!state.amount || Number(state.amount) < 100) return 'Enter an amount of at least ₦100';
      return null;
    }
    if (!state.phone.trim()) return 'Enter the required account identifier';
    if (!state.amount || Number(state.amount) < 50) return 'Enter an amount of at least ₦50';
    return null;
  };

  const goToPin = () => {
    const error = validateDetails();
    if (error) {
      showError(error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
      return;
    }
    update({ step: 2, pin: '' });
  };

  const processPayment = () => {
    setLoading(true);
    setTimeout(async () => {
      const finalId = makeId();
      let generatedPins = [];

      if (isPrintCard) {
        generatedPins = Array.from({ length: Number(state.quantity) }, () => ({
          pin: Array.from({ length: 4 }, () => Math.floor(1000 + Math.random() * 9000)).join('-'),
          serial: `SN${Math.floor(100000000 + Math.random() * 900000000)}`,
        }));
      }

      const transaction = {
        id: finalId,
        userEmail: user?.email || 'guest@primedata.com',
        service: isTransfer ? 'Wallet Transfer' : serviceName,
        type: isTransfer ? 'Wallet Transfer' : serviceName,
        desc: description,
        amount: Number(payableAmount),
        network: state.network,
        phone: isTransfer ? state.recipient : state.phone,
        status: 'Successful',
        date: new Date().toISOString(),
        isCredit: false,
      };

      try {
        await addTransaction(transaction);
        setState((current) => ({
          ...current,
          pins: generatedPins,
          refId: finalId,
          step: 3,
        }));
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      } catch {
        showError('Something went wrong. Please try again.');
      } finally {
        setLoading(false);
      }
    }, 1300);
  };

  const confirmPayment = () => {
    const validPin = user?.transferPin || '1234';
    if (state.pin !== validPin) {
      showError('Invalid transaction PIN');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
      return;
    }
    processPayment();
  };

  const copyAllPins = async () => {
    const text = state.pins.map((item) => `${item.serial}  ${item.pin}`).join('\n');
    await Clipboard.setStringAsync(text);
    showToast('All recharge PINs copied');
  };

  const printCards = async () => {
    const rows = state.pins
      .map(
        (item) =>
          `<tr><td style="padding:8px;border:1px solid #ddd;font-family:monospace">${item.serial}</td><td style="padding:8px;border:1px solid #ddd;font-family:monospace;font-weight:bold">${item.pin}</td></tr>`
      )
      .join('');

    try {
      await Print.printAsync({
        html: `
          <html>
            <body style="font-family: Arial, sans-serif; padding: 28px; color: #111;">
              <h1 style="margin-bottom:4px">PrimeData VTU</h1>
              <p style="margin-top:0;color:#666">${state.quantity} × ${formatNaira(state.denomination)} ${state.network} recharge cards</p>
              <table style="border-collapse:collapse;width:100%;margin-top:20px">
                <thead><tr><th style="text-align:left;padding:8px;border:1px solid #ddd">Serial</th><th style="text-align:left;padding:8px;border:1px solid #ddd">PIN</th></tr></thead>
                <tbody>${rows}</tbody>
              </table>
              <p style="margin-top:24px;font-size:12px;color:#888">Generated by PrimeData VTU</p>
            </body>
          </html>`,
      });
    } catch {
      showError('Printing is not available on this device');
    }
  };

  const renderNetworkSelector = () => (
    <View>
      <AppText
        weight="medium"
        size={12}
        color={colors.textSecondary}
        style={{ marginBottom: 8 }}
      >
        Network Provider
      </AppText>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {NETWORKS.map((network) => {
          const active = state.network === network.name;
          const dimmed = Boolean(state.network) && !active;
          return (
            <PressableScale
              key={network.name}
              onPress={() => update({ network: network.name, plan: '', amount: '' })}
              style={{
                flex: 1,
                height: 46,
                borderRadius: 12,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: network.color,
                borderWidth: 1,
                borderColor: network.color,
                opacity: active ? 1 : dimmed ? 0.35 : 0.88,
                transform: [{ scale: active ? 1.03 : 1 }],
              }}
            >
              <AppText weight="bold" size={11.5} color="#FFFFFF">
                {network.name}
              </AppText>
            </PressableScale>
          );
        })}
      </View>
    </View>
  );

  const renderSummary = (tint = 'green') => {
    const tintMap = {
      green: [colors.successSoft, 'rgba(16,185,129,0.24)'],
      purple: [colors.purpleSoft, 'rgba(139,92,246,0.22)'],
      rose: [colors.roseSoft, 'rgba(244,63,94,0.22)'],
      blue: [colors.blueSoft, 'rgba(62,174,255,0.22)'],
    };
    const [background, border] = tintMap[tint] || tintMap.green;

    return (
      <GlassCard
        borderRadius={14}
        style={{ paddingHorizontal: 14, paddingVertical: 9, backgroundColor: background, borderColor: border }}
      >
        <SummaryRow
          label="Amount"
          value={formatNaira(payableAmount)}
          accent={colors.green}
          last
        />
        {state.network ? <SummaryRow label="Provider" value={state.network} /> : null}
        {isData || isCableTV ? <SummaryRow label="Plan" value={state.plan} /> : null}
        {isElectricity ? <SummaryRow label="Meter type" value={state.meterType} /> : null}
        {isPrintCard ? (
          <SummaryRow label="Quantity" value={`${state.quantity} card${Number(state.quantity) > 1 ? 's' : ''}`} />
        ) : null}
      </GlassCard>
    );
  };

  const renderWallet = () => (
    <View style={{ gap: 16 }}>
      <AppText size={13.5} color={colors.textSecondary} style={{ lineHeight: 20 }}>
        Transfer to the account below to fund your wallet instantly. Your balance updates
        automatically after payment.
      </AppText>

      <GlassCard
        borderRadius={18}
        style={{
          padding: 18,
          backgroundColor: colors.successSoft,
          borderColor: 'rgba(16,185,129,0.24)',
        }}
      >
        <AppText
          size={9.5}
          weight="semiBold"
          color={colors.textSecondary}
          style={{ letterSpacing: 0.8, textTransform: 'uppercase' }}
        >
          Bank Name
        </AppText>
        <AppText weight="semiBold" size={15} style={{ marginTop: 3 }}>
          OPay
        </AppText>

        <View style={{ height: 16 }} />

        <AppText
          size={9.5}
          weight="semiBold"
          color={colors.textSecondary}
          style={{ letterSpacing: 0.8, textTransform: 'uppercase' }}
        >
          Account Number
        </AppText>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 2,
          }}
        >
          <AppText weight="extraBold" size={26} color={colors.green} style={{ letterSpacing: 1 }}>
            9131278572
          </AppText>
          <PressableScale
            onPress={() => handleCopy('9131278572')}
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: colors.inputBg,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Copy size={17} color={colors.text} />
          </PressableScale>
        </View>

        <View style={{ height: 16 }} />

        <AppText
          size={9.5}
          weight="semiBold"
          color={colors.textSecondary}
          style={{ letterSpacing: 0.8, textTransform: 'uppercase' }}
        >
          Account Name
        </AppText>
        <AppText weight="semiBold" size={14} style={{ marginTop: 2 }}>
          PrimeData VTU
        </AppText>

        <View style={{ height: 14 }} />

        <AppText
          size={9.5}
          weight="semiBold"
          color={colors.textSecondary}
          style={{ letterSpacing: 0.8, textTransform: 'uppercase' }}
        >
          Email
        </AppText>
        <AppText weight="semiBold" size={14} style={{ marginTop: 2 }}>
          support@primedata.com
        </AppText>
      </GlassCard>

      <View
        style={{
          flexDirection: 'row',
          gap: 10,
          backgroundColor: colors.warningSoft,
          borderWidth: 1,
          borderColor: 'rgba(245,158,11,0.2)',
          borderRadius: 12,
          padding: 13,
        }}
      >
        <Info size={17} color={colors.amber} style={{ marginTop: 1 }} />
        <AppText size={11.5} color={colors.amber} style={{ flex: 1, lineHeight: 17 }}>
          A stamp duty charge of ₦50 applies to transfers above ₦10,000.
        </AppText>
      </View>

      <AppButton title="Done" variant="secondary" onPress={close} />
    </View>
  );

  const renderPrintForm = () => (
    <View style={{ gap: 16 }}>
      {renderNetworkSelector()}

      {state.network ? (
        <View>
          <AppText
            weight="medium"
            size={12}
            color={colors.textSecondary}
            style={{ marginBottom: 8 }}
          >
            Select Denomination
          </AppText>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {CARD_DENOMINATIONS.map((denomination) => {
              const active = state.denomination === String(denomination);
              return (
                <PressableScale
                  key={denomination}
                  onPress={() => update({ denomination: String(denomination) })}
                  style={{
                    width: '31.5%',
                    height: 46,
                    borderRadius: 12,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: active ? colors.roseSoft : colors.inputBg,
                    borderWidth: 1.5,
                    borderColor: active ? colors.rose : colors.border,
                  }}
                >
                  <AppText
                    weight="bold"
                    size={13}
                    color={active ? colors.rose : colors.textSecondary}
                  >
                    {formatNaira(denomination)}
                  </AppText>
                </PressableScale>
              );
            })}
          </View>
        </View>
      ) : null}

      {state.network && state.denomination ? (
        <>
          <View>
            <AppText
              weight="medium"
              size={12}
              color={colors.textSecondary}
              style={{ marginBottom: 8 }}
            >
              Quantity <AppText size={11} color={colors.textMuted}>(1 – 50)</AppText>
            </AppText>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <PressableScale
                onPress={() =>
                  update({ quantity: Math.max(1, Number(state.quantity) - 1) })
                }
                style={styles.stepper}
              >
                <AppText weight="bold" size={20}>
                  −
                </AppText>
              </PressableScale>
              <View
                style={{
                  flex: 1,
                  height: 50,
                  borderRadius: 12,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: colors.inputBg,
                  borderWidth: 1,
                  borderColor: colors.inputBorder,
                }}
              >
                <AppText weight="bold" size={18}>
                  {state.quantity}
                </AppText>
              </View>
              <PressableScale
                onPress={() =>
                  update({ quantity: Math.min(50, Number(state.quantity) + 1) })
                }
                style={styles.stepper}
              >
                <AppText weight="bold" size={20}>
                  +
                </AppText>
              </PressableScale>
            </View>
          </View>

          <GlassCard
            borderRadius={14}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 9,
              backgroundColor: colors.roseSoft,
              borderColor: 'rgba(244,63,94,0.22)',
            }}
          >
            <SummaryRow label="Network" value={state.network} />
            <SummaryRow
              label="Denomination"
              value={`${formatNaira(state.denomination)} each`}
            />
            <SummaryRow label="Quantity" value={`${state.quantity} cards`} />
            <SummaryRow
              label="Total Cost"
              value={formatNaira(cardTotal)}
              accent={colors.rose}
              last
            />
          </GlassCard>

          <AppButton
            title={`Proceed to Pay ${formatNaira(cardTotal)}`}
            variant="rose"
            icon={<Printer size={18} color="#FFFFFF" />}
            onPress={goToPin}
          />
        </>
      ) : null}
    </View>
  );

  const renderServiceForm = () => (
    <View style={{ gap: 16 }}>
      {isData || isAirtime ? renderNetworkSelector() : null}

      {isCableTV ? (
        <View>
          <AppText
            weight="medium"
            size={12}
            color={colors.textSecondary}
            style={{ marginBottom: 8 }}
          >
            Select Provider
          </AppText>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {CABLE_PROVIDERS.map((provider) => {
              const active = state.network === provider.name;
              return (
                <PressableScale
                  key={provider.name}
                  onPress={() => update({ network: provider.name, plan: '', amount: '' })}
                  style={{
                    flex: 1,
                    height: 48,
                    borderRadius: 12,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: active ? provider.color : colors.inputBg,
                    borderWidth: 1.5,
                    borderColor: active ? provider.color : colors.border,
                  }}
                >
                  <AppText
                    weight="bold"
                    size={12}
                    color={active ? '#FFFFFF' : colors.textSecondary}
                  >
                    {provider.name}
                  </AppText>
                </PressableScale>
              );
            })}
          </View>
        </View>
      ) : null}

      {isElectricity ? (
        <SelectField
          label="Electricity Provider"
          placeholder="Select provider"
          value={
            ELECTRICITY_PROVIDERS.find((provider) => provider.value === state.network)?.label ||
            ''
          }
          options={ELECTRICITY_PROVIDERS}
          onSelect={(option) => update({ network: option.value, meterType: '', amount: '' })}
        />
      ) : null}

      {isElectricity && state.network ? (
        <SelectField
          label="Meter Type"
          placeholder="Select meter type"
          value={state.meterType}
          options={[
            { label: 'Prepaid', value: 'Prepaid' },
            { label: 'Postpaid', value: 'Postpaid' },
          ]}
          onSelect={(option) => update({ meterType: option.value })}
        />
      ) : null}

      {isData && state.network ? (
        <SelectField
          label="Data Plan"
          placeholder="Select a data plan"
          value={state.plan}
          options={(DATA_PLANS[state.network] || []).map((plan) => ({
            label: plan.label,
            value: plan.label,
            meta: formatNaira(plan.price),
          }))}
          onSelect={(option) => update({ plan: option.label, amount: option.meta })}
        />
      ) : null}

      {isCableTV && state.network ? (
        <SelectField
          label="Select Package"
          placeholder="Select a package"
          value={state.plan ? `${state.plan}` : ''}
          options={(CABLE_PACKAGES[state.network] || []).map((item) => ({
            label: `${item.label} · ${item.duration}`,
            value: item.label,
            meta: formatNaira(item.price),
          }))}
          onSelect={(option) => update({ plan: option.value })}
        />
      ) : null}

      {isExam ? (
        <SelectField
          label="Exam Type"
          placeholder="Select exam type"
          value={selectedExam ? `${selectedExam.label} · ${formatNaira(selectedExam.price)}` : ''}
          options={EXAM_TYPES.map((item) => ({
            label: item.label,
            value: item.value,
            meta: formatNaira(item.price),
          }))}
          onSelect={(option) => update({ network: option.value })}
        />
      ) : null}

      {isTransfer ? (
        <>
          <AppInput
            label="Recipient"
            placeholder="Email address or phone number"
            value={state.recipient}
            onChangeText={(value) => update({ recipient: value })}
            icon={<Smartphone size={17} color={colors.textSecondary} />}
            autoCapitalize="none"
          />
          <AppInput
            label="Amount (₦)"
            placeholder="Minimum ₦100"
            value={state.amount}
            onChangeText={(value) => update({ amount: value.replace(/[^0-9]/g, '') })}
            icon={<Wallet size={17} color={colors.textSecondary} />}
            keyboardType="number-pad"
          />
          <AppInput
            label="Note (optional)"
            placeholder="What is this transfer for?"
            value={state.note}
            onChangeText={(value) => update({ note: value })}
            icon={<CreditCard size={17} color={colors.textSecondary} />}
          />
        </>
      ) : null}

      {isPrintCard ? null : isExam ? (
        <>
          {state.network ? (
            <>
              <AppInput
                label="Exam Number"
                placeholder="e.g. 12345678AB"
                value={state.phone}
                onChangeText={(value) => update({ phone: value.toUpperCase() })}
                autoCapitalize="characters"
              />
              <AppInput
                label="Exam Year (optional)"
                placeholder="e.g. 2026"
                value={state.examYear}
                onChangeText={(value) => update({ examYear: value.replace(/[^0-9]/g, '') })}
                keyboardType="number-pad"
              />
              <View style={styles.feeRow}>
                <AppText size={13} color={colors.textSecondary}>
                  Processing fee
                </AppText>
                <AppText weight="semiBold" size={14} color={colors.green}>
                  {formatNaira(selectedExam?.price)}
                </AppText>
              </View>
            </>
          ) : null}
        </>
      ) : isCableTV ? (
        state.network && state.plan ? (
          <>
            <AppInput
              label="IUC / Smart Card Number"
              placeholder="Enter your IUC number"
              value={state.iuc}
              onChangeText={(value) => update({ iuc: value.replace(/[^0-9]/g, '') })}
              keyboardType="number-pad"
              maxLength={12}
            />
            <AppText size={11} color={colors.textMuted}>
              Enter the number on your decoder or smart card
            </AppText>
            {renderSummary('purple')}
            <AppButton title="Proceed" onPress={goToPin} />
          </>
        ) : null
      ) : isTransfer ? (
        <>
          {Number(state.amount) > 0 ? renderSummary('blue') : null}
          <AppButton title="Proceed" onPress={goToPin} />
        </>
      ) : isPrintCard ? null : isData ? (
        state.network && state.plan ? (
          <>
            <AppInput
              label="Phone Number"
              placeholder="08012345678"
              value={state.phone}
              onChangeText={(value) => update({ phone: value.replace(/[^0-9]/g, '') })}
              keyboardType="phone-pad"
              maxLength={11}
              icon={<Smartphone size={17} color={colors.textSecondary} />}
            />
            {renderSummary()}
            <AppButton title="Proceed" onPress={goToPin} />
          </>
        ) : null
      ) : isAirtime ? (
        state.network ? (
          <>
            <AppInput
              label="Phone Number"
              placeholder="08012345678"
              value={state.phone}
              onChangeText={(value) => update({ phone: value.replace(/[^0-9]/g, '') })}
              keyboardType="phone-pad"
              maxLength={11}
              icon={<Smartphone size={17} color={colors.textSecondary} />}
            />
            <AppInput
              label="Amount (₦)"
              placeholder="Minimum ₦50"
              value={state.amount}
              onChangeText={(value) => update({ amount: value.replace(/[^0-9]/g, '') })}
              keyboardType="number-pad"
              icon={<Wallet size={17} color={colors.textSecondary} />}
            />
            {Number(state.amount) > 0 ? renderSummary() : null}
            <AppButton title="Proceed" onPress={goToPin} />
          </>
        ) : null
      ) : isElectricity ? (
        state.network && state.meterType ? (
          <>
            <AppInput
              label="Meter Number"
              placeholder="Enter your meter number"
              value={state.phone}
              onChangeText={(value) => update({ phone: value.replace(/[^0-9]/g, '') })}
              keyboardType="number-pad"
            />
            <AppInput
              label="Amount (₦)"
              placeholder="Minimum ₦100"
              value={state.amount}
              onChangeText={(value) => update({ amount: value.replace(/[^0-9]/g, '') })}
              keyboardType="number-pad"
            />
            {Number(state.amount) > 0 ? renderSummary() : null}
            <AppButton title="Proceed" onPress={goToPin} />
          </>
        ) : null
      ) : (
        <>
          <AppInput
            label="Account / Meter Identifier"
            placeholder="Enter details"
            value={state.phone}
            onChangeText={(value) => update({ phone: value })}
          />
          <AppInput
            label="Amount (₦)"
            placeholder="Minimum ₦50"
            value={state.amount}
            onChangeText={(value) => update({ amount: value.replace(/[^0-9]/g, '') })}
            keyboardType="number-pad"
          />
          {Number(state.amount) > 0 ? renderSummary() : null}
          <AppButton title="Proceed" onPress={goToPin} />
        </>
      )}
    </View>
  );

  const renderPinStep = () => (
    <View style={{ gap: 16, alignItems: 'center' }}>
      <View
        style={{
          width: 58,
          height: 58,
          borderRadius: 29,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.successSoft,
          borderWidth: 1,
          borderColor: 'rgba(16,185,129,0.22)',
        }}
      >
        <ShieldCheck size={27} color={colors.green} />
      </View>

      <View style={{ alignItems: 'center' }}>
        <AppText size={13.5} color={colors.textSecondary} align="center">
          You are about to process
        </AppText>
        <AppText weight="bold" size={16} align="center" style={{ marginTop: 3 }}>
          {isCableTV ? `${state.network} ${state.plan}` : isData ? 'Data bundle' : serviceName}
        </AppText>
        <AppText size={13} color={colors.textSecondary} align="center" style={{ marginTop: 3 }}>
          for {receiverLabel} at{' '}
          <AppText weight="semiBold" size={13} color={colors.green}>
            {formatNaira(payableAmount)}
          </AppText>
        </AppText>
      </View>

      {user?.biometricEnabled ? (
        <View style={{ width: '100%', gap: 12 }}>
          <AppButton
            title={`Pay with ${user.biometricType === 'face' ? 'Face ID' : 'Touch ID'}`}
            variant="secondary"
            onPress={() => setBiometricOpen(true)}
            icon={
              user.biometricType === 'face' ? (
                <ScanFace size={19} color={colors.green} />
              ) : (
                <Fingerprint size={19} color={colors.green} />
              )
            }
          />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
            <AppText size={10.5} color={colors.textMuted} style={{ letterSpacing: 0.6 }}>
              OR ENTER PIN
            </AppText>
            <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
          </View>
        </View>
      ) : null}

      <TextInput
        value={state.pin}
        onChangeText={(value) => update({ pin: value.replace(/[^0-9]/g, '') })}
        placeholder="••••"
        placeholderTextColor={colors.textMuted}
        secureTextEntry
        maxLength={4}
        keyboardType="number-pad"
        selectionColor={colors.green}
        style={{
          width: 190,
          height: 62,
          borderRadius: 16,
          borderWidth: 2,
          borderColor: colors.green,
          backgroundColor: colors.inputBg,
          color: colors.text,
          textAlign: 'center',
          fontSize: 24,
          letterSpacing: 12,
          fontFamily: fonts.bold,
          marginTop: 4,
        }}
      />
      <AppText size={11.5} color={colors.textMuted} style={{ marginTop: -8 }}>
        Enter your 4-digit transaction PIN
      </AppText>

      <AppButton
        title="Confirm & Pay"
        onPress={confirmPayment}
        loading={loading}
        disabled={state.pin.length < 4}
        style={{ width: '100%' }}
      />
      <AppButton
        title="Back"
        variant="ghost"
        onPress={() => update({ step: 1, pin: '' })}
        style={{ width: '100%', height: 44 }}
      />
    </View>
  );

  const renderSuccess = () => (
    <View style={{ alignItems: 'center', gap: 18, paddingTop: 8 }}>
      <View
        style={{
          width: 72,
          height: 72,
          borderRadius: 36,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.successSoft,
          borderWidth: 2,
          borderColor: colors.green,
          shadowColor: colors.green,
          shadowOpacity: 0.25,
          shadowRadius: 18,
          elevation: 6,
        }}
      >
        <Check size={34} color={colors.green} />
      </View>

      <View style={{ alignItems: 'center' }}>
        <AppText weight="bold" size={21}>
          Transaction Successful
        </AppText>
        <AppText size={13} color={colors.textSecondary} align="center" style={{ marginTop: 5 }}>
          Your {serviceName.toLowerCase()} for {receiverLabel} was successful.
        </AppText>
      </View>

      <GlassCard style={{ width: '100%', padding: 15 }} borderRadius={15}>
        <SummaryRow label="Amount" value={formatNaira(payableAmount)} accent={colors.green} />
        {state.network ? <SummaryRow label="Network" value={state.network} /> : null}
        <SummaryRow label="Receiver" value={receiverLabel} />
        <SummaryRow label="Reference" value={state.refId} last />
      </GlassCard>

      <AppButton title="Done" variant="contrast" onPress={close} style={{ width: '100%' }} />
    </View>
  );

  const renderPrintSuccess = () => (
    <View style={{ gap: 16 }}>
      <View style={{ alignItems: 'center', gap: 8 }}>
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.successSoft,
            borderWidth: 2,
            borderColor: colors.green,
          }}
        >
          <Check size={30} color={colors.green} />
        </View>
        <AppText weight="bold" size={20}>
          Cards Generated!
        </AppText>
        <AppText size={12.5} color={colors.textSecondary} align="center">
          {state.quantity} × {formatNaira(state.denomination)} {state.network} recharge card
          {Number(state.quantity) > 1 ? 's' : ''}
        </AppText>
      </View>

      <View style={{ gap: 8 }}>
        {state.pins.map((item, index) => (
          <View
            key={`${item.serial}-${index}`}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingVertical: 11,
              paddingHorizontal: 13,
              borderRadius: 12,
              backgroundColor: colors.inputBg,
              borderWidth: 1,
              borderStyle: 'dashed',
              borderColor: colors.borderStrong,
            }}
          >
            <View>
              <AppText
                size={8.5}
                color={colors.textMuted}
                weight="semiBold"
                style={{ letterSpacing: 0.7, textTransform: 'uppercase' }}
              >
                Serial No.
              </AppText>
              <AppText size={10.5} color={colors.textSecondary} style={styles.mono}>
                {item.serial}
              </AppText>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <AppText
                size={8.5}
                color={colors.textMuted}
                weight="semiBold"
                style={{ letterSpacing: 0.7, textTransform: 'uppercase' }}
              >
                PIN
              </AppText>
              <AppText weight="extraBold" size={16} color={colors.green} style={styles.pinText}>
                {item.pin}
              </AppText>
            </View>
          </View>
        ))}
      </View>

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <AppButton
          title="Copy All"
          variant="secondary"
          size="sm"
          icon={<Copy size={16} color={colors.green} />}
          onPress={copyAllPins}
          style={{ flex: 1 }}
        />
        <AppButton
          title="Print"
          variant="rose"
          size="sm"
          icon={<Printer size={16} color="#FFFFFF" />}
          onPress={printCards}
          style={{ flex: 1 }}
        />
      </View>
      <AppButton title="Done" variant="contrast" onPress={close} />
    </View>
  );

  return (
    <>
      <SheetModal
        visible={isOpen}
        onClose={close}
        title={serviceName}
        subtitle={isWallet ? 'Instant bank transfer' : stepSubtitle}
        maxHeight="93%"
      >
        {isWallet
          ? renderWallet()
          : state.step === 1
            ? isPrintCard
              ? renderPrintForm()
              : renderServiceForm()
            : state.step === 2
              ? renderPinStep()
              : isPrintCard
                ? renderPrintSuccess()
                : renderSuccess()}
      </SheetModal>

      <BiometricPrompt
        isOpen={biometricOpen}
        onClose={() => setBiometricOpen(false)}
        onSuccess={() => {
          setBiometricOpen(false);
          processPayment();
        }}
        type={user?.biometricType || 'fingerprint'}
        userName={user?.name || 'User'}
      />
    </>
  );
}

const styles = StyleSheet.create({
  stepper: {
    width: 48,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(128,128,128,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(128,128,128,0.18)',
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  mono: {
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }),
  },
  pinText: {
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }),
    letterSpacing: 1.5,
  },
});
