import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, RADIUS, SPACING, FONTS, FONT_SIZES, FONT_WEIGHTS } from '@/theme';
import { Ionicons } from '@expo/vector-icons';

interface SessionSummaryCardProps {
  prCount: number;
  consistency: number;
  progressLabel: string;
  isProgressPositive: boolean;
  intensity: 'Low' | 'Moderate' | 'High';
}

export const SessionSummaryCard: React.FC<SessionSummaryCardProps> = ({
  prCount,
  consistency,
  progressLabel,
  isProgressPositive,
  intensity,
}) => {
  return (
    <View style={styles.container}>
      {/* Row 1: PRs & Consistency */}
      <View style={styles.row}>
        <View style={[styles.card, styles.highlightCard]}>
          <View style={styles.iconContainer}>
            <Ionicons name="trophy" size={18} color="#FFD700" />
          </View>
          <View>
            <Text style={styles.value}>{prCount} PRs</Text>
            <Text style={styles.label}>New Records</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={[styles.iconContainer, { backgroundColor: 'rgba(59, 130, 246, 0.1)' }]}>
            <Ionicons name="calendar" size={18} color={COLORS.primary} />
          </View>
          <View>
            <Text style={styles.value}>{consistency}</Text>
            <Text style={styles.label}>Workouts this week</Text>
          </View>
        </View>
      </View>

      {/* Row 2: Progress & Intensity */}
      <View style={styles.row}>
        <View style={styles.card}>
          <View style={[styles.iconContainer, { backgroundColor: isProgressPositive ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)' }]}>
            <Ionicons
              name={isProgressPositive ? "trending-up" : "trending-down"}
              size={18}
              color={isProgressPositive ? "#22c55e" : "#ef4444"}
            />
          </View>
          <View>
            <Text style={[styles.value, { color: isProgressPositive ? "#22c55e" : "#ef4444" }]}>
              {progressLabel}
            </Text>
            <Text style={styles.label}>Vs. Last Session</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={[styles.iconContainer, { backgroundColor: 'rgba(249, 115, 22, 0.1)' }]}>
            <Ionicons name="flame" size={18} color="#f97316" />
          </View>
          <View>
            <Text style={styles.value}>{intensity}</Text>
            <Text style={styles.label}>Intensity</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  row: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  card: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  highlightCard: {
    borderColor: 'rgba(255, 215, 0, 0.3)',
    backgroundColor: 'rgba(255, 215, 0, 0.05)',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  value: {
    color: COLORS.foreground,
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
  },
  label: {
    color: COLORS.mutedForeground,
    fontSize: FONT_SIZES.xs,
  },
});
