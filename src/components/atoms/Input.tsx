import React from 'react';
import { TextInput, TextInputProps, StyleSheet, View } from 'react-native';
import { COLORS, RADIUS, SPACING, FONTS, FONT_SIZES } from '@/theme';

interface InputProps extends TextInputProps {
  variant?: 'default' | 'ghost';
  centered?: boolean;
}

export const Input: React.FC<InputProps> = ({
  variant = 'default',
  centered = false,
  style,
  ...props
}) => {
  return (
    <TextInput
      style={[
        styles.input,
        {
          backgroundColor: variant === 'default' ? COLORS.input : 'transparent',
          textAlign: centered ? 'center' : 'left',
          color: COLORS.foreground,
        },
        style,
      ]}
      placeholderTextColor={COLORS.mutedForeground}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    height: 48,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    fontFamily: FONTS.semibold,
    fontSize: FONT_SIZES.lg,
  },
});
