import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import useAnimatedValue from '../utils/useAnimatedValue';
import AppText from '../components/ui/AppText';

const ToastContext = createContext(null);

const TOAST_META = {
  success: { icon: CheckCircle2, colorKey: 'green' },
  error: { icon: AlertCircle, colorKey: 'red' },
  info: { icon: Info, colorKey: 'blue' },
};

export function ToastProvider({ children }) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [toast, setToast] = useState(null);
  const progress = useAnimatedValue(0);
  const timeoutRef = useRef(null);

  const showToast = useCallback((message, type = 'success') => {
    if (!message) return;
    setToast({ id: Date.now(), message, type });
  }, []);

  const showError = useCallback((message) => showToast(message, 'error'), [showToast]);
  const showInfo = useCallback((message) => showToast(message, 'info'), [showToast]);

  useEffect(() => {
    if (!toast) return undefined;

    progress.setValue(0);
    Animated.spring(progress, {
      toValue: 1,
      speed: 20,
      bounciness: 6,
      useNativeDriver: true,
    }).start();

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      Animated.timing(progress, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) setToast(null);
      });
    }, 2700);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [toast, progress]);

  const value = useMemo(
    () => ({ showToast, showError, showInfo }),
    [showToast, showError, showInfo]
  );

  const meta = toast ? TOAST_META[toast.type] || TOAST_META.success : null;
  const accent = meta ? colors[meta.colorKey] : colors.green;
  const Icon = meta?.icon || CheckCircle2;

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast ? (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.toast,
            {
              top: insets.top + 10,
              backgroundColor: colors.cardSolid,
              borderColor: accent,
              opacity: progress,
              transform: [
                {
                  translateY: progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-24, 0],
                  }),
                },
                {
                  scale: progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.97, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: `${accent}20`,
            }}
          >
            <Icon size={18} color={accent} />
          </View>
          <AppText weight="medium" size={13} style={{ flex: 1 }} numberOfLines={3}>
            {toast.message}
          </AppText>
        </Animated.View>
      ) : null}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 9999,
    elevation: 9999,
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 13,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
  },
});
