import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Pressable } from 'react-native';
import { GraphType, GraphTypeInfo } from '@/types/analytics';
import { COLORS, SPACING, FONTS, FONT_SIZES, RADIUS } from '@/theme';
import { BarChart, TrendingUp, Dumbbell, Trophy, Clock } from 'lucide-react-native';

interface GraphSelectorSheetProps {
    visible: boolean;
    onClose: () => void;
    onSelect: (type: GraphType) => void;
}

const GRAPH_TYPES: GraphTypeInfo[] = [
    {
        type: 'weekly_volume',
        title: 'Weekly Volume',
        description: 'Track your total volume over time',
        icon: 'bar-chart',
    },
    {
        type: 'workouts_per_week',
        title: 'Workouts Per Week',
        description: 'Monitor workout frequency',
        icon: 'trending-up',
    },
    {
        type: 'exercise_progress',
        title: 'Exercise Progress',
        description: 'See strength gains per exercise',
        icon: 'dumbbell',
    },
    {
        type: 'personal_records',
        title: 'Personal Records',
        description: 'View your top lifts',
        icon: 'trophy',
    },
    {
        type: 'muscle_group_distribution',
        title: 'Muscle Groups',
        description: 'Analyze training balance',
        icon: 'pie-chart',
    },
    {
        type: 'workout_duration',
        title: 'Workout Duration',
        description: 'Track session lengths',
        icon: 'clock',
    },
];

const getIcon = (iconName: string) => {
    const icons: Record<string, any> = {
        'bar-chart': BarChart,
        'trending-up': TrendingUp,
        'dumbbell': Dumbbell,
        'trophy': Trophy,
        'pie-chart': BarChart,
        'clock': Clock,
    };
    const Icon = icons[iconName];
    return Icon ? <Icon size={24} color={COLORS.primary} /> : null;
};

export const GraphSelectorSheet: React.FC<GraphSelectorSheetProps> = ({
    visible,
    onClose,
    onSelect,
}) => {
    const handleSelect = (type: GraphType) => {
        onSelect(type);
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <Pressable style={styles.backdrop} onPress={onClose}>
                <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
                    <View style={styles.handle} />
                    <Text style={styles.title}>Add Graph</Text>
                    <Text style={styles.subtitle}>Choose a graph type to add to your dashboard</Text>

                    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                        {GRAPH_TYPES.map((graphType) => (
                            <TouchableOpacity
                                key={graphType.type}
                                style={styles.card}
                                onPress={() => handleSelect(graphType.type)}
                                activeOpacity={0.7}
                            >
                                <View style={styles.iconContainer}>
                                    {getIcon(graphType.icon)}
                                </View>
                                <Text style={styles.cardTitle}>{graphType.title}</Text>
                                <Text style={styles.cardDescription}>{graphType.description}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </Pressable>
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'flex-end',
    },
    sheet: {
        backgroundColor: COLORS.card,
        borderTopLeftRadius: RADIUS.xl,
        borderTopRightRadius: RADIUS.xl,
        paddingTop: SPACING.md,
        paddingHorizontal: SPACING.lg,
        paddingBottom: SPACING.xxxl,
        maxHeight: '80%',
    },
    handle: {
        width: 40,
        height: 4,
        backgroundColor: COLORS.border,
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: SPACING.lg,
    },
    title: {
        fontSize: FONT_SIZES.xxl,
        fontFamily: FONTS.bold,
        color: COLORS.foreground,
        marginBottom: SPACING.xs,
    },
    subtitle: {
        fontSize: FONT_SIZES.sm,
        fontFamily: FONTS.sans,
        color: COLORS.mutedForeground,
        marginBottom: SPACING.xl,
    },
    scrollContent: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingBottom: SPACING.xl,
    },
    card: {
        width: '47%',
        backgroundColor: COLORS.background,
        borderRadius: RADIUS.lg,
        padding: SPACING.lg,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: SPACING.md,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: RADIUS.md,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.md,
    },
    cardTitle: {
        fontSize: FONT_SIZES.base,
        fontFamily: FONTS.bold,
        color: COLORS.foreground,
        marginBottom: SPACING.xs,
    },
    cardDescription: {
        fontSize: FONT_SIZES.xs,
        fontFamily: FONTS.sans,
        color: COLORS.mutedForeground,
        lineHeight: 16,
    },
});
