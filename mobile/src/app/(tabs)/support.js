import React, { useState } from 'react';
import { Linking, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import {
  Activity,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  FileText,
  Headphones,
  MessageCircle,
  Phone,
  Search,
  Shield,
  UploadCloud,
  X,
} from 'lucide-react-native';
import { useToast } from '../../context/ToastContext';
import { useTheme } from '../../theme/ThemeContext';
import { FAQS } from '../../data/mockData';
import Screen from '../../components/Screen';
import PageHeader from '../../components/PageHeader';
import SectionHeader from '../../components/SectionHeader';
import AppText from '../../components/ui/AppText';
import AppButton from '../../components/ui/AppButton';
import AppInput from '../../components/ui/AppInput';
import GlassCard from '../../components/ui/GlassCard';
import PressableScale from '../../components/ui/PressableScale';
import SelectField from '../../components/ui/SelectField';

const TABS = [
  { id: 'hub', label: 'Help Hub' },
  { id: 'faqs', label: 'FAQs' },
  { id: 'tickets', label: 'My Tickets' },
];

const GUIDES = [
  {
    id: 'g1',
    icon: FileText,
    title: 'How to fund wallet',
    body: 'Open the Home tab, tap Fund Wallet on your wallet card, then transfer to the account shown. Your balance updates automatically after payment.',
  },
  {
    id: 'g2',
    icon: Activity,
    title: 'How to check transaction status',
    body: 'Open the Transactions tab and tap any transaction to see its status, reference and recipient details. Pull down to refresh the list.',
  },
  {
    id: 'g3',
    icon: AlertCircle,
    title: 'Network delays explained',
    body: 'Operators occasionally take up to 15 minutes to deliver a bundle. If the status stays pending after that, open a ticket and we will follow up.',
  },
];

const ISSUE_OPTIONS = [
  { label: 'Data Purchase Issue', value: 'data' },
  { label: 'Payment / Wallet Funding', value: 'payment' },
  { label: 'Account Settings / Login', value: 'account' },
  { label: 'Other Problem', value: 'other' },
];

const INITIAL_TICKETS = [
  { id: 'TKT-9021', title: 'Data not received on MTN', status: 'In Progress', date: 'Oct 24, 2026' },
  { id: 'TKT-8834', title: 'Wallet funding failed', status: 'Resolved', date: 'Oct 15, 2026' },
];

export default function SupportScreen() {
  const { showToast, showError, showInfo } = useToast();
  const { colors } = useTheme();

  const [activeTab, setActiveTab] = useState('hub');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFaq, setActiveFaq] = useState(null);
  const [activeGuide, setActiveGuide] = useState(null);
  const [feedback, setFeedback] = useState({});
  const [tickets, setTickets] = useState(INITIAL_TICKETS);
  const [ticketIssue, setTicketIssue] = useState('data');
  const [ticketDesc, setTicketDesc] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const filteredFaqs = FAQS.filter((faq) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    return faq.q.toLowerCase().includes(query) || faq.a.toLowerCase().includes(query);
  });

  const openWhatsApp = () => {
    Linking.openURL(
      'https://wa.me/2349131278572?text=Hi%20PrimeData%20Support%2C%20I%20need%20help.'
    ).catch(() => showError('Unable to open WhatsApp on this device'));
  };

  const callSupport = () => {
    Linking.openURL('tel:+2349131278572').catch(() =>
      showError('Unable to start a phone call on this device')
    );
  };

  const submitTicket = () => {
    if (ticketDesc.trim().length < 10) {
      showError('Please describe the issue in at least 10 characters');
      return;
    }

    const label =
      ISSUE_OPTIONS.find((option) => option.value === ticketIssue)?.label || 'Support request';
    const id = `TKT-${Math.floor(1000 + Math.random() * 9000)}`;

    setSubmitting(true);
    setTimeout(() => {
      setTickets((current) => [
        { id, title: label, status: 'Open', date: 'Just now' },
        ...current,
      ]);
      setTicketDesc('');
      setSubmitting(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      showToast(`Ticket ${id} submitted successfully`);
    }, 800);
  };

  return (
    <Screen contentContainerStyle={{ gap: 18 }} keyboardShouldPersistTaps="handled">
      <PageHeader
        eyebrow="We're here to help"
        title="Support Center"
        subtitle="Find answers, chat with us or open a ticket in seconds."
        right={
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 15,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: colors.blueSoft,
              borderWidth: 1,
              borderColor: 'rgba(62,174,255,0.2)',
            }}
          >
            <Headphones size={20} color={colors.blue} />
          </View>
        }
      />

      <View style={{ flexDirection: 'row', gap: 8 }}>
        {TABS.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <PressableScale
              key={tab.id}
              onPress={() => {
                setActiveTab(tab.id);
                Haptics.selectionAsync().catch(() => {});
              }}
              style={{
                flex: 1,
                paddingVertical: 10,
                borderRadius: 14,
                alignItems: 'center',
                backgroundColor: active ? colors.blueSoft : colors.inputBg,
                borderWidth: 1,
                borderColor: active ? 'rgba(62,174,255,0.35)' : colors.border,
              }}
            >
              <AppText
                weight="semiBold"
                size={11.5}
                color={active ? colors.blue : colors.textSecondary}
              >
                {tab.label}
              </AppText>
            </PressableScale>
          );
        })}
      </View>

      {activeTab === 'hub' ? (
        <View style={{ gap: 18 }}>
          <View>
            <SectionHeader title="Live support" />
            <View style={{ flexDirection: 'row', gap: 11 }}>
              <PressableScale onPress={openWhatsApp} style={{ flex: 1 }}>
                <GlassCard
                  borderRadius={18}
                  style={{
                    padding: 16,
                    alignItems: 'center',
                    backgroundColor: colors.successSoft,
                    borderColor: 'rgba(16,185,129,0.22)',
                  }}
                >
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 16,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'rgba(16,185,129,0.14)',
                      marginBottom: 10,
                    }}
                  >
                    <MessageCircle size={23} color={colors.green} />
                  </View>
                  <AppText weight="semiBold" size={13}>
                    WhatsApp
                  </AppText>
                  <AppText size={10} color={colors.textSecondary} style={{ marginTop: 3 }}>
                    Avg reply: 2 mins
                  </AppText>
                </GlassCard>
              </PressableScale>

              <PressableScale onPress={callSupport} style={{ flex: 1 }}>
                <GlassCard
                  borderRadius={18}
                  style={{
                    padding: 16,
                    alignItems: 'center',
                    backgroundColor: colors.blueSoft,
                    borderColor: 'rgba(62,174,255,0.22)',
                  }}
                >
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 16,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'rgba(62,174,255,0.14)',
                      marginBottom: 10,
                    }}
                  >
                    <Phone size={22} color={colors.blue} />
                  </View>
                  <AppText weight="semiBold" size={13}>
                    Phone call
                  </AppText>
                  <AppText size={10} color={colors.textSecondary} style={{ marginTop: 3 }}>
                    8am – 10pm daily
                  </AppText>
                </GlassCard>
              </PressableScale>
            </View>
          </View>

          <View>
            <SectionHeader title="Help guides" />
            <GlassCard style={{ paddingHorizontal: 15 }}>
              {GUIDES.map((guide, index) => {
                const expanded = activeGuide === guide.id;
                return (
                  <PressableScale
                    key={guide.id}
                    onPress={() => setActiveGuide(expanded ? null : guide.id)}
                    style={{
                      paddingVertical: 14,
                      borderBottomWidth: index === GUIDES.length - 1 ? 0 : 1,
                      borderBottomColor: colors.border,
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 11 }}>
                      <View
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: 11,
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: colors.inputBg,
                          borderWidth: 1,
                          borderColor: colors.border,
                        }}
                      >
                        <guide.icon size={16} color={colors.textSecondary} />
                      </View>
                      <AppText weight="medium" size={12.5} style={{ flex: 1 }}>
                        {guide.title}
                      </AppText>
                      <ChevronRight
                        size={17}
                        color={colors.textSecondary}
                        style={{ transform: [{ rotate: expanded ? '90deg' : '0deg' }] }}
                      />
                    </View>
                    {expanded ? (
                      <AppText
                        size={11.5}
                        color={colors.textSecondary}
                        style={{ marginTop: 10, lineHeight: 18, paddingLeft: 45 }}
                      >
                        {guide.body}
                      </AppText>
                    ) : null}
                  </PressableScale>
                );
              })}
            </GlassCard>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              gap: 11,
              padding: 14,
              borderRadius: 16,
              backgroundColor: colors.warningSoft,
              borderWidth: 1,
              borderColor: 'rgba(245,158,11,0.2)',
            }}
          >
            <Shield size={21} color={colors.amber} style={{ marginTop: 1 }} />
            <View style={{ flex: 1 }}>
              <AppText weight="semiBold" size={12.5} color={colors.amber}>
                Stay safe
              </AppText>
              <AppText size={11} color={colors.textSecondary} style={{ marginTop: 3, lineHeight: 16 }}>
                PrimeData will never ask for your password, OTP or transfer PIN. Keep them private.
              </AppText>
            </View>
          </View>
        </View>
      ) : null}

      {activeTab === 'faqs' ? (
        <View style={{ gap: 14 }}>
          <AppInput
            placeholder="Search your problem…"
            value={searchQuery}
            onChangeText={setSearchQuery}
            icon={<Search size={17} color={colors.textSecondary} />}
            right={
              searchQuery ? (
                <PressableScale onPress={() => setSearchQuery('')} hitSlop={10}>
                  <X size={16} color={colors.textSecondary} />
                </PressableScale>
              ) : null
            }
          />

          {filteredFaqs.length === 0 ? (
            <GlassCard style={{ padding: 24, alignItems: 'center' }}>
              <Search size={30} color={colors.textMuted} />
              <AppText weight="semiBold" size={14} style={{ marginTop: 12 }}>
                No answers found
              </AppText>
              <AppText size={11.5} color={colors.textSecondary} align="center" style={{ marginTop: 4 }}>
                Try a different keyword or open a support ticket.
              </AppText>
              <AppButton
                title="Open a ticket"
                variant="secondary"
                size="sm"
                onPress={() => setActiveTab('tickets')}
                style={{ marginTop: 14, paddingHorizontal: 20 }}
              />
            </GlassCard>
          ) : (
            <View style={{ gap: 10 }}>
              {filteredFaqs.map((faq) => {
                const expanded = activeFaq === faq.id;
                const vote = feedback[faq.id];
                return (
                  <PressableScale
                    key={faq.id}
                    onPress={() => setActiveFaq(expanded ? null : faq.id)}
                  >
                    <GlassCard borderRadius={17} style={{ padding: 15 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <View style={{ flex: 1 }}>
                          <AppText
                            weight="semiBold"
                            size={9.5}
                            color={colors.blue}
                            style={{ letterSpacing: 0.7, textTransform: 'uppercase' }}
                          >
                            {faq.category}
                          </AppText>
                          <AppText weight="semiBold" size={13} style={{ marginTop: 4 }}>
                            {faq.q}
                          </AppText>
                        </View>
                        <ChevronDown
                          size={18}
                          color={colors.textSecondary}
                          style={{ transform: [{ rotate: expanded ? '180deg' : '0deg' }] }}
                        />
                      </View>

                      {expanded ? (
                        <View
                          style={{
                            marginTop: 12,
                            paddingTop: 11,
                            borderTopWidth: 1,
                            borderTopColor: colors.border,
                          }}
                        >
                          <AppText size={11.5} color={colors.textSecondary} style={{ lineHeight: 18 }}>
                            {faq.a}
                          </AppText>

                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              gap: 8,
                              marginTop: 12,
                            }}
                          >
                            <AppText size={10.5} color={colors.textMuted} style={{ flex: 1 }}>
                              Was this helpful?
                            </AppText>
                            {['up', 'down'].map((option) => {
                              const active = vote === option;
                              return (
                                <PressableScale
                                  key={option}
                                  onPress={() => {
                                    setFeedback((current) => ({
                                      ...current,
                                      [faq.id]: option,
                                    }));
                                    showToast('Thanks for your feedback');
                                  }}
                                  style={{
                                    paddingHorizontal: 10,
                                    paddingVertical: 5,
                                    borderRadius: 8,
                                    backgroundColor: active ? colors.successSoft : colors.inputBg,
                                    borderWidth: 1,
                                    borderColor: active
                                      ? 'rgba(16,185,129,0.25)'
                                      : colors.border,
                                  }}
                                >
                                  <AppText size={12}>{option === 'up' ? '👍' : '👎'}</AppText>
                                </PressableScale>
                              );
                            })}
                          </View>
                        </View>
                      ) : null}
                    </GlassCard>
                  </PressableScale>
                );
              })}
            </View>
          )}
        </View>
      ) : null}

      {activeTab === 'tickets' ? (
        <View style={{ gap: 18 }}>
          <View>
            <SectionHeader title={`My tickets · ${tickets.length}`} />
            <View style={{ gap: 9 }}>
              {tickets.map((ticket) => {
                const resolved = ticket.status === 'Resolved';
                return (
                  <PressableScale
                    key={ticket.id}
                    onPress={() => showToast(`${ticket.id} · ${ticket.status}`, 'info')}
                  >
                    <GlassCard borderRadius={15} style={{ padding: 13 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 11 }}>
                        <View
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 11,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: resolved ? colors.successSoft : colors.warningSoft,
                          }}
                        >
                          {resolved ? (
                            <CheckCircle2 size={17} color={colors.green} />
                          ) : (
                            <Activity size={17} color={colors.amber} />
                          )}
                        </View>
                        <View style={{ flex: 1 }}>
                          <AppText weight="semiBold" size={12.5} numberOfLines={1}>
                            {ticket.title}
                          </AppText>
                          <AppText size={10.5} color={colors.textSecondary} style={{ marginTop: 2 }}>
                            {ticket.id} · {ticket.date}
                          </AppText>
                        </View>
                        <View
                          style={{
                            paddingHorizontal: 8,
                            paddingVertical: 4,
                            borderRadius: 7,
                            backgroundColor: resolved ? colors.successSoft : colors.warningSoft,
                          }}
                        >
                          <AppText
                            weight="semiBold"
                            size={9.5}
                            color={resolved ? colors.green : colors.amber}
                          >
                            {ticket.status}
                          </AppText>
                        </View>
                      </View>
                    </GlassCard>
                  </PressableScale>
                );
              })}
            </View>
          </View>

          <View>
            <SectionHeader title="Report an issue" />
            <GlassCard style={{ padding: 16, gap: 14 }}>
              <SelectField
                label="Issue category"
                placeholder="Select a category"
                value={ISSUE_OPTIONS.find((option) => option.value === ticketIssue)?.label}
                options={ISSUE_OPTIONS}
                onSelect={(option) => setTicketIssue(option.value)}
              />

              <AppInput
                label="Description"
                placeholder="Please describe the issue in detail…"
                value={ticketDesc}
                onChangeText={setTicketDesc}
                multiline
                numberOfLines={4}
              />

              <PressableScale
                onPress={() => showInfo('Screenshot attachment is coming soon')}
                style={{
                  borderWidth: 1.5,
                  borderStyle: 'dashed',
                  borderColor: colors.borderStrong,
                  borderRadius: 14,
                  paddingVertical: 18,
                  alignItems: 'center',
                  backgroundColor: colors.inputBg,
                }}
              >
                <UploadCloud size={22} color={colors.textSecondary} />
                <AppText size={11.5} color={colors.textSecondary} style={{ marginTop: 7 }}>
                  Upload a screenshot (optional)
                </AppText>
              </PressableScale>

              <AppButton
                title="Submit Ticket"
                onPress={submitTicket}
                loading={submitting}
                icon={<MessageCircle size={17} color="#FFFFFF" />}
              />
            </GlassCard>
          </View>
        </View>
      ) : null}
    </Screen>
  );
}
