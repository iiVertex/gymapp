import React, { useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useHistoryStore } from '@/stores/historyStore';
import { Workout } from '@/types/workout';
import { format } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { FONTS } from '@/theme';

export const WorkoutHistoryScreen = ({ navigation }: any) => {
  const { workouts, fetchHistory, isLoading } = useHistoryStore();
  const { theme } = useTheme();

  useFocusEffect(
    useCallback(() => {
      fetchHistory();
    }, [])
  );

  const renderWorkoutItem = ({ item }: { item: Workout }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.colors.card }]}
      onPress={() => {
        navigation.navigate('WorkoutDetails', { workoutId: item.id });
      }}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.foreground }]}>{item.name}</Text>
        <Text style={[styles.date, { color: theme.colors.mutedForeground }]}>
          {format(item.startTime, 'MMM d, yyyy')}
        </Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Ionicons name="barbell-outline" size={16} color={theme.colors.primary} />
          <Text style={[styles.statText, { color: theme.colors.foreground }]}>
            {item.volume} kg
          </Text>
        </View>
        <View style={styles.stat}>
          <Ionicons name="list-outline" size={16} color={theme.colors.primary} />
          <Text style={[styles.statText, { color: theme.colors.foreground }]}>
            {item.exercises.length} Exercises
          </Text>
        </View>
      </View>

      {item.selfRating && (
        <View style={styles.ratingContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Ionicons
              key={star}
              name={star <= item.selfRating! ? "star" : "star-outline"}
              size={14}
              color="#FFD700"
            />
          ))}
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.screenHeader}>
        <Text style={[styles.screenTitle, { color: theme.colors.foreground }]}>Workout History</Text>
      </View>
      <FlatList
        data={workouts}
        renderItem={renderWorkoutItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={fetchHistory} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.colors.mutedForeground }]}>
              No workouts recorded yet.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
  },
  screenHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  screenTitle: {
    fontSize: 24,
    fontFamily: FONTS.bold,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontFamily: FONTS.bold,
  },
  date: {
    fontSize: 14,
    fontFamily: FONTS.sans,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    marginLeft: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginTop: 4,
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontFamily: FONTS.sans,
  }
});
