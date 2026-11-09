import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import AppText from './ui/AppText';
import FadeInView from './ui/FadeInView';
import GlassCard from './ui/GlassCard';
import PressableScale from './ui/PressableScale';
import TransactionRow from './TransactionRow';

export default function TransactionList({ transactions = [], onSeeAll }) {
  const { colors } = useTheme();

  return (
    <FadeInView delay={220}>
      <GlassCard style={{ padding: 18 }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 17,
          }}
        >
          <AppText weight="semiBold" size={16.5}>
            Recent Transactions
          </AppText>
          <PressableScale onPress={onSeeAll} hitSlop={8}>
            <AppText weight="semiBold" size={13} color={colors.blue}>
              See all
            </AppText>
          </PressableScale>
        </View>

        {transactions.length === 0 ? (
          <View style={{ paddingVertical: 20 }}>
            <AppText size={13} color={colors.textSecondary} align="center">
              No transactions yet.
            </AppText>
          </View>
        ) : (
          <View style={{ gap: 18 }}>
            {transactions.slice(0, 4).map((transaction) => (
              <TransactionRow key={transaction.id} transaction={transaction} />
            ))}
          </View>
        )}
      </GlassCard>
    </FadeInView>
  );
}
