import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function SplashView({ overlay = false, message = 'Preparing your wallet…' }) {
  return (
    <View style={[styles.root, overlay && styles.overlay]}>
      <View style={[styles.glow, styles.glowGreen]} />
      <View style={[styles.glow, styles.glowBlue]} />

      <LinearGradient
        colors={['#10B981', '#059669']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.logo}
      >
        <Text style={styles.logoText}>PD</Text>
      </LinearGradient>

      <Text style={styles.title}>PrimeData</Text>
      <Text style={styles.subtitle}>VTU · BILLS · REWARDS</Text>

      <ActivityIndicator color="#10B981" size="small" style={{ marginTop: 30 }} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#050505',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
    elevation: 100,
  },
  glow: {
    position: 'absolute',
    width: 420,
    height: 420,
    borderRadius: 210,
  },
  glowGreen: {
    backgroundColor: '#10B981',
    opacity: 0.12,
    bottom: -220,
    right: -140,
  },
  glowBlue: {
    backgroundColor: '#3EAEFF',
    opacity: 0.08,
    top: -180,
    left: -150,
  },
  logo: {
    width: 82,
    height: 82,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#10B981',
    shadowOpacity: 0.5,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 1,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 27,
    fontWeight: '800',
    letterSpacing: -0.4,
    marginTop: 20,
  },
  subtitle: {
    color: '#8E8F94',
    fontSize: 9.5,
    fontWeight: '600',
    letterSpacing: 2.2,
    marginTop: 7,
  },
  message: {
    color: '#5C5E64',
    fontSize: 11.5,
    marginTop: 10,
  },
});
