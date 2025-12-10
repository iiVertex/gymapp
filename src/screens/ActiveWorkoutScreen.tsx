import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { useWorkoutStore } from '@/stores/workoutStore';
import { useRoutineStore } from '@/stores/routineStore';
import { ExerciseBlock } from '@/components/organisms/ExerciseBlock';
import { Button } from '@/components/atoms/Button';
import { COLORS, SPACING, FONTS, FONT_SIZES, FONT_WEIGHTS, RADIUS } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import { Search, MoreHorizontal, Plus, ChevronDown } from 'lucide-react-native';

export const ActiveWorkoutScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { routines, fetchRoutines } = useRoutineStore();
  const { activeWorkout, finishWorkout, cancelWorkout, updateWorkoutName, startWorkout, startWorkoutFromRoutine } = useWorkoutStore();
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [isRoutinesExpanded, setIsRoutinesExpanded] = useState(true);

  React.useEffect(() => {
    fetchRoutines();
  }, []);

  const handleFinish = async () => {
    try {
      await finishWorkout();
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        navigation.navigate('Main', { screen: 'Dashboard' });
      }
    } catch (error) {
      console.error("Error finishing workout:", error);
    }
  };

  const handleCancel = () => {
    cancelWorkout();
    navigation.goBack();
  };

  const startEditingName = () => {
    if (activeWorkout) {
      setEditedName(activeWorkout.name);
      setIsEditingName(true);
    }
  };

  const saveName = () => {
    if (editedName.trim()) {
      updateWorkoutName(editedName.trim());
    }
    setIsEditingName(false);
  };

  if (!activeWorkout) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.hubHeader}>
          <Text style={styles.hubTitle}>Workout</Text>
          <View style={styles.hubHeaderRight}>
            <Ionicons name="refresh-outline" size={20} color={COLORS.mutedForeground} />
            <View style={styles.proBadge}>
              <Text style={styles.proText}>PRO</Text>
            </View>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.hubContent}>
          <TouchableOpacity
            style={styles.startEmptyButton}
            onPress={() => startWorkout('Empty Workout')}
          >
            <Plus size={24} color={COLORS.foreground} />
            <Text style={styles.startEmptyText}>Start Empty Workout</Text>
          </TouchableOpacity>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Routines</Text>
            <TouchableOpacity onPress={() => navigation.navigate('WorkoutBuilder', {})}>
              <Ionicons name="add-outline" size={24} color={COLORS.foreground} />
            </TouchableOpacity>
          </View>

          <View style={styles.actionButtonsRow}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('WorkoutBuilder', {})}
            >
              <Ionicons name="clipboard-outline" size={20} color={COLORS.foreground} />
              <Text style={styles.actionButtonText}>New Routine</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Search size={20} color={COLORS.foreground} />
              <Text style={styles.actionButtonText}>Explore</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.myRoutinesHeader}
            onPress={() => setIsRoutinesExpanded(!isRoutinesExpanded)}
          >
            <ChevronDown
              size={16}
              color={COLORS.mutedForeground}
              style={{ transform: [{ rotate: isRoutinesExpanded ? '0deg' : '-90deg' }] }}
            />
            <Text style={styles.myRoutinesTitle}>My Routines ({routines.length})</Text>
          </TouchableOpacity>

          {isRoutinesExpanded && (
            <View style={styles.routinesList}>
              {routines.length === 0 ? (
                <View style={styles.emptyRoutines}>
                  <Text style={styles.emptyRoutinesText}>No routines yet. Create one to get started!</Text>
                </View>
              ) : (
                routines.map(routine => (
                  <View key={routine.id} style={styles.routineCard}>
                    <View style={styles.routineCardHeader}>
                      <View>
                        <Text style={styles.routineName}>{routine.name}</Text>
                        <Text style={styles.routineSubtext}>
                          {routine.exercises.length > 0
                            ? `${routine.exercises[0].exercise.name}${routine.exercises.length > 1 ? ` + ${routine.exercises.length - 1} more` : ''}`
                            : 'No exercises'}
                        </Text>
                      </View>
                      <TouchableOpacity>
                        <MoreHorizontal size={20} color={COLORS.mutedForeground} />
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                      style={styles.startRoutineButton}
                      onPress={() => startWorkoutFromRoutine(routine)}
                    >
                      <Text style={styles.startRoutineText}>Start Routine</Text>
                    </TouchableOpacity>
                  </View>
                ))
              )}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>LOGGING</Text>
          <View style={styles.workoutNameWrapper}>
            {isEditingName ? (
              <View style={styles.editNameContainer}>
                <TextInput
                  style={styles.nameInput}
                  value={editedName}
                  onChangeText={setEditedName}
                  autoFocus
                  onBlur={saveName}
                  onSubmitEditing={saveName}
                  placeholderTextColor={COLORS.mutedForeground}
                />
                <TouchableOpacity onPress={saveName} style={styles.iconButton}>
                  <Ionicons name="checkmark" size={28} color={COLORS.primary} />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity onPress={startEditingName} style={styles.nameContainer}>
                <Text style={styles.workoutName} numberOfLines={1} ellipsizeMode="tail">
                  {activeWorkout.name}
                </Text>
                <Ionicons name="pencil" size={20} color={COLORS.mutedForeground} style={{ marginLeft: 8 }} />
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View style={styles.headerButtons}>
          <Button
            variant="ghost"
            size="icon"
            icon={<Ionicons name="close" size={32} color={COLORS.mutedForeground} />}
            onPress={handleCancel}
          />
          <Button
            label="Finish"
            size="md"
            onPress={handleFinish}
            style={styles.finishButton}
          />
        </View>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeWorkout.exercises.map((exercise) => (
          <ExerciseBlock key={exercise.id} exercise={exercise} />
        ))}

        <Button
          variant="secondary"
          label="Add Exercise"
          onPress={() => navigation.navigate('ExerciseLibrary', { isSelectionMode: true })}
          style={styles.addExerciseButton}
        />

        <View style={{ height: 100 }} />
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
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: 'rgba(9, 9, 11, 0.8)',
  },
  headerLeft: {
    flex: 1,
    marginRight: SPACING.md,
  },
  headerTitle: {
    color: COLORS.mutedForeground,
    fontSize: 13,
    fontFamily: FONTS.bold,
    letterSpacing: 1,
    marginBottom: 5,
  },
  workoutNameWrapper: {
    height: 32,
    justifyContent: 'flex-end',
  },
  workoutName: {
    color: COLORS.foreground,
    fontSize: 22,
    fontFamily: FONTS.bold,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
  },
  editNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primary,
    height: '100%',
  },
  nameInput: {
    flex: 1,
    color: COLORS.foreground,
    fontSize: 22,
    fontFamily: FONTS.bold,
    padding: 0,
  },
  iconButton: {
    padding: 4,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    gap: SPACING.sm,
  },
  finishButton: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.md,
  },
  addExerciseButton: {
    marginTop: SPACING.md,
    paddingVertical: SPACING.lg,
    borderRadius: 999,
  },
  // Hub Styles
  hubHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  hubTitle: {
    fontSize: 32,
    fontFamily: FONTS.bold,
    color: COLORS.foreground,
  },
  hubHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  proBadge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  proText: {
    color: 'black',
    fontSize: 12,
    fontWeight: 'bold',
  },
  hubContent: {
    padding: SPACING.lg,
  },
  startEmptyButton: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  startEmptyText: {
    color: COLORS.foreground,
    fontSize: FONT_SIZES.lg,
    fontFamily: FONTS.medium,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.xl,
    fontFamily: FONTS.bold,
    color: COLORS.foreground,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  actionButton: {
    flex: 1,
    backgroundColor: COLORS.card,
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  actionButtonText: {
    color: COLORS.foreground,
    fontSize: FONT_SIZES.base,
    fontFamily: FONTS.medium,
  },
  myRoutinesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.md,
  },
  myRoutinesTitle: {
    color: COLORS.mutedForeground,
    fontSize: FONT_SIZES.base,
  },
  routinesList: {
    gap: SPACING.md,
  },
  routineCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  routineCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.lg,
  },
  routineName: {
    color: COLORS.foreground,
    fontSize: FONT_SIZES.lg,
    fontFamily: FONTS.bold,
    marginBottom: 4,
  },
  routineSubtext: {
    color: COLORS.mutedForeground,
    fontSize: FONT_SIZES.sm,
  },
  startRoutineButton: {
    backgroundColor: COLORS.primary,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  startRoutineText: {
    color: COLORS.primaryForeground,
    fontSize: FONT_SIZES.base,
    fontFamily: FONTS.bold,
  },
  emptyRoutines: {
    padding: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  emptyRoutinesText: {
    color: COLORS.mutedForeground,
    fontSize: FONT_SIZES.base,
    textAlign: 'center',
  },
});
