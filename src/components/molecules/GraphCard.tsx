import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { GraphConfig } from '@/types/analytics';
import { COLORS, SPACING, FONTS, FONT_SIZES, RADIUS } from '@/theme';
import { MoreVertical } from 'lucide-react-native';
import { useHistoryStore } from '@/stores/historyStore';
import {
    calculateWeeklyVolume,
    calculateWorkoutFrequency,
    getExerciseProgress,
    getPersonalRecords,
    getMuscleGroupDistribution,
} from '@/utils/analyticsCalculations';

interface GraphCardProps {
    config: GraphConfig;
    onRemove: () => void;
}

const screenWidth = Dimensions.get('window').width;

const chartConfig = {
    backgroundColor: COLORS.card,
    backgroundGradientFrom: COLORS.card,
    backgroundGradientTo: COLORS.card,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity * 0.6})`,
    style: {
        borderRadius: RADIUS.lg,
    },
    propsForDots: {
        r: '4',
        strokeWidth: '2',
        stroke: COLORS.primary,
    },
    propsForBackgroundLines: {
        strokeDasharray: '',
        stroke: 'rgba(255, 255, 255, 0.05)',
    },
};

export const GraphCard: React.FC<GraphCardProps> = ({ config, onRemove }) => {
    const { workouts } = useHistoryStore();
    const [showMenu, setShowMenu] = useState(false);

    const getGraphData = () => {
        switch (config.type) {
            case 'weekly_volume':
                return calculateWeeklyVolume(workouts, config.timeRange);
            case 'workouts_per_week':
                return calculateWorkoutFrequency(workouts, config.timeRange);
            case 'exercise_progress':
                return config.exerciseId
                    ? getExerciseProgress(workouts, config.exerciseId)
                    : { labels: [], datasets: [{ data: [] }] };
            case 'personal_records':
                return getPersonalRecords(workouts);
            case 'muscle_group_distribution':
                return getMuscleGroupDistribution(workouts);
            default:
                return { labels: [], datasets: [{ data: [] }] };
        }
    };

    const renderChart = () => {
        const data = getGraphData();

        if (!data.labels.length || !data.datasets[0].data.length) {
            return (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>No data available</Text>
                </View>
            );
        }

        const chartData = {
            labels: data.labels,
            datasets: data.datasets,
        };

        const chartWidth = screenWidth - (SPACING.lg * 4);

        switch (config.type) {
            case 'weekly_volume':
            case 'personal_records':
                return (
                    <BarChart
                        data={chartData}
                        width={chartWidth}
                        height={200}
                        yAxisLabel=""
                        yAxisSuffix="kg"
                        chartConfig={chartConfig}
                        style={styles.chart}
                        showValuesOnTopOfBars
                        fromZero
                    />
                );

            case 'workouts_per_week':
            case 'exercise_progress':
                return (
                    <LineChart
                        data={chartData}
                        width={chartWidth}
                        height={200}
                        chartConfig={chartConfig}
                        bezier
                        style={styles.chart}
                        withInnerLines
                        withOuterLines
                        withVerticalLines={false}
                    />
                );

            case 'muscle_group_distribution':
                const pieData = data.labels.map((label, index) => ({
                    name: label,
                    population: data.datasets[0].data[index],
                    color: `hsl(${(index * 360) / data.labels.length}, 70%, 50%)`,
                    legendFontColor: COLORS.foreground,
                    legendFontSize: 12,
                }));

                return (
                    <PieChart
                        data={pieData}
                        width={chartWidth}
                        height={200}
                        chartConfig={chartConfig}
                        accessor="population"
                        backgroundColor="transparent"
                        paddingLeft="15"
                        absolute
                    />
                );

            default:
                return null;
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>{config.title}</Text>
                    <Text style={styles.timeRange}>{config.timeRange.toUpperCase()}</Text>
                </View>
                <View>
                    <TouchableOpacity onPress={() => setShowMenu(!showMenu)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                        <MoreVertical size={20} color={COLORS.mutedForeground} />
                    </TouchableOpacity>
                    
                    {showMenu && (
                        <View style={styles.menu}>
                            <TouchableOpacity 
                                style={styles.menuItem} 
                                onPress={() => {
                                    setShowMenu(false);
                                    onRemove();
                                }}
                            >
                                <Text style={styles.menuText}>Remove Graph</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>

            <View style={styles.chartContainer}>
                {renderChart()}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.card,
        borderRadius: RADIUS.xl,
        padding: SPACING.lg,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: SPACING.lg,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: SPACING.lg,
        zIndex: 1,
    },
    title: {
        fontSize: FONT_SIZES.lg,
        fontFamily: FONTS.bold,
        color: COLORS.foreground,
    },
    timeRange: {
        fontSize: FONT_SIZES.xs,
        fontFamily: FONTS.medium,
        color: COLORS.mutedForeground,
        marginTop: SPACING.xs,
    },
    chartContainer: {
        alignItems: 'center',
    },
    chart: {
        borderRadius: RADIUS.md,
    },
    emptyState: {
        height: 200,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        fontSize: FONT_SIZES.base,
        fontFamily: FONTS.sans,
        color: COLORS.mutedForeground,
    },
    menu: {
        position: 'absolute',
        right: 0,
        top: 30,
        backgroundColor: COLORS.card,
        borderRadius: RADIUS.md,
        borderWidth: 1,
        borderColor: COLORS.border,
        padding: SPACING.xs,
        zIndex: 1000,
        minWidth: 120,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    menuItem: {
        padding: SPACING.sm,
    },
    menuText: {
        color: COLORS.destructive,
        fontSize: FONT_SIZES.sm,
        fontFamily: FONTS.medium,
    },
});
