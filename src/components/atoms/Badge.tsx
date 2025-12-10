import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, RADIUS, SPACING, FONTS, FONT_SIZES, FONT_WEIGHTS } from '@/theme';

interface BadgeProps {
  label: string;
  variant?: 'default' | 'outline' | 'secondary';
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'default' }) => {
  const getBackgroundColor = () => {
    switch (variant) {
      case 'default': return 'rgba(255, 255, 255, 0.1)';
      case 'secondary': return COLORS.secondary;
      case 'outline': return 'transparent';
      default: return 'rgba(255, 255, 255, 0.1)';
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: getBackgroundColor(),
          borderWidth: variant === 'outline' ? 1 : 0,
          borderColor: variant === 'outline' ? COLORS.border : 'transparent',
        },
      ]}
    >
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
    alignSelf: 'flex-start',
  },
  label: {
    color: COLORS.mutedForeground,
    fontSize: 10,
    fontFamily: FONTS.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
