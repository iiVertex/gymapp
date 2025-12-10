import { Workout, WorkoutExercise } from '@/types/workout';
import { isSameWeek, parseISO } from 'date-fns';

export const workoutAnalysis = {
  /**
   * Calculates how many workouts were completed in the current week (including the current one)
   */
  getWeeklyConsistency: (currentWorkout: Workout, history: Workout[]): number => {
    const currentDate = new Date(currentWorkout.startTime);
    return history.filter(w => isSameWeek(new Date(w.startTime), currentDate)).length;
  },

  /**
   * Checks if a specific exercise in the current workout is a PR.
   */
  isExercisePR: (exercise: WorkoutExercise, currentWorkout: Workout, history: Workout[]): boolean => {
    const previousWorkouts = history.filter(w => w.id !== currentWorkout.id && w.startTime < currentWorkout.startTime);
    
    // Get max weight for this exercise in current session
    const currentMax = Math.max(...exercise.sets.map(s => s.weight));
    
    // Get max weight for this exercise in ALL previous history
    let historicalMax = 0;
    previousWorkouts.forEach(w => {
      const matchingEx = w.exercises.find(e => e.exerciseId === exercise.exerciseId);
      if (matchingEx) {
        const exMax = Math.max(...matchingEx.sets.map(s => s.weight));
        if (exMax > historicalMax) historicalMax = exMax;
      }
    });

    return currentMax > historicalMax && historicalMax > 0;
  },

  /**
   * Detects PRs by comparing current sets against all previous history for that exercise.
   * Returns the total count of PRs in the session.
   */
  getPRCount: (currentWorkout: Workout, history: Workout[]): number => {
    let prCount = 0;
    currentWorkout.exercises.forEach(exercise => {
      if (workoutAnalysis.isExercisePR(exercise, currentWorkout, history)) {
        prCount++;
      }
    });
    return prCount;
  },

  /**
   * Compares current session volume vs the most recent previous session.
   * Returns a formatted string like "+500 kg" or "-20 kg"
   */
  getProgressVsLast: (currentWorkout: Workout, history: Workout[]): { label: string; isPositive: boolean } => {
    // Find most recent previous workout
    const previousWorkout = history
        .filter(w => w.id !== currentWorkout.id && w.startTime < currentWorkout.startTime)
        .sort((a, b) => b.startTime - a.startTime)[0];

    if (!previousWorkout) return { label: 'First Session', isPositive: true };

    const diff = currentWorkout.volume - previousWorkout.volume;
    const sign = diff >= 0 ? '+' : '';
    return {
        label: `${sign}${diff} kg`,
        isPositive: diff >= 0
    };
  },

  /**
   * Determines intensity based on Volume.
   * This is a heuristic.
   */
  getIntensityScore: (workout: Workout): 'Low' | 'Moderate' | 'High' => {
    if (workout.volume > 10000) return 'High';
    if (workout.volume > 5000) return 'Moderate';
    return 'Low';
  }
};
