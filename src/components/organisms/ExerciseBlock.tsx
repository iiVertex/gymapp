import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { ExerciseCard } from '@/components/molecules/ExerciseCard';
import { SetLogRow } from '@/components/molecules/SetLogRow';
import { Button } from '@/components/atoms/Button';
import { WorkoutExercise } from '@/types/workout';
import { WorkoutSet } from '@/types/set';
import { useWorkoutStore } from '@/stores/workoutStore';
import { Plus } from 'lucide-react-native';
import { SPACING } from '@/theme';

interface ExerciseBlockProps {
  exercise: WorkoutExercise;
}

export const ExerciseBlock: React.FC<ExerciseBlockProps> = React.memo(({ exercise }) => {
  const { addSet, updateSet, completeSet, removeSet } = useWorkoutStore();

  const handleAddSet = useCallback(() => {
    addSet(exercise.id);
  }, [addSet, exercise.id]);

  const handleUpdateSet = useCallback((setId: string, updates: Partial<WorkoutSet>) => {
    updateSet(exercise.id, setId, updates);
  }, [updateSet, exercise.id]);

  const handleCompleteSet = useCallback((setId: string) => {
    completeSet(exercise.id, setId);
  }, [completeSet, exercise.id]);

  const handleRemoveSet = useCallback((setId: string) => {
    removeSet(exercise.id, setId);
  }, [removeSet, exercise.id]);

  return (
    <ExerciseCard exercise={exercise}>
      {exercise.sets.map((set, index) => (
        <SetLogRow
          key={set.id}
          index={index}
          set={set}
          onUpdate={(updates) => handleUpdateSet(set.id, updates)}
          onComplete={() => handleCompleteSet(set.id)}
          onRemove={() => handleRemoveSet(set.id)}
        />
      ))}
      
      <View style={styles.addButtonContainer}>
        <Button
          variant="ghost"
          size="sm"
          label="Add Set"
          icon={<Plus size={16} color="#3b82f6" />}
          onPress={handleAddSet}
          style={styles.addButton}
        />
      </View>
    </ExerciseCard>
  );
});

const styles = StyleSheet.create({
  addButtonContainer: {
    marginTop: SPACING.sm,
  },
  addButton: {
    width: '100%',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
  },
});
