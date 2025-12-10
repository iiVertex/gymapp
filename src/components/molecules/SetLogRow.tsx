import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Input } from '@/components/atoms/Input';
import { COLORS, RADIUS, SPACING, FONTS, FONT_WEIGHTS, FONT_SIZES } from '@/theme';
import { WorkoutSet } from '@/types/set';
import { Check, Copy, Trash2 } from 'lucide-react-native';

interface SetLogRowProps {
  index: number;
  set: WorkoutSet;
  onUpdate: (updates: Partial<WorkoutSet>) => void;
  onComplete: () => void;
  onRemove: () => void;
}

export const SetLogRow: React.FC<SetLogRowProps> = React.memo(({
  index,
  set,
  onUpdate,
  onComplete,
  onRemove,
}) => {
  const handleWeightChange = useCallback((text: string) => {
    const weight = parseFloat(text);
    if (!isNaN(weight)) {
      onUpdate({ weight });
    }
  }, [onUpdate]);

  const handleRepsChange = useCallback((text: string) => {
    const reps = parseFloat(text);
    if (!isNaN(reps)) {
      onUpdate({ reps });
    }
  }, [onUpdate]);

  return (
    <View style={[
      styles.container,
      set.completed && styles.completedContainer
    ]}>
      <View style={styles.setNumberContainer}>
        <Text style={[styles.setNumber, set.completed && styles.completedText]}>
          {index + 1}
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <Input
          defaultValue={set.weight > 0 ? set.weight.toString() : ''}
          placeholder="-"
          keyboardType="numeric"
          onChangeText={handleWeightChange}
          centered
          style={[
            styles.input,
            set.completed && styles.completedInput
          ]}
          editable={!set.completed}
        />
      </View>

      <View style={styles.inputContainer}>
        <Input
          defaultValue={set.reps > 0 ? set.reps.toString() : ''}
          placeholder="-"
          keyboardType="numeric"
          onChangeText={handleRepsChange}
          centered
          style={[
            styles.input,
            set.completed && styles.completedInput
          ]}
          editable={!set.completed}
        />
      </View>

      <TouchableOpacity
        onPress={onComplete}
        style={[
          styles.checkButton,
          set.completed ? styles.checkButtonCompleted : styles.checkButtonActive
        ]}
      >
        <Check
          size={20}
          color={set.completed ? COLORS.primaryForeground : COLORS.mutedForeground}
        />
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    padding: SPACING.xs,
    borderRadius: RADIUS.md,
  },
  completedContainer: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)', // Primary with opacity
    borderColor: 'rgba(59, 130, 246, 0.2)',
    borderWidth: 1,
  },
  setNumberContainer: {
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  setNumber: {
    color: COLORS.mutedForeground,
    fontFamily: FONTS.bold,
    fontSize: 14,
  },
  completedText: {
    color: COLORS.primary,
  },
  inputContainer: {
    flex: 1,
    marginHorizontal: SPACING.xs,
  },
  input: {
    height: 40,
    backgroundColor: COLORS.secondary,
    fontSize: FONT_SIZES.lg,
    paddingVertical: 0,
  },
  completedInput: {
    backgroundColor: 'transparent',
    color: COLORS.foreground,
  },
  checkButton: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SPACING.xs,
  },
  checkButtonActive: {
    backgroundColor: COLORS.secondary,
  },
  checkButtonCompleted: {
    backgroundColor: COLORS.primary,
  },
});
