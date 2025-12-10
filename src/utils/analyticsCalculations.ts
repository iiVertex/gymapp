import { Workout } from '@/types/workout';
import { GraphData, GraphConfig } from '@/types/analytics';
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval, eachWeekOfInterval } from 'date-fns';

export const calculateWeeklyVolume = (workouts: Workout[], timeRange: string): GraphData => {
    const now = Date.now();
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365;
    const startDate = subDays(now, days);

    // Group workouts by day
    const volumeByDay: Record<string, number> = {};

    workouts.forEach(workout => {
        if (workout.endTime && workout.endTime >= startDate.getTime()) {
            const day = format(workout.endTime, 'MMM d');
            volumeByDay[day] = (volumeByDay[day] || 0) + workout.volume;
        }
    });

    const labels = Object.keys(volumeByDay).slice(-7); // Last 7 days
    const data = labels.map(label => volumeByDay[label] || 0);

    return {
        labels,
        datasets: [{ data }]
    };
};

export const calculateWorkoutFrequency = (workouts: Workout[], timeRange: string): GraphData => {
    const now = Date.now();
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365;
    const startDate = subDays(now, days);

    // Group by week
    const weeks = eachWeekOfInterval({ start: startDate, end: now });
    const labels = weeks.map(week => format(week, 'MMM d'));
    const data = weeks.map(weekStart => {
        const weekEnd = endOfWeek(weekStart);
        return workouts.filter(w =>
            w.endTime &&
            w.endTime >= weekStart.getTime() &&
            w.endTime <= weekEnd.getTime()
        ).length;
    });

    return {
        labels: labels.slice(-8), // Last 8 weeks
        datasets: [{ data: data.slice(-8) }]
    };
};

export const getExerciseProgress = (workouts: Workout[], exerciseId: string): GraphData => {
    const exerciseData: { date: number; maxWeight: number }[] = [];

    workouts.forEach(workout => {
        const exercise = workout.exercises.find(ex => ex.exerciseId === exerciseId);
        if (exercise && workout.endTime) {
            const maxWeight = Math.max(...exercise.sets.map(s => s.weight));
            exerciseData.push({ date: workout.endTime, maxWeight });
        }
    });

    // Sort by date and take last 10
    exerciseData.sort((a, b) => a.date - b.date);
    const recent = exerciseData.slice(-10);

    return {
        labels: recent.map(d => format(d.date, 'MMM d')),
        datasets: [{ data: recent.map(d => d.maxWeight) }]
    };
};

export const getPersonalRecords = (workouts: Workout[]): GraphData => {
    const recordsByExercise: Record<string, { name: string; maxWeight: number }> = {};

    workouts.forEach(workout => {
        workout.exercises.forEach(exercise => {
            const maxWeight = Math.max(...exercise.sets.map(s => s.weight));
            const current = recordsByExercise[exercise.exerciseId];

            if (!current || maxWeight > current.maxWeight) {
                recordsByExercise[exercise.exerciseId] = {
                    name: exercise.exercise.name,
                    maxWeight
                };
            }
        });
    });

    // Get top 5
    const top5 = Object.values(recordsByExercise)
        .sort((a, b) => b.maxWeight - a.maxWeight)
        .slice(0, 5);

    return {
        labels: top5.map(r => r.name.length > 15 ? r.name.substring(0, 15) + '...' : r.name),
        datasets: [{ data: top5.map(r => r.maxWeight) }]
    };
};

export const getMuscleGroupDistribution = (workouts: Workout[]): GraphData => {
    const volumeByMuscle: Record<string, number> = {};

    workouts.forEach(workout => {
        workout.exercises.forEach(exercise => {
            const muscle = exercise.exercise.muscleGroup;
            const volume = exercise.sets.reduce((sum, set) => sum + (set.weight * set.reps), 0);
            volumeByMuscle[muscle] = (volumeByMuscle[muscle] || 0) + volume;
        });
    });

    const labels = Object.keys(volumeByMuscle);
    const data = labels.map(label => volumeByMuscle[label]);

    return { labels, datasets: [{ data }] };
};

export const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
};
