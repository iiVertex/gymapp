import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Workout } from '@/types/workout';
import { zustandStorage } from '@/utils/storage';
import { workoutService } from '@/services/workoutService';

interface HistoryState {
  workouts: Workout[];
  isLoading: boolean;
  addWorkout: (workout: Workout) => void;
  getWorkoutById: (id: string) => Workout | undefined;
  getLastWorkout: () => Workout | undefined;
  fetchHistory: () => Promise<void>;
  deleteWorkout: (id: string) => Promise<void>;
  updateWorkoutName: (id: string, name: string) => Promise<void>;
  clearHistory: () => void;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      workouts: [],
      isLoading: false,
      addWorkout: (workout) =>
        set((state) => ({ workouts: [workout, ...state.workouts] })),
      getWorkoutById: (id) => get().workouts.find((w) => w.id === id),
      getLastWorkout: () => get().workouts[0],
      clearHistory: () => set({ workouts: [] }),
      fetchHistory: async () => {
        set({ isLoading: true });
        try {
            const data = await workoutService.getHistory();
            // Transform Supabase data to Workout type if necessary
            // For now assuming the structure matches or we map it
            // The Supabase return type needs to be mapped to our Workout interface
            
            const mappedWorkouts: Workout[] = data.map((session: any) => {
                // Calculate volume
                let sessionVolume = 0;
                session.workout_exercises.forEach((ex: any) => {
                    ex.workout_sets.forEach((s: any) => {
                        if (s.weight && s.reps) {
                            sessionVolume += s.weight * s.reps;
                        }
                    });
                });

                return {
                    id: session.id,
                    name: session.name,
                    startTime: new Date(session.started_at).getTime(),
                    endTime: session.completed_at ? new Date(session.completed_at).getTime() : undefined,
                    volume: sessionVolume,
                    status: 'completed',
                    notes: session.notes,
                    selfRating: session.self_rating,
                    restTimerUsed: session.rest_timer_used,
                    exercises: session.workout_exercises.map((ex: any) => ({
                        id: ex.id,
                        exerciseId: ex.exercise_id,
                        exercise: { 
                            id: ex.exercise_id, 
                            name: ex.exercise_name, 
                            muscleGroup: ex.muscle_group 
                        },
                        notes: ex.notes,
                        orderIndex: ex.order_index,
                        sets: ex.workout_sets.map((s: any) => ({
                            id: s.id,
                            weight: s.weight,
                            reps: s.reps,
                            completed: true, // History implies completed
                            type: s.is_warmup ? 'Warmup' : s.is_drop_set ? 'Drop' : s.is_failure ? 'Failure' : 'Normal',
                            isWarmup: s.is_warmup,
                            isDropSet: s.is_drop_set,
                            isFailure: s.is_failure,
                            restTime: s.rest_time_seconds
                        })).sort((a: any, b: any) => a.set_number - b.set_number)
                    })).sort((a: any, b: any) => a.orderIndex - b.orderIndex)
                };
            });

            set({ workouts: mappedWorkouts, isLoading: false });
        } catch (error) {
            console.error('Failed to fetch history:', error);
            set({ isLoading: false });
        }
      },
      deleteWorkout: async (id: string) => {
        try {
            await workoutService.deleteWorkout(id);
            set((state) => ({
                workouts: state.workouts.filter((w) => w.id !== id)
            }));
        } catch (error) {
            console.error('Failed to delete workout:', error);
            throw error;
        }
      },
      updateWorkoutName: async (id: string, name: string) => {
        try {
            await workoutService.updateWorkoutName(id, name);
            set((state) => ({
                workouts: state.workouts.map((w) => 
                    w.id === id ? { ...w, name } : w
                )
            }));
        } catch (error) {
            console.error('Failed to update workout name:', error);
            throw error;
        }
      }
    }),
    {
      name: 'history-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
