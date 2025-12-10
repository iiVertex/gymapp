import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, RADIUS, SPACING, FONTS, FONT_WEIGHTS, FONT_SIZES } from '@/theme';
import { WorkoutExercise } from '@/types/workout';
import { Badge } from '@/components/atoms/Badge';
import { MoreHorizontal, History } from 'lucide-react-native';

interface ExerciseCardProps {
  exercise: WorkoutExercise;
  children: React.ReactNode;
  onOptionsPress?: () => void;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  children,
  onOptionsPress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{exercise.exercise.name}</Text>
          <TouchableOpacity onPress={onOptionsPress} style={styles.optionsButton}>
            <MoreHorizontal size={20} color={COLORS.mutedForeground} />
          </TouchableOpacity>
        </View>

        <View style={styles.metaRow}>
          <Badge label={exercise.exercise.muscleGroup} />
          <View style={styles.historyContainer}>
            <History size={12} color={COLORS.mutedForeground} />
            <Text style={styles.historyText}>Last: 80kg × 8</Text>
          </View>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.content}>
        <View style={styles.columnHeaders}>
          <Text style={[styles.headerText, { width: 30 }]}>SET</Text>
          <Text style={[styles.headerText, { flex: 1 }]}>KG</Text>
          <Text style={[styles.headerText, { flex: 1 }]}>REPS</Text>
          <Text style={[styles.headerText, { width: 40 }]}>✓</Text>
        </View>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
    overflow: 'hidden',
  },
  header: {
    padding: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.xs,
  },
  title: {
    color: COLORS.foreground,
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.xl,
    flex: 1,
  },
  optionsButton: {
    padding: SPACING.xs,
    marginRight: -SPACING.xs,
    marginTop: -SPACING.xs,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  historyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  historyText: {
    color: COLORS.mutedForeground,
    fontSize: FONT_SIZES.xs,
    fontFamily: FONTS.medium,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    width: '100%',
    opacity: 0.5,
  },
  content: {
    padding: SPACING.md,
  },
  columnHeaders: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
    paddingHorizontal: SPACING.xs,
  },
  headerText: {
    color: COLORS.mutedForeground,
    fontSize: 10,
    fontFamily: FONTS.bold,
    textAlign: 'center',
    letterSpacing: 1,
  },
});
