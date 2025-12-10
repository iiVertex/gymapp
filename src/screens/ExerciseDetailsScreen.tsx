import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { COLORS } from '@/theme';
import { ArrowLeft, Dumbbell, Activity, BarChart } from 'lucide-react-native';
import { useExerciseStore } from '@/stores/exerciseStore';

export const ExerciseDetailsScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { exerciseId } = route.params;
  const exercise = useExerciseStore(state => state.exercises.find(e => e.id === exerciseId));

  if (!exercise) {
    return (
      <View style={styles.container}>
        <Text style={{ color: COLORS.foreground }}>Exercise not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft color={COLORS.foreground} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{exercise.name}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Placeholder for Exercise Image/GIF */}
        <View style={styles.imageContainer}>
          <Dumbbell size={64} color={COLORS.mutedForeground} />
          <Text style={styles.imagePlaceholderText}>Exercise Demonstration</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Instructions</Text>
          <Text style={styles.text}>
            {exercise.instructions || 'No instructions available for this exercise yet.'}
          </Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Activity color={COLORS.primary} size={24} />
            <Text style={styles.statLabel}>Muscles</Text>
            <Text style={styles.statValue}>{exercise.muscleGroup}</Text>
          </View>

          <View style={styles.statItem}>
            <BarChart color={COLORS.primary} size={24} />
            <Text style={styles.statLabel}>Difficulty</Text>
            <Text style={styles.statValue}>Intermediate</Text>
          </View>

          <View style={styles.statItem}>
            <Dumbbell color={COLORS.primary} size={24} />
            <Text style={styles.statLabel}>Equipment</Text>
            <Text style={styles.statValue}>Dumbbells</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>Add to Routine</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 16,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.foreground,
    flex: 1,
  },
  content: {
    padding: 20,
  },
  imageContainer: {
    height: 200,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  imagePlaceholderText: {
    color: COLORS.mutedForeground,
    marginTop: 12,
    fontSize: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.foreground,
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    color: COLORS.mutedForeground,
    lineHeight: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    backgroundColor: COLORS.card,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    color: COLORS.mutedForeground,
    fontSize: 12,
    marginTop: 8,
    marginBottom: 4,
  },
  statValue: {
    color: COLORS.foreground,
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  addButtonText: {
    color: COLORS.primaryForeground,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
