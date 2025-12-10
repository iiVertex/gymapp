import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { useHistoryStore } from '@/stores/historyStore';
import { COLORS, SPACING, FONTS, FONT_SIZES, FONT_WEIGHTS, RADIUS } from '@/theme';
import { format } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/atoms/Button';
import { SessionSummaryCard } from '@/components/molecules/SessionSummaryCard';
import { ExerciseBreakdownCard } from '@/components/molecules/ExerciseBreakdownCard';
import { workoutAnalysis } from '@/utils/workoutAnalysis';

type Props = NativeStackScreenProps<RootStackParamList, 'WorkoutDetails'>;

export const WorkoutDetailsScreen = () => {
  const route = useRoute<Props['route']>();
  const navigation = useNavigation();
  const { getWorkoutById, workouts, deleteWorkout, updateWorkoutName } = useHistoryStore();
  const { workoutId } = route.params;
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');

  const workout = getWorkoutById(workoutId);

  const stats = useMemo(() => {
    if (!workout) return null;
    return {
      prCount: workoutAnalysis.getPRCount(workout, workouts),
      consistency: workoutAnalysis.getWeeklyConsistency(workout, workouts),
      progress: workoutAnalysis.getProgressVsLast(workout, workouts),
      intensity: workoutAnalysis.getIntensityScore(workout)
    };
  }, [workout, workouts]);

  const handleDelete = () => {
    Alert.alert(
      "Delete Workout",
      "Are you sure you want to delete this workout? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteWorkout(workoutId);
              navigation.goBack();
            } catch (error) {
              Alert.alert("Error", "Failed to delete workout");
            }
          }
        }
      ]
    );
  };

  const handleSaveName = async () => {
    if (!editedName.trim()) {
      setIsEditing(false);
      return;
    }
    try {
      await updateWorkoutName(workoutId, editedName);
      setIsEditing(false);
    } catch (error) {
      Alert.alert("Error", "Failed to update workout name");
    }
  };

  const startEditing = () => {
    if (workout) {
      setEditedName(workout.name);
      setIsEditing(true);
    }
  };

  if (!workout || !stats) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Workout not found</Text>
        <Button label="Go Back" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <Button
          variant="ghost"
          size="icon"
          icon={<Ionicons name="arrow-back" size={24} color={COLORS.foreground} />}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle}>WORKOUT DETAILS</Text>
        <Button
          variant="ghost"
          size="icon"
          icon={<Ionicons name="trash-outline" size={24} color={COLORS.destructive} />}
          onPress={handleDelete}
        />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerSection}>
          {isEditing ? (
            <View style={styles.editNameContainer}>
              <TextInput
                style={styles.nameInput}
                value={editedName}
                onChangeText={setEditedName}
                autoFocus
                onBlur={handleSaveName}
                onSubmitEditing={handleSaveName}
                placeholderTextColor={COLORS.mutedForeground}
              />
              <TouchableOpacity onPress={handleSaveName} style={styles.saveButton}>
                <Ionicons name="checkmark" size={24} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={startEditing} style={styles.nameContainer}>
              <Text style={styles.workoutName}>{workout.name}</Text>
              <Ionicons name="pencil" size={18} color={COLORS.mutedForeground} style={styles.editIcon} />
            </TouchableOpacity>
          )}
          <Text style={styles.date}>{format(workout.startTime, 'EEEE, MMMM d, yyyy')}</Text>
        </View>

        <SessionSummaryCard
          prCount={stats.prCount}
          consistency={stats.consistency}
          progressLabel={stats.progress.label}
          isProgressPositive={stats.progress.isPositive}
          intensity={stats.intensity}
        />

        {workout.notes && (
          <View style={styles.notesContainer}>
            <Text style={styles.notesLabel}>Notes</Text>
            <Text style={styles.notesText}>{workout.notes}</Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>EXERCISE BREAKDOWN</Text>

        {workout.exercises.map((exercise, index) => (
          <ExerciseBreakdownCard
            key={exercise.id || index}
            exercise={exercise}
            isPR={workoutAnalysis.isExercisePR(exercise, workout, workouts)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    color: COLORS.foreground,
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.bold,
    letterSpacing: 1,
  },
  content: {
    padding: SPACING.md,
  },
  errorText: {
    color: COLORS.destructive,
    fontSize: FONT_SIZES.lg,
    marginBottom: SPACING.md,
  },
  headerSection: {
    marginBottom: SPACING.lg,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  editNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primary,
  },
  nameInput: {
    flex: 1,
    color: COLORS.foreground,
    fontSize: FONT_SIZES.xxl,
    fontWeight: FONT_WEIGHTS.bold,
    paddingVertical: 0,
  },
  saveButton: {
    padding: SPACING.xs,
  },
  workoutName: {
    color: COLORS.foreground,
    fontSize: FONT_SIZES.xxl,
    fontWeight: FONT_WEIGHTS.bold,
    marginRight: SPACING.sm,
  },
  editIcon: {
    opacity: 0.7,
  },
  date: {
    color: COLORS.mutedForeground,
    fontSize: FONT_SIZES.base,
  },
  notesContainer: {
    backgroundColor: COLORS.card,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  notesLabel: {
    color: COLORS.mutedForeground,
    fontSize: FONT_SIZES.xs,
    fontWeight: 'bold',
    marginBottom: SPACING.xs,
    textTransform: 'uppercase',
  },
  notesText: {
    color: COLORS.foreground,
    fontSize: FONT_SIZES.base,
    lineHeight: 24,
  },
  sectionTitle: {
    color: COLORS.mutedForeground,
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.bold,
    marginBottom: SPACING.md,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});
