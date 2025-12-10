import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, TouchableOpacityProps } from 'react-native';
import { COLORS, RADIUS, SPACING, FONTS, FONT_SIZES, FONT_WEIGHTS } from '@/theme';

interface ButtonProps extends TouchableOpacityProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  label?: string;
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  label,
  loading,
  icon,
  style,
  disabled,
  ...props
}) => {
  const getBackgroundColor = () => {
    if (disabled) return COLORS.muted;
    switch (variant) {
      case 'primary': return COLORS.primary;
      case 'secondary': return COLORS.secondary;
      case 'outline': return 'transparent';
      case 'ghost': return 'transparent';
      case 'destructive': return COLORS.destructive;
      default: return COLORS.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return COLORS.mutedForeground;
    switch (variant) {
      case 'primary': return COLORS.primaryForeground;
      case 'secondary': return COLORS.secondaryForeground;
      case 'outline': return COLORS.primary;
      case 'ghost': return COLORS.foreground;
      case 'destructive': return COLORS.primaryForeground;
      default: return COLORS.primaryForeground;
    }
  };

  const getPadding = () => {
    switch (size) {
      case 'sm': return { paddingVertical: SPACING.xs, paddingHorizontal: SPACING.sm };
      case 'md': return { paddingVertical: SPACING.sm, paddingHorizontal: SPACING.lg };
      case 'lg': return { paddingVertical: SPACING.md, paddingHorizontal: SPACING.xl };
      case 'icon': return { padding: SPACING.sm };
      default: return { paddingVertical: SPACING.sm, paddingHorizontal: SPACING.lg };
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: variant === 'outline' ? COLORS.border : 'transparent',
          borderWidth: variant === 'outline' ? 1 : 0,
          ...getPadding(),
        },
        style,
      ]}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <>
          {icon && <>{icon}</>}
          {label && (
            <Text
              style={[
                styles.label,
                {
                  color: getTextColor(),
                  marginLeft: icon ? SPACING.sm : 0,
                  fontSize: size === 'sm' ? FONT_SIZES.xs : FONT_SIZES.base,
                },
              ]}
            >
              {label}
            </Text>
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.md,
  },
  label: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.base,
  },
});
