import React, { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeContext';
import { fonts } from '../../theme/typography';
import AppText from './AppText';

export default function AppInput({
  label,
  value,
  onChangeText,
  placeholder,
  icon,
  style,
  inputStyle,
  right,
  secure = false,
  keyboardType,
  autoCapitalize = 'none',
  autoCorrect = false,
  maxLength,
  multiline = false,
  numberOfLines,
  editable = true,
  returnKeyType,
  onSubmitEditing,
  autoComplete,
  textContentType,
  error,
}) {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(secure);

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
      <View
        style={{
          minHeight: multiline ? 104 : 54,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: error
            ? colors.red
            : focused
              ? colors.green
              : colors.inputBorder,
          backgroundColor: colors.inputBg,
          flexDirection: 'row',
          alignItems: multiline ? 'flex-start' : 'center',
          paddingHorizontal: 14,
          paddingVertical: multiline ? 12 : 0,
        }}
      >
        {icon ? <View style={{ marginRight: 10 }}>{icon}</View> : null}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          secureTextEntry={secure && hidden}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          maxLength={maxLength}
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={editable}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          autoComplete={autoComplete}
          textContentType={textContentType}
          selectionColor={colors.green}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={[
            {
              flex: 1,
              color: colors.text,
              fontFamily: fonts.regular,
              fontSize: 15,
              paddingVertical: multiline ? 0 : 14,
              minHeight: multiline ? 80 : undefined,
              textAlignVertical: multiline ? 'top' : 'center',
            },
            inputStyle,
          ]}
        />
        {secure ? (
          <Pressable
            onPress={() => setHidden((current) => !current)}
            hitSlop={12}
            style={{ paddingLeft: 10 }}
          >
            {hidden ? (
              <Eye size={18} color={colors.textSecondary} />
            ) : (
              <EyeOff size={18} color={colors.textSecondary} />
            )}
          </Pressable>
        ) : null}
        {right ? <View style={{ paddingLeft: 10 }}>{right}</View> : null}
      </View>
      {error ? (
        <AppText size={11.5} color={colors.red} style={{ marginTop: 6 }}>
          {error}
        </AppText>
      ) : null}
    </View>
  );
}
