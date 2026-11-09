import React, { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { useFocusEffect } from 'expo-router';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Copy,
  Printer,
  Search,
  Share2,
  X,
} from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useTheme } from '../../theme/ThemeContext';
import { formatDate, formatNaira } from '../../utils/format';
import { printTransactionReceipt, shareTransactionReceipt } from '../../utils/receipt';
import Screen from '../../components/Screen';
import PageHeader from '../../components/PageHeader';
import AppText from '../../components/ui/AppText';
import AppButton from '../../components/ui/AppButton';
import AppInput from '../../components/ui/AppInput';
import GlassCard from '../../components/ui/GlassCard';
import PressableScale from '../../components/ui/PressableScale';
import SheetModal from '../../components/ui/SheetModal';
import TransactionRow from '../../components/TransactionRow';
import EmptyState from '../../components/EmptyState';

const FILTERS = ['All', 'Successful', 'Pending', 'Failed'];

function DetailRow({ label, value, last = false, action }) {
  const { colors } = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 16,
        paddingVertical: 9,
        borderBottomWidth: last ? 0 : StyleSheet.hairlineWidth,
        borderBottomColor: colors.border,
      }}
    >
      <AppText size={12} color={colors.textSecondary}>
        {label}
      </AppText>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: 8,
        }}
      >
        <AppText
          weight="semiBold"
          size={12.5}
          style={{ flexShrink: 1, textAlign: 'right' }}
          numberOfLines={2}
        >
          {value}
        </AppText>
        {action}
      </View>
    </View>
  );
}

