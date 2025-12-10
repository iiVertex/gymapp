import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { COLORS, SPACING, FONTS, FONT_SIZES, RADIUS } from '@/theme';
import { Plus, Trash2, Dumbbell } from 'lucide-react-native';
import { Exercise } from '@/types/exercise';
import { RoutineExercise } from '@/types/routine';
import { useRoutineStore } from '@/stores/routineStore';

interface ExerciseConfig {
  exercise: Exercise;
  sets: string;
  reps: string;
  weight: string;
}

export const WorkoutBuilderScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { createRoutine } = useRoutineStore();

  const [routineName, setRoutineName] = useState('');
  const [exerciseConfigs, setExerciseConfigs] = useState<ExerciseConfig[]>([]);

  // Listen for selected exercise from ExerciseLibraryScreen
  useEffect(() => {
    if (route.params?.selectedExercise) {
      const selectedExercise = route.params.selectedExercise;
      // Add exercise if not already in the list
      if (!exerciseConfigs.find(config => config.exercise.id === selectedExercise.id)) {
        setExerciseConfigs([...exerciseConfigs, {
          exercise: selectedExercise,
          sets: '',
          reps: '',
          weight: '',
        }]);
      }
      // Clear the param to avoid re-adding on re-render
      navigation.setParams({ selectedExercise: undefined });
    }
  }, [route.params?.selectedExercise]);

  const updateExerciseConfig = (index: number, field: 'sets' | 'reps' | 'weight', value: string) => {
    const newConfigs = [...exerciseConfigs];
    newConfigs[index][field] = value;
    setExerciseConfigs(newConfigs);
  };

  const removeExercise = (index: number) => {
    const newConfigs = [...exerciseConfigs];
    newConfigs.splice(index, 1);
    setExerciseConfigs(newConfigs);
  };

  const handleSave = async () => {
    if (!routineName.trim()) {
      Alert.alert('Error', 'Please name your routine');
      return;
    }
    if (exerciseConfigs.length === 0) {
      Alert.alert('Error', 'Please add at least one exercise');
      return;
    }

    // Map exercise configs to RoutineExercise format
    const routineExercises: RoutineExercise[] = exerciseConfigs.map((config, index) => ({
      id: `ex-${Date.now()}-${index}`,
      exerciseId: config.exercise.id,
      exercise: config.exercise,
      order: index,
      targetSets: config.sets ? parseInt(config.sets) : undefined,
      targetReps: config.reps ? parseInt(config.reps) : undefined,
      targetWeight: config.weight ? parseFloat(config.weight) : undefined,
    }));

    // Save to routine store
    await createRoutine({
      name: routineName.trim(),
      exercises: routineExercises,
    });

    Alert.alert('Success', 'Routine saved!');
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.headerButtonText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Routine</Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Routine title</Text>
          <TextInput
            style={styles.input}
            value={routineName}
            onChangeText={setRoutineName}
            placeholder="e.g., Monday Chest & Triceps"
            placeholderTextColor={COLORS.mutedForeground}
          />
        </View>

        {exerciseConfigs.length === 0 ? (
          <View style={styles.emptyState}>
            <Dumbbell size={48} color={COLORS.mutedForeground} style={{ marginBottom: 16 }} />
            <Text style={styles.emptyStateSubtext}>
              Get started by adding an exercise to your routine.
            </Text>
            <TouchableOpacity
              style={styles.mainAddButton}
              onPress={() => navigation.navigate('ExerciseLibrary', { isSelectionMode: true })}
            >
              <Plus size={20} color="white" />
              <Text style={styles.mainAddButtonText}>Add exercise</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {exerciseConfigs.map((config, index) => (
              <View key={index} style={styles.exerciseCard}>
                <View style={styles.exerciseHeader}>
                  <Text style={styles.exerciseName}>{config.exercise.name}</Text>
                  <TouchableOpacity onPress={() => removeExercise(index)}>
                    <Trash2 size={20} color={COLORS.destructive} />
                  </TouchableOpacity>
                </View>

                <View style={styles.inputRow}>
                  <View style={styles.inputColumn}>
                    <Text style={styles.inputLabel}>Sets</Text>
                    <TextInput
                      style={styles.numberInput}
                      value={config.sets}
                      onChangeText={(value) => updateExerciseConfig(index, 'sets', value)}
                      placeholder="0"
                      placeholderTextColor={COLORS.mutedForeground}
                      keyboardType="numeric"
                    />
                  </View>

                  <View style={styles.inputColumn}>
                    <Text style={styles.inputLabel}>Weight</Text>
                    <TextInput
                      style={styles.numberInput}
                      value={config.weight}
                      onChangeText={(value) => updateExerciseConfig(index, 'weight', value)}
                      placeholder="0"
                      placeholderTextColor={COLORS.mutedForeground}
                      keyboardType="decimal-pad"
                    />
                  </View>

                  <View style={styles.inputColumn}>
                    <Text style={styles.inputLabel}>Reps</Text>
                    <TextInput
                      style={styles.numberInput}
                      value={config.reps}
                      onChangeText={(value) => updateExerciseConfig(index, 'reps', value)}
                      placeholder="0"
                      placeholderTextColor={COLORS.mutedForeground}
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              </View>
            ))}

            <TouchableOpacity
              style={styles.addMoreButton}
              onPress={() => navigation.navigate('ExerciseLibrary', { isSelectionMode: true })}
            >
              <Plus size={20} color={COLORS.primary} />
              <Text style={styles.addMoreText}>Add Exercise</Text>
            </TouchableOpacity>
          </>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: FONT_SIZES.xl,
    fontFamily: FONTS.bold,
    color: COLORS.foreground,
  },
  headerButtonText: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.base,
    fontFamily: FONTS.medium,
  },
  saveButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  saveButtonText: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.base,
    fontFamily: FONTS.bold,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
  },
  inputGroup: {
    marginBottom: SPACING.xl,
  },
  label: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONTS.medium,
    color: COLORS.mutedForeground,
    marginBottom: SPACING.sm,
  },
  input: {
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingVertical: SPACING.md,
    color: COLORS.foreground,
    fontSize: FONT_SIZES.lg,
    fontFamily: FONTS.medium,
  },
  emptyState: {
    marginTop: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateSubtext: {
    color: COLORS.mutedForeground,
    fontSize: FONT_SIZES.base,
    fontFamily: FONTS.sans,
    textAlign: 'center',
    marginBottom: SPACING.xxxl,
    paddingHorizontal: 40,
  },
  mainAddButton: {
    backgroundColor: COLORS.primary,
    width: '100%',
    padding: SPACING.lg,
    borderRadius: RADIUS.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  mainAddButtonText: {
    color: COLORS.primaryForeground,
    fontSize: FONT_SIZES.base,
    fontFamily: FONTS.bold,
  },
  exerciseCard: {
    backgroundColor: COLORS.card,
    padding: SPACING.lg,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  exerciseName: {
    color: COLORS.foreground,
    fontSize: FONT_SIZES.lg,
    fontFamily: FONTS.bold,
    flex: 1,
  },
  inputRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  inputColumn: {
    flex: 1,
  },
  inputLabel: {
    fontSize: FONT_SIZES.xs,
    fontFamily: FONTS.medium,
    color: COLORS.mutedForeground,
    marginBottom: SPACING.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  numberInput: {
    backgroundColor: COLORS.input,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    padding: SPACING.md,
    color: COLORS.foreground,
    fontSize: FONT_SIZES.lg,
    fontFamily: FONTS.bold,
    textAlign: 'center',
  },
  addMoreButton: {
    backgroundColor: COLORS.card,
    padding: SPACING.lg,
    borderRadius: RADIUS.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: SPACING.sm,
  },
  addMoreText: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.base,
    fontFamily: FONTS.semibold,
  },
});
