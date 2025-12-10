import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Plus } from 'lucide-react-native';
import { COLORS, SPACING, FONTS, FONT_SIZES, RADIUS } from '@/theme';

interface AddGraphButtonProps {
    onPress: () => void;
}

export const AddGraphButton: React.FC<AddGraphButtonProps> = ({ onPress }) => {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
            <Plus size={24} color={COLORS.primary} />
            <Text style={styles.text}>Add Graph</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.card,
        borderRadius: RADIUS.xl,
        padding: SPACING.xl,
        borderWidth: 2,
        borderColor: COLORS.border,
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: SPACING.sm,
        minHeight: 80,
    },
    text: {
        fontSize: FONT_SIZES.lg,
        fontFamily: FONTS.semibold,
        color: COLORS.primary,
    },
});
