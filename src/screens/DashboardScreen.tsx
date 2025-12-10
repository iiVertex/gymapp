import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { useWorkoutStore } from '@/stores/workoutStore';
import { useHistoryStore } from '@/stores/historyStore';
import { Button } from '@/components/atoms/Button';
import { COLORS, SPACING, FONTS, FONT_SIZES, RADIUS } from '@/theme';
import { Play, Activity } from 'lucide-react-native';
import { useAnalyticsStore } from '@/stores/analyticsStore';
import { GraphCard } from '@/components/molecules/GraphCard';
import { AddGraphButton } from '@/components/molecules/AddGraphButton';
import { GraphSelectorSheet } from '@/components/organisms/GraphSelectorSheet';

export const DashboardScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { startWorkout } = useWorkoutStore();
  const { getLastWorkout, fetchHistory } = useHistoryStore();
  const { graphs, addGraph, removeGraph } = useAnalyticsStore();
  const [showGraphSelector, setShowGraphSelector] = React.useState(false);
  const lastWorkout = getLastWorkout();

  React.useEffect(() => {
    fetchHistory();
  }, []);

  const handleStartWorkout = () => {
    navigation.navigate('ActiveWorkout');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Dashboard</Text>
          <Text style={styles.subtitle}>Welcome back, Alex</Text>
        </View>

        <Button
          label="Log Workout"
          size="lg"
          icon={
            <View style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <Play size={24} color="white" fill="white" style={{ marginLeft: 4 }} />
            </View>
          }
          onPress={handleStartWorkout}
          style={styles.startButton}
        />

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardLabel}>LAST SESSION</Text>
              <View style={styles.lastSessionInfo}>
                <Text style={styles.lastSessionDate}>
                  {lastWorkout ? new Date(lastWorkout.endTime!).toLocaleDateString() : 'No workouts yet'}
                </Text>
                {lastWorkout && (
                  <>
                    <View style={styles.dot} />
                    <Text style={styles.lastSessionName}>{lastWorkout.name}</Text>
                  </>
                )}
              </View>
            </View>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{lastWorkout ? lastWorkout.exercises.length : 0}</Text>
              <Text style={styles.statLabel}>Exercises</Text>
            </View>
            <View style={[styles.statItem, styles.statBorder]}>
              <Text style={styles.statValue}>
                {lastWorkout
                  ? lastWorkout.volume >= 10000
                    ? `${Math.round(lastWorkout.volume / 1000)}k`
                    : lastWorkout.volume
                  : 0}
              </Text>
              <Text style={styles.statLabel}>Vol (kg)</Text>
            </View>
          </View>
        </View>

        {/* User's Custom Graphs */}
        {graphs.map((config) => (
          <GraphCard
            key={config.id}
            config={config}
            onRemove={() => removeGraph(config.id)}
          />
        ))}

        {/* Add Graph Button */}
        <AddGraphButton onPress={() => setShowGraphSelector(true)} />

      </ScrollView>

      {/* Graph Selector Modal */}
      <GraphSelectorSheet
        visible={showGraphSelector}
        onClose={() => setShowGraphSelector(false)}
        onSelect={(type) => addGraph(type)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: 100,
  },
  header: {
    marginTop: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: 32,
    fontFamily: FONTS.bold,
    color: COLORS.foreground,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.mutedForeground,
    marginTop: SPACING.xs,
    fontFamily: FONTS.medium,
  },
  startButton: {
    height: 80,
    borderRadius: RADIUS.xl,
    marginBottom: SPACING.xl,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.xl,
  },
  cardLabel: {
    fontSize: 10,
    fontFamily: FONTS.bold,
    color: COLORS.mutedForeground,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: SPACING.xs,
  },
  lastSessionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lastSessionDate: {
    color: COLORS.foreground,
    fontSize: FONT_SIZES.sm,
    fontFamily: FONTS.medium,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: SPACING.sm,
  },
  lastSessionName: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: FONT_SIZES.sm,
    fontFamily: FONTS.medium,
  },
  statsGrid: {
    flexDirection: 'row',
  },
  statItem: {
    flex: 1,
    gap: 4,
  },
  statBorder: {
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255,255,255,0.05)',
    paddingLeft: SPACING.lg,
  },
  statValue: {
    fontSize: 30,
    fontFamily: FONTS.bold,
    color: COLORS.foreground,
    letterSpacing: -1,
  },
  statLabel: {
    fontSize: 10,
    color: COLORS.mutedForeground,
    fontFamily: FONTS.medium,
  },
});
