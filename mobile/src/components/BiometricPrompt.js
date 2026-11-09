import React, { useEffect, useState } from 'react';
import {
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import * as Haptics from 'expo-haptics';
import { CheckCircle2, Fingerprint, ScanFace, ShieldCheck, X } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';
import useAnimatedValue from '../utils/useAnimatedValue';
import AppText from './ui/AppText';

export default function BiometricPrompt({
  isOpen,
  onClose,
  onSuccess,
  type = 'fingerprint',
  userName = 'User',
}) {
  const { colors } = useTheme();
  const [status, setStatus] = useState('idle');
  const rippleOne = useAnimatedValue(0);
  const rippleTwo = useAnimatedValue(0);
  const scanLine = useAnimatedValue(0);

  const close = () => {
    setStatus('idle');
    onClose?.();
  };

  useEffect(() => {
    if (status !== 'scanning') {
      rippleOne.setValue(0);
      rippleTwo.setValue(0);
      scanLine.setValue(0);
      return undefined;
    }

    const rippleAnim = Animated.loop(
      Animated.timing(rippleOne, {
        toValue: 1,
        duration: 1800,
        useNativeDriver: true,
      })
    );
    const rippleAnimTwo = Animated.loop(
      Animated.sequence([
        Animated.delay(700),
        Animated.timing(rippleTwo, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.delay(200),
      ])
    );
    const lineAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(scanLine, {
          toValue: 1,
          duration: 1100,
          useNativeDriver: true,
        }),
        Animated.timing(scanLine, {
          toValue: 0,
          duration: 1100,
          useNativeDriver: true,
        }),
      ])
    );

    rippleAnim.start();
    rippleAnimTwo.start();
    lineAnim.start();

    return () => {
      rippleAnim.stop();
      rippleAnimTwo.stop();
      lineAnim.stop();
    };
  }, [status, rippleOne, rippleTwo, scanLine]);

  const handleScan = async () => {
    if (status !== 'idle') return;

    setStatus('scanning');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});

    try {
      const [hasHardware, isEnrolled] = await Promise.all([
        LocalAuthentication.hasHardwareAsync(),
        LocalAuthentication.isEnrolledAsync(),
      ]);

      if (hasHardware && isEnrolled) {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: `Sign in as ${userName}`,
          cancelLabel: 'Cancel',
          fallbackLabel: 'Use passcode',
          disableDeviceFallback: false,
        });

        if (!result.success) {
          setStatus('error');
          setTimeout(() => setStatus('idle'), 1400);
          return;
        }
      } else {
        // Friendly prototype fallback when no biometrics are enrolled.
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }

      setStatus('success');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      setTimeout(() => {
        setStatus('idle');
        onSuccess?.();
      }, 900);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 1400);
    }
  };

  if (!isOpen) return null;

  const isFace = type === 'face';
  const statusText =
    status === 'scanning'
      ? `Identifying ${userName}...`
      : status === 'success'
        ? `Welcome back, ${userName}!`
        : status === 'error'
          ? "Couldn't verify. Tap to try again."
          : `Tap the sensor to authenticate as ${userName}`;

  return (
    <Modal visible={isOpen} transparent animationType="fade" statusBarTranslucent onRequestClose={close}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={close} />
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.bgSecondary,
              borderColor: colors.border,
            },
          ]}
        >
          <Pressable onPress={close} hitSlop={12} style={styles.close}>
            <X size={20} color={colors.textSecondary} />
          </Pressable>

          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: colors.successSoft,
              marginBottom: 14,
            }}
          >
            <ShieldCheck size={22} color={colors.green} />
          </View>

          <AppText weight="bold" size={20}>
            {isFace ? 'Face ID' : 'Touch ID'}
          </AppText>
          <AppText
            size={12.5}
            color={colors.textSecondary}
            align="center"
            style={{ marginTop: 4, marginBottom: 24 }}
          >
            Secure biometric verification
          </AppText>

          <Pressable onPress={handleScan} disabled={status !== 'idle'}>
            <View style={styles.sensorWrap}>
              {status === 'scanning' ? (
                <>
                  <Animated.View
                    style={[
                      styles.ripple,
                      {
                        borderColor: colors.green,
                        opacity: rippleOne.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.7, 0],
                        }),
                        transform: [
                          {
                            scale: rippleOne.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0.85, 1.65],
                            }),
                          },
                        ],
                      },
                    ]}
                  />
                  <Animated.View
                    style={[
                      styles.ripple,
                      {
                        borderColor: colors.green,
                        opacity: rippleTwo.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.5, 0],
                        }),
                        transform: [
                          {
                            scale: rippleTwo.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0.85, 1.65],
                            }),
                          },
                        ],
                      },
                    ]}
                  />
                </>
              ) : null}

              <View
                style={[
                  styles.sensor,
                  {
                    backgroundColor:
                      status === 'success'
                        ? colors.successSoft
                        : status === 'error'
                          ? colors.dangerSoft
                          : colors.inputBg,
                    borderColor:
                      status === 'success'
                        ? colors.green
                        : status === 'error'
                          ? colors.red
                          : colors.green,
                    borderStyle: status === 'idle' ? 'dashed' : 'solid',
                  },
                ]}
              >
                {status === 'success' ? (
                  <CheckCircle2 size={62} color={colors.green} />
                ) : isFace ? (
                  <ScanFace
                    size={62}
                    color={status === 'error' ? colors.red : colors.green}
                  />
                ) : (
                  <Fingerprint
                    size={62}
                    color={status === 'error' ? colors.red : colors.green}
                  />
                )}

                {status === 'scanning' ? (
                  <Animated.View
                    style={{
                      position: 'absolute',
                      left: 12,
                      right: 12,
                      height: 3,
                      borderRadius: 2,
                      backgroundColor: colors.green,
                      shadowColor: colors.green,
                      shadowOpacity: 1,
                      shadowRadius: 10,
                      elevation: 4,
                      transform: [
                        {
                          translateY: scanLine.interpolate({
                            inputRange: [0, 1],
                            outputRange: [-46, 46],
                          }),
                        },
                      ],
                    }}
                  />
                ) : null}
              </View>
            </View>
          </Pressable>

          <AppText
            weight="medium"
            size={13.5}
            align="center"
            color={
              status === 'success'
                ? colors.green
                : status === 'error'
                  ? colors.red
                  : colors.textSecondary
            }
            style={{ marginTop: 22, minHeight: 40 }}
          >
            {statusText}
          </AppText>

          <View
            style={{
              marginTop: 10,
              paddingTop: 14,
              borderTopWidth: 1,
              borderTopColor: colors.border,
              width: '100%',
            }}
          >
            <AppText size={10.5} color={colors.textMuted} align="center">
              Protected by PrimeData Secure Auth
            </AppText>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.66)',
    paddingHorizontal: 26,
  },
  card: {
    width: '100%',
    maxWidth: 330,
    borderRadius: 28,
    borderWidth: 1,
    paddingHorizontal: 22,
    paddingTop: 28,
    paddingBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 16 },
    elevation: 24,
  },
  close: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sensorWrap: {
    width: 128,
    height: 128,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sensor: {
    width: 116,
    height: 116,
    borderRadius: 58,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  ripple: {
    position: 'absolute',
    width: 116,
    height: 116,
    borderRadius: 58,
    borderWidth: 2,
  },
});
