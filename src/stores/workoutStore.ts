import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Workout, WorkoutExercise } from '@/types/workout';
import { WorkoutSet } from '@/types/set';
import { Exercise } from '@/types/exercise';
import { Routine } from '@/types/routine';
import { zustandStorage } from '@/utils/storage';
import { useHistoryStore } from './historyStore';
import { workoutService } from '@/services/workoutService';

interface WorkoutState {
  activeWorkout: Workout | null;
  startWorkout: (templateName?: string) => void;
  cancelWorkout: () => void;
  finishWorkout: () => Promise<void>;
  addExercise: (exercise: Exercise) => void;
  removeExercise: (exerciseId: string) => void;
  addSet: (exerciseId: string) => void;
  updateSet: (exerciseId: string, setId: string, updates: Partial<WorkoutSet>) => void;
  removeSet: (exerciseId: string, setId: string) => void;
  completeSet: (exerciseId: string, setId: string) => void;
  updateWorkoutName: (name: string) => void;
  startWorkoutFromRoutine: (routine: Routine) => void;
  reset: () => void;
}

export const useWorkoutStore = create<WorkoutState>()(
  persist(
    (set, get) => ({
      activeWorkout: null,
      reset: () => set({ activeWorkout: null }),

      updateWorkoutName: (name: string) => {
        const { activeWorkout } = get();
        if (!activeWorkout) return;
        set({ activeWorkout: { ...activeWorkout, name } });
      },

      startWorkoutFromRoutine: (routine: Routine) => {
        const timestamp = Date.now();
        const randomId = Math.random().toString(36).substring(2, 9);

        const workoutExercises: WorkoutExercise[] = routine.exercises.map(re => {
          // Create sets based on targetSets, or default to 1 set
          const numSets = re.targetSets || 1;
          const sets: WorkoutSet[] = Array.from({ length: numSets }, (_, i) => ({
            id: `${timestamp}-${Math.random().toString(36).substring(2, 9)}`,
            weight: re.targetWeight || 0,
            reps: re.targetReps || 0,
            completed: false,
            type: 'Normal'
          }));

          return {
            id: `${timestamp}-${Math.random().toString(36).substring(2, 9)}`,
            exerciseId: re.exerciseId,
            exercise: re.exercise,
            sets
          };
        });

        const newWorkout: Workout = {
          id: `${timestamp}-${randomId}`,
          name: routine.name,
          startTime: timestamp,
          exercises: workoutExercises,
          status: 'active',
          volume: 0,
        };
        set({ activeWorkout: newWorkout });
      },

      startWorkout: (templateName = 'New Workout') => {
        const timestamp = Date.now();
        const randomId = Math.random().toString(36).substring(2, 9);

        const newWorkout: Workout = {
          id: `${timestamp}-${randomId}`,
          name: templateName,
          startTime: timestamp,
          exercises: [],
          status: 'active',
          volume: 0,
        };
        set({ activeWorkout: newWorkout });
      },

      cancelWorkout: () => {
        set({ activeWorkout: null });
      },

      finishWorkout: async () => {
        const { activeWorkout } = get();
        if (!activeWorkout) return;

        const endTime = Date.now();

        // Calculate total volume
        let volume = 0;
        activeWorkout.exercises.forEach(ex => {
          ex.sets.forEach(s => {
            if (s.completed) {
              volume += s.weight * s.reps;
            }
          });
        });

        const completedWorkout: Workout = {
          ...activeWorkout,
          endTime,
          volume,
          status: 'completed',
        };

        try {
          await workoutService.saveWorkout(completedWorkout);
          useHistoryStore.getState().addWorkout(completedWorkout);
          set({ activeWorkout: null });
        } catch (error) {
          console.error('Failed to save workout:', error);
          set({ activeWorkout: null });
        }
      },

      addExercise: (exercise) => {
        set((state) => {
          if (!state.activeWorkout) return state;

          const timestamp = Date.now();
          const randomId = Math.random().toString(36).substring(2, 9);

          const newExercise: WorkoutExercise = {
            id: `${timestamp}-${randomId}`,
            exerciseId: exercise.id,
            exercise: exercise,
            sets: [
              {
                id: `${timestamp}-${randomId}-1`,
                weight: 0,
                reps: 0,
                completed: false,
                type: 'Normal'
              }
            ],
          };

          return {
            activeWorkout: {
              ...state.activeWorkout,
              exercises: [...state.activeWorkout.exercises, newExercise],
            },
          };
        });
      },

      removeExercise: (exerciseId) => {
        set((state) => {
          if (!state.activeWorkout) return state;
          return {
            activeWorkout: {
              ...state.activeWorkout,
              exercises: state.activeWorkout.exercises.filter(e => e.id !== exerciseId)
            }
          }
        })
      },

      addSet: (exerciseId) => {
        set((state) => {
          if (!state.activeWorkout) return state;

          const exercises = state.activeWorkout.exercises.map((ex) => {
            if (ex.id === exerciseId) {
              const previousSet = ex.sets[ex.sets.length - 1];
              const timestamp = Date.now();
              const randomId = Math.random().toString(36).substring(2, 9);

              const newSet: WorkoutSet = {
                id: `${timestamp}-${randomId}`,
                weight: previousSet ? previousSet.weight : 0,
                reps: previousSet ? previousSet.reps : 0,
                completed: false,
                type: 'Normal',
                isWarmup: false,
                isFailure: false,
                isDropSet: false,
              };
              return { ...ex, sets: [...ex.sets, newSet] };
            }
            return ex;
          });

          return {
            activeWorkout: {
              ...state.activeWorkout,
              exercises,
            },
          };
        });
      },

      updateSet: (exerciseId, setId, updates) => {
        set((state) => {
          if (!state.activeWorkout) return state;

          const exercises = state.activeWorkout.exercises.map((ex) => {
            if (ex.id === exerciseId) {
              const sets = ex.sets.map(s => {
                if (s.id === setId) {
                  return { ...s, ...updates };
                }
                return s;
              });
              return { ...ex, sets };
            }
            return ex;
          });

          return {
            activeWorkout: {
              ...state.activeWorkout,
              exercises
            }
          };
        });
      },

      removeSet: (exerciseId, setId) => {
        set((state) => {
          if (!state.activeWorkout) return state;

          const exercises = state.activeWorkout.exercises.map(ex => {
            if (ex.id === exerciseId) {
              return { ...ex, sets: ex.sets.filter(s => s.id !== setId) };
            }
            return ex;
          });

          return {
            activeWorkout: {
              ...state.activeWorkout,
              exercises
            }
          };
        });
      },

      completeSet: (exerciseId, setId) => {
        set((state) => {
          if (!state.activeWorkout) return state;

          const exercises = state.activeWorkout.exercises.map(ex => {
            if (ex.id === exerciseId) {
              const sets = ex.sets.map(s => {
                if (s.id === setId) {
                  return { ...s, completed: !s.completed };
                }
                return s;
              });
              return { ...ex, sets };
            }
            return ex;
          });

          return {
            activeWorkout: {
              ...state.activeWorkout,
              exercises
            }
          };
        });
      }
    }),
    {
      name: 'active-workout-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
