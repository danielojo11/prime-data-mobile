import React from 'react';
import { View } from 'react-native';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';
import { formatDate, formatNaira } from '../utils/format';
import AppText from './ui/AppText';
import GlassCard from './ui/GlassCard';
import PressableScale from './ui/PressableScale';

const STATUS_COLORS = {
  Successful: 'green',
  Pending: 'amber',
  Failed: 'red',
};

export default function TransactionRow({ transaction, card = false, onPress }) {
  const { colors } = useTheme();
  const isCredit = transaction.isCredit === true;
  const statusColor = colors[STATUS_COLORS[transaction.status] || 'textSecondary'];
  const title = transaction.service || transaction.type || 'Transaction';
  const subtitle = `${transaction.desc || transaction.network || transaction.phone || '—'} • ${formatDate(
    transaction.date
  )}`;

  const content = (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 13 }}>
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: 13,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: isCredit ? colors.successSoft : colors.warningSoft,
          borderWidth: 1,
          borderColor: isCredit ? 'rgba(16,185,129,0.22)' : 'rgba(245,158,11,0.18)',
        }}
      >
        {isCredit ? (
          <ArrowDownLeft size={20} color={colors.green} />
        ) : (
          <ArrowUpRight size={20} color={colors.amber} />
        )}
      </View>

      <View style={{ flex: 1, minWidth: 0 }}>
        <AppText weight="semiBold" size={14.5} numberOfLines={1}>
          {title}
        </AppText>
        <AppText
          size={11.5}
          color={colors.textSecondary}
          numberOfLines={1}
          style={{ marginTop: 2 }}
        >
          {subtitle}
        </AppText>
      </View>

      <View style={{ alignItems: 'flex-end', flexShrink: 0 }}>
        <AppText
          weight="bold"
          size={14.5}
          color={isCredit ? colors.green : colors.text}
          numberOfLines={1}
        >
          {isCredit ? '+' : '-'}
          {formatNaira(transaction.amount)}
        </AppText>
        <AppText weight="semiBold" size={10.5} color={statusColor} style={{ marginTop: 2 }}>
          {transaction.status}
        </AppText>
      </View>
    </View>
  );

  if (card) {
    return (
      <PressableScale onPress={onPress} disabled={!onPress}>
        <GlassCard borderRadius={15} style={{ paddingVertical: 13, paddingHorizontal: 14 }}>
          {content}
        </GlassCard>
      </PressableScale>
    );
  }

  return (
    <PressableScale onPress={onPress} disabled={!onPress}>
      {content}
    </PressableScale>
  );
}
