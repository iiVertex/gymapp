import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, RADIUS, SPACING, FONTS, FONT_SIZES, FONT_WEIGHTS } from '@/theme';
import { WorkoutExercise } from '@/types/workout';
import { WorkoutSet } from '@/types/set';
import { Badge } from '@/components/atoms/Badge';

interface ExerciseBreakdownCardProps {
  exercise: WorkoutExercise;
  isPR?: boolean;
}

export const ExerciseBreakdownCard: React.FC<ExerciseBreakdownCardProps> = ({ exercise, isPR }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.name}>{exercise.exercise.name}</Text>
          <Text style={styles.muscle}>{exercise.exercise.muscleGroup}</Text>
        </View>
        {isPR && (
          <View style={styles.prBadge}>
            <Text style={styles.prText}>PR</Text>
          </View>
        )}
      </View>

      <View style={styles.tableHeader}>
        <Text style={[styles.col, styles.colSet]}>SET</Text>
        <Text style={[styles.col, styles.colKg]}>KG</Text>
        <Text style={[styles.col, styles.colReps]}>REPS</Text>
      </View>

      {exercise.sets.map((set, index) => (
        <View key={set.id || index} style={styles.row}>
          <View style={[styles.colSet, styles.setBadgeContainer]}>
            <Text style={styles.setNumber}>{index + 1}</Text>
            {set.type !== 'Normal' && (
              <Text style={styles.setType}>{set.type.charAt(0)}</Text>
            )}
          </View>
          <Text style={[styles.col, styles.colKg]}>{set.weight}</Text>
          <Text style={[styles.col, styles.colReps]}>{set.reps}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  name: {
    color: COLORS.foreground,
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    marginBottom: 2,
  },
  muscle: {
    color: COLORS.mutedForeground,
    fontSize: FONT_SIZES.xs,
    textTransform: 'uppercase',
  },
  prBadge: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
  prText: {
    color: '#22c55e',
    fontSize: FONT_SIZES.xs,
    fontWeight: 'bold',
  },
  tableHeader: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
    paddingBottom: SPACING.xs,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: SPACING.xs,
  },
  col: {
    color: COLORS.foreground,
    fontSize: FONT_SIZES.base,
  },
  colSet: {
    width: 50,
    color: COLORS.mutedForeground,
  },
  colKg: {
    flex: 1,
    textAlign: 'center',
  },
  colReps: {
    flex: 1,
    textAlign: 'center',
  },
  setBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  setNumber: {
    color: COLORS.mutedForeground,
  },
  setType: {
    fontSize: 8,
    color: COLORS.primary,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  }
});
