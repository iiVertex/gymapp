import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { useExerciseStore } from '@/stores/exerciseStore';
import { useWorkoutStore } from '@/stores/workoutStore';
import { COLORS, SPACING, FONTS, FONT_SIZES, FONT_WEIGHTS, RADIUS } from '@/theme';
import { Search, ArrowLeft, Plus } from 'lucide-react-native';
import { MuscleGroup } from '@/types/exercise';

const MUSCLE_GROUPS: (MuscleGroup | 'All')[] = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core'];

export const ExerciseLibraryScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'ExerciseLibrary'>>();
  const isSelectionMode = route.params?.isSelectionMode || false;

  const { exercises, searchExercises } = useExerciseStore();
  const { addExercise } = useWorkoutStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | 'All'>('All');

  const filteredExercises = useMemo(() => {
    let result = exercises;

    if (searchQuery) {
      result = result.filter(e => e.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    if (selectedMuscle !== 'All') {
      result = result.filter(e => e.muscleGroup === selectedMuscle || e.secondaryMuscles?.includes(selectedMuscle));
    }

    return result;
  }, [exercises, searchQuery, selectedMuscle]);

  const handleSelectExercise = (exercise: any) => {
    if (isSelectionMode) {
      // Check if we're in the active workout flow or routine builder flow
      const previousRoute = navigation.getState().routes[navigation.getState().index - 1];

      if (previousRoute?.name === 'WorkoutBuilder') {
        // Pass exercise back to WorkoutBuilder
        navigation.navigate('WorkoutBuilder', { selectedExercise: exercise });
      } else {
        // Add to active workout
        addExercise(exercise);
        navigation.goBack();
      }
    } else {
      // Navigate to exercise details (not implemented yet)
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color={COLORS.foreground} />
        </TouchableOpacity>
        <Text style={styles.title}>Exercises</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.searchContainer}>
        <Search size={20} color={COLORS.mutedForeground} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search exercises"
          placeholderTextColor={COLORS.mutedForeground}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.filterContainer}>
        <FlatList
          horizontal
          data={MUSCLE_GROUPS}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterList}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterChip,
                selectedMuscle === item && styles.filterChipActive
              ]}
              onPress={() => setSelectedMuscle(item)}
            >
              <Text style={[
                styles.filterText,
                selectedMuscle === item && styles.filterTextActive
              ]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <FlatList
        data={filteredExercises}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.exerciseItem}
            onPress={() => handleSelectExercise(item)}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.exerciseName}>{item.name}</Text>
              <View style={styles.tagsContainer}>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>{item.muscleGroup}</Text>
                </View>
                {item.secondaryMuscles?.map((muscle) => (
                  <View key={muscle} style={[styles.tag, styles.secondaryTag]}>
                    <Text style={styles.tagText}>{muscle}</Text>
                  </View>
                ))}
              </View>
            </View>
            {isSelectionMode && (
              <Plus size={20} color={COLORS.primary} />
            )}
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    padding: SPACING.sm,
    marginLeft: -SPACING.sm,
  },
  title: {
    fontSize: FONT_SIZES.xl,
    color: COLORS.foreground,
    fontFamily: FONTS.bold,
  },
  searchContainer: {
    padding: SPACING.md,
    position: 'relative',
  },
  searchIcon: {
    position: 'absolute',
    left: SPACING.lg + SPACING.sm,
    top: SPACING.md + 14,
    zIndex: 1,
  },
  searchInput: {
    backgroundColor: COLORS.card,
    height: 48,
    borderRadius: RADIUS.lg,
    paddingLeft: 48,
    paddingRight: SPACING.md,
    color: COLORS.foreground,
    fontSize: FONT_SIZES.base,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterContainer: {
    paddingBottom: SPACING.md,
  },
  filterList: {
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
  },
  filterChip: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.card,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
  },
  filterText: {
    color: COLORS.foreground,
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
  },
  filterTextActive: {
    color: COLORS.primaryForeground,
  },
  listContent: {
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  exerciseItem: {
    backgroundColor: COLORS.card,
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  exerciseName: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.foreground,
    marginBottom: 8,
  },
  exerciseMuscle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.mutedForeground,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tagText: {
    fontSize: 10,
    color: COLORS.mutedForeground,
    fontWeight: '600',
  },
  secondaryTag: {
    opacity: 0.7,
  },
});
