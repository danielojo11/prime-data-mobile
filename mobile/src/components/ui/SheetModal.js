import React, { useEffect, useState } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeContext';
import useAnimatedValue from '../../utils/useAnimatedValue';
import AppText from './AppText';

export default function SheetModal({
  visible,
  onClose,
  title,
  subtitle,
  children,
  scroll = true,
  maxHeight = '92%',
  contentContainerStyle,
}) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [mounted, setMounted] = useState(visible);
  const progress = useAnimatedValue(0);

  useEffect(() => {
    if (visible) {
      // Mount before playing the enter animation.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMounted(true);
      Animated.spring(progress, {
        toValue: 1,
        speed: 18,
        bounciness: 4,
        useNativeDriver: true,
      }).start();
      return;
    }

    if (mounted) {
      Animated.timing(progress, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) setMounted(false);
      });
    }
  }, [visible, mounted, progress]);

  if (!mounted) return null;

  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [640, 0],
  });

  return (
    <Modal
      visible={mounted}
      transparent
      animationType="none"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.root}>
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: colors.overlay, opacity: progress },
          ]}
        />
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        <KeyboardAvoidingView
          style={styles.keyboard}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <Animated.View
            style={[
              styles.sheet,
              {
                backgroundColor: colors.bgSecondary,
                borderColor: colors.border,
                maxHeight,
                transform: [{ translateY }],
              },
            ]}
          >
            <View style={[styles.handle, { backgroundColor: colors.borderStrong }]} />

            <View style={styles.header}>
              <View style={{ flex: 1, paddingRight: 12 }}>
                <AppText weight="bold" size={20}>
                  {title}
                </AppText>
                {subtitle ? (
                  <AppText
                    size={12.5}
                    color={colors.textSecondary}
                    style={{ marginTop: 3 }}
                  >
                    {subtitle}
                  </AppText>
                ) : null}
              </View>
              <Pressable
                onPress={onClose}
                hitSlop={12}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: colors.inputBg,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                <X size={19} color={colors.textSecondary} />
              </Pressable>
            </View>

            {scroll ? (
              <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={[
                  {
                    paddingHorizontal: 20,
                    paddingBottom: Math.max(insets.bottom, 12) + 18,
                  },
                  contentContainerStyle,
                ]}
              >
                {children}
              </ScrollView>
            ) : (
              <View
                style={[
                  {
                    paddingHorizontal: 20,
                    paddingBottom: Math.max(insets.bottom, 12) + 18,
                  },
                  contentContainerStyle,
                ]}
              >
                {children}
              </View>
            )}
          </Animated.View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  keyboard: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderWidth: 1,
    borderBottomWidth: 0,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: -10 },
    elevation: 24,
  },
  handle: {
    width: 42,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
});
