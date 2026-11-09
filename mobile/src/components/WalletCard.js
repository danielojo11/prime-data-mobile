import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Eye, EyeOff, PlusCircle, Send } from 'lucide-react-native';
import { formatNaira } from '../utils/format';
import AppText from './ui/AppText';
import PressableScale from './ui/PressableScale';

export default function WalletCard({ balance, commission, onAction }) {
  const [hidden, setHidden] = useState(false);

  return (
    <LinearGradient
      colors={['#10B981', '#059669']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      <View style={styles.glowOne} />
      <View style={styles.glowTwo} />
      <View style={styles.ring} />

      <View style={{ position: 'relative', zIndex: 2 }}>
        <View style={styles.topRow}>
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
              <AppText size={13} color="rgba(255,255,255,0.85)" weight="medium">
                Wallet Balance
              </AppText>
              <PressableScale
                onPress={() => setHidden((current) => !current)}
                hitSlop={10}
                style={{ padding: 2 }}
              >
                {hidden ? (
                  <EyeOff size={14} color="rgba(255,255,255,0.8)" />
                ) : (
                  <Eye size={14} color="rgba(255,255,255,0.8)" />
                )}
              </PressableScale>
            </View>
            <AppText weight="extraBold" size={34} color="#FFFFFF" style={{ marginTop: 4 }}>
              {hidden ? '₦ • • • • •' : formatNaira(balance, true)}
            </AppText>
            <AppText size={11.5} color="rgba(255,255,255,0.82)" style={{ marginTop: 4 }}>
              Commission: {hidden ? '₦ • • •' : formatNaira(commission, true)}
            </AppText>
          </View>

          <View style={styles.brandMark}>
            <AppText weight="extraBold" size={13} color="#FFFFFF">
              PD
            </AppText>
          </View>
        </View>

        <View style={styles.actions}>
          <PressableScale
            onPress={() => onAction?.('Fund Wallet')}
            style={[styles.actionButton, styles.actionPrimary]}
          >
            <PlusCircle size={18} color="#FFFFFF" />
            <AppText weight="semiBold" size={13} color="#FFFFFF">
              Fund Wallet
            </AppText>
          </PressableScale>

          <PressableScale
            onPress={() => onAction?.('Transfer Funds')}
            style={[styles.actionButton, styles.actionSecondary]}
          >
            <Send size={18} color="#FFFFFF" />
            <AppText weight="semiBold" size={13} color="#FFFFFF">
              Transfer
            </AppText>
          </PressableScale>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 26,
    padding: 22,
    overflow: 'hidden',
    shadowColor: '#10B981',
    shadowOpacity: 0.32,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
  },
  glowOne: {
    position: 'absolute',
    right: -45,
    top: -55,
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  glowTwo: {
    position: 'absolute',
    left: -45,
    bottom: -80,
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  ring: {
    position: 'absolute',
    right: 18,
    bottom: -58,
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 22,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 22,
  },
  brandMark: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.24)',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    height: 48,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 7,
  },
  actionPrimary: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.32)',
  },
  actionSecondary: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
  },
});
