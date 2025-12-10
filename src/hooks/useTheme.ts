import { COLORS, SPACING, RADIUS, FONTS, FONT_SIZES } from '@/theme';

export const useTheme = () => {
  return {
    theme: {
      colors: COLORS,
      spacing: SPACING,
      radius: RADIUS,
      fonts: FONTS,
      fontSizes: FONT_SIZES,
    },
  };
};