export default function TransactionsScreen() {
  const { transactions, refreshTransactions, user } = useAuth();
  const { showToast, showError } = useToast();
  const { colors } = useTheme();

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [printing, setPrinting] = useState(false);
  const [sharing, setSharing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      refreshTransactions();
      const interval = setInterval(refreshTransactions, 60000);
      return () => clearInterval(interval);
    }, [refreshTransactions])
  );

  const totals = useMemo(() => {
    return transactions.reduce(
      (accumulator, transaction) => {
        if (transaction.isCredit) accumulator.in += Number(transaction.amount || 0);
        else accumulator.out += Number(transaction.amount || 0);
        return accumulator;
      },
      { in: 0, out: 0 }
    );
  }, [transactions]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return transactions.filter((transaction) => {
      const matchFilter = filter === 'All' || transaction.status === filter;
      if (!matchFilter) return false;
      if (!query) return true;

      return [transaction.service, transaction.type, transaction.desc, transaction.network, transaction.phone, transaction.id]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query));
    });
  }, [transactions, filter, search]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshTransactions();
    setRefreshing(false);
  };

  const copyReference = async () => {
    if (!selected?.id) return;
    await Clipboard.setStringAsync(String(selected.id));
    Haptics.selectionAsync().catch(() => {});
    showToast('Transaction reference copied');
  };

  const printReceipt = async () => {
    if (!selected || printing) return;
    setPrinting(true);
    try {
      await printTransactionReceipt(selected, user);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    } catch {
      showError('Printing is not available on this device');
    } finally {
      setPrinting(false);
    }
  };

  const shareReceipt = async () => {
    if (!selected || sharing) return;
    setSharing(true);
    try {
      await shareTransactionReceipt(selected, user);
      Haptics.selectionAsync().catch(() => {});
    } catch {
      showError('Sharing is not available on this device');
    } finally {
      setSharing(false);
    }
  };

  return (
    <Screen scroll={false}>
      <View style={{ paddingHorizontal: 20 }}>
        <PageHeader
          eyebrow="Wallet activity"
          title="Transactions"
          subtitle={`${transactions.length} transaction${transactions.length === 1 ? '' : 's'} recorded`}
        />
      </View>

      <View style={{ paddingHorizontal: 20, gap: 12 }}>
        <AppInput
          placeholder="Search by service, phone, network or ID"
          value={search}
          onChangeText={setSearch}
          icon={<Search size={17} color={colors.textSecondary} />}
          right={
            search ? (
              <PressableScale onPress={() => setSearch('')} hitSlop={10}>
                <X size={16} color={colors.textSecondary} />
              </PressableScale>
            ) : null
          }
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, paddingVertical: 2 }}
        >
          {FILTERS.map((item) => {
            const active = filter === item;
            return (
              <PressableScale
                key={item}
                onPress={() => {
                  setFilter(item);
                  Haptics.selectionAsync().catch(() => {});
                }}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 9,
                  borderRadius: 20,
                  backgroundColor: active ? colors.green : colors.inputBg,
                  borderWidth: 1,
                  borderColor: active ? colors.green : colors.border,
                }}
              >
                <AppText
                  weight="semiBold"
                  size={11.5}
                  color={active ? '#FFFFFF' : colors.textSecondary}
                >
                  {item}
                </AppText>
              </PressableScale>
            );
          })}
        </ScrollView>

        <View style={{ flexDirection: 'row', gap: 10 }}>
          <GlassCard borderRadius={14} style={{ flex: 1, padding: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <ArrowDownLeft size={13} color={colors.green} />
              <AppText size={10} color={colors.textSecondary} weight="medium">
                Money in
              </AppText>
            </View>
            <AppText weight="bold" size={15} color={colors.green} style={{ marginTop: 4 }}>
              {formatNaira(totals.in)}
            </AppText>
          </GlassCard>

          <GlassCard borderRadius={14} style={{ flex: 1, padding: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <ArrowUpRight size={13} color={colors.amber} />
              <AppText size={10} color={colors.textSecondary} weight="medium">
                Money out
              </AppText>
            </View>
            <AppText weight="bold" size={15} color={colors.text} style={{ marginTop: 4 }}>
              {formatNaira(totals.out)}
            </AppText>
          </GlassCard>
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 14,
          paddingBottom: 30,
          gap: 10,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.green}
            colors={[colors.green]}
            progressBackgroundColor={colors.cardSolid}
          />
        }
        renderItem={({ item }) => (
          <TransactionRow transaction={item} card onPress={() => setSelected(item)} />
        )}
        ListEmptyComponent={
          <EmptyState
            icon={Search}
            title="No transactions found"
            message="Try a different search term or filter to see more activity."
            action={
              <AppButton
                title="Clear filters"
                variant="secondary"
                size="sm"
                onPress={() => {
                  setSearch('');
                  setFilter('All');
                }}
              />
            }
          />
        }
        ListFooterComponent={
          filtered.length > 0 ? (
            <AppText
              size={10.5}
              color={colors.textMuted}
              align="center"
              style={{ paddingTop: 8 }}
            >
              Showing {filtered.length} of {transactions.length} transactions
            </AppText>
          ) : null
        }
      />

      <SheetModal
        visible={Boolean(selected)}
        onClose={() => setSelected(null)}
        title="Transaction details"
        subtitle={selected?.id ? `Reference ${selected.id}` : undefined}
        maxHeight="88%"
      >
        {selected ? (
          <View style={{ gap: 16 }}>
            <View style={{ alignItems: 'center', paddingTop: 4 }}>
              <View
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: selected.isCredit ? colors.successSoft : colors.warningSoft,
                  borderWidth: 1,
                  borderColor: selected.isCredit
                    ? 'rgba(16,185,129,0.24)'
                    : 'rgba(245,158,11,0.2)',
                  marginBottom: 12,
                }}
              >
                {selected.isCredit ? (
                  <ArrowDownLeft size={28} color={colors.green} />
                ) : (
                  <ArrowUpRight size={28} color={colors.amber} />
                )}
              </View>

              <AppText weight="extraBold" size={28} color={selected.isCredit ? colors.green : colors.text}>
                {selected.isCredit ? '+' : '-'}
                {formatNaira(selected.amount)}
              </AppText>

              <View
                style={{
                  marginTop: 8,
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 8,
                  backgroundColor:
                    selected.status === 'Successful'
                      ? colors.successSoft
                      : selected.status === 'Pending'
                        ? colors.warningSoft
                        : colors.dangerSoft,
                }}
              >
                <AppText
                  weight="semiBold"
                  size={10.5}
                  color={
                    selected.status === 'Successful'
                      ? colors.green
                      : selected.status === 'Pending'
                        ? colors.amber
                        : colors.red
                  }
                >
                  {selected.status}
                </AppText>
              </View>
            </View>

            <GlassCard borderRadius={15} style={{ paddingHorizontal: 14, paddingVertical: 4 }}>
              <DetailRow label="Service" value={selected.service || selected.type || 'Transaction'} />
              <DetailRow label="Description" value={selected.desc || '—'} />
              {selected.network ? <DetailRow label="Provider" value={selected.network} /> : null}
              {selected.phone ? <DetailRow label="Recipient" value={selected.phone} /> : null}
              <DetailRow label="Date" value={formatDate(selected.date)} />
              <DetailRow
                label="Reference"
                value={selected.id || '—'}
                last
                action={
                  <PressableScale
                    onPress={copyReference}
                    accessibilityLabel="Copy transaction reference"
                    hitSlop={10}
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: 8,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: colors.successSoft,
                      borderWidth: 1,
                      borderColor: 'rgba(16,185,129,0.2)',
                    }}
                  >
                    <Copy size={13} color={colors.green} />
                  </PressableScale>
                }
              />
            </GlassCard>

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <AppButton
                title="Share receipt"
                variant="secondary"
                size="sm"
                loading={sharing}
                icon={<Share2 size={15} color={colors.green} />}
                onPress={shareReceipt}
                style={{ flex: 1 }}
              />
              <AppButton
                title="Print receipt"
                size="sm"
                loading={printing}
                icon={<Printer size={15} color="#FFFFFF" />}
                onPress={printReceipt}
                style={{ flex: 1 }}
              />
            </View>

            <AppButton
              title="Close"
              variant="ghost"
              onPress={() => setSelected(null)}
              style={{ height: 44 }}
            />
          </View>
        ) : null}
      </SheetModal>
    </Screen>
  );
}
