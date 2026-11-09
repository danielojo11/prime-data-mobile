import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { Check, ChevronDown } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeContext';
import AppText from './AppText';
import PressableScale from './PressableScale';

export default function SelectField({
  label,
  placeholder = 'Select an option',
  value,
  options = [],
  onSelect,
  icon,
  style,
  disabled = false,
}) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(false);

  return (
    <View style={style}>
      {label ? (
        <AppText
          weight="medium"
          size={12}
          color={colors.textSecondary}
          style={{ marginBottom: 7 }}
        >
          {label}
        </AppText>
      ) : null}

      <PressableScale
        disabled={disabled}
        onPress={() => setOpen(true)}
        style={{
          minHeight: 54,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: colors.inputBorder,
          backgroundColor: colors.inputBg,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 14,
          opacity: disabled ? 0.55 : 1,
        }}
      >
        {icon ? <View style={{ marginRight: 10 }}>{icon}</View> : null}
        <AppText
          size={15}
          color={value ? colors.text : colors.textMuted}
          style={{ flex: 1 }}
          numberOfLines={1}
        >
          {value || placeholder}
        </AppText>
        <ChevronDown size={18} color={colors.textSecondary} />
      </PressableScale>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setOpen(false)}
      >
        <View style={styles.overlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setOpen(false)} />
          <View
            style={[
              styles.sheet,
              {
                backgroundColor: colors.bgSecondary,
                borderColor: colors.border,
                paddingBottom: Math.max(insets.bottom, 12) + 8,
              },
            ]}
          >
            <View style={{ paddingHorizontal: 20, paddingTop: 18, paddingBottom: 12 }}>
              <View
                style={{
                  width: 42,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: colors.borderStrong,
                  alignSelf: 'center',
                  marginBottom: 16,
                }}
              />
              <AppText weight="bold" size={19}>
                {label || 'Choose an option'}
              </AppText>
              <AppText size={12.5} color={colors.textSecondary} style={{ marginTop: 3 }}>
                Select one to continue
              </AppText>
            </View>

            <ScrollView
              style={{ maxHeight: 430 }}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 8 }}
            >
              {options.map((option, index) => {
                const selected = value === option.label;
                return (
                  <Pressable
                    key={`${option.value}-${index}`}
                    onPress={() => {
                      setOpen(false);
                      onSelect?.(option);
                    }}
                    style={({ pressed }) => ({
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 12,
                      paddingVertical: 14,
                      paddingHorizontal: 12,
                      borderRadius: 14,
                      backgroundColor: selected
                        ? colors.successSoft
                        : pressed
                          ? colors.inputBg
                          : 'transparent',
                      borderBottomWidth: index === options.length - 1 ? 0 : 1,
                      borderBottomColor: colors.border,
                    })}
                  >
                    <View style={{ flex: 1 }}>
                      <AppText
                        weight={selected ? 'semiBold' : 'medium'}
                        size={14.5}
                        color={selected ? colors.green : colors.text}
                      >
                        {option.label}
                      </AppText>
                      {option.description ? (
                        <AppText size={11.5} color={colors.textSecondary} style={{ marginTop: 2 }}>
                          {option.description}
                        </AppText>
                      ) : null}
                    </View>
                    {option.meta ? (
                      <AppText weight="semiBold" size={13.5} color={colors.green}>
                        {option.meta}
                      </AppText>
                    ) : null}
                    {selected ? <Check size={18} color={colors.green} /> : null}
                  </Pressable>
                );
              })}
              {options.length === 0 ? (
                <AppText
                  size={13}
                  color={colors.textSecondary}
                  style={{ padding: 20, textAlign: 'center' }}
                >
                  No options available.
                </AppText>
              ) : null}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderBottomWidth: 0,
    maxHeight: '78%',
  },
});
