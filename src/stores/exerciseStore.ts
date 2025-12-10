import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Exercise, MuscleGroup } from '@/types/exercise';
import { zustandStorage } from '@/utils/storage';

interface ExerciseState {
  exercises: Exercise[];
  addExercise: (exercise: Exercise) => void;
  getExercisesByMuscle: (muscle: MuscleGroup) => Exercise[];
  searchExercises: (query: string) => Exercise[];
}

const INITIAL_EXERCISES: Exercise[] = [
  { id: '1', name: 'Barbell Bench Press', muscleGroup: 'Chest', secondaryMuscles: ['Shoulders', 'Arms'], type: 'Compound' },
  { id: '2', name: 'Incline Dumbbell Press', muscleGroup: 'Chest', secondaryMuscles: ['Shoulders', 'Arms'], type: 'Compound' },
  { id: '3', name: 'Tricep Pushdown', muscleGroup: 'Arms', type: 'Isolation' },
  { id: '4', name: 'Barbell Squat', muscleGroup: 'Legs', secondaryMuscles: ['Core', 'Back'], type: 'Compound' },
  { id: '5', name: 'Deadlift', muscleGroup: 'Back', secondaryMuscles: ['Legs', 'Core'], type: 'Compound' },
  { id: '6', name: 'Pull-ups', muscleGroup: 'Back', secondaryMuscles: ['Arms'], type: 'Compound' },
  { id: '7', name: 'Overhead Press', muscleGroup: 'Shoulders', secondaryMuscles: ['Arms', 'Core'], type: 'Compound' },
  { id: '8', name: 'Barbell Row', muscleGroup: 'Back', secondaryMuscles: ['Arms'], type: 'Compound' },
  { id: '9', name: 'Romanian Deadlift', muscleGroup: 'Legs', secondaryMuscles: ['Back'], type: 'Compound' },
  { id: '10', name: 'Dumbbell Curl', muscleGroup: 'Arms', type: 'Isolation' },
  { id: '11', name: 'Tricep Dips', muscleGroup: 'Arms', secondaryMuscles: ['Chest', 'Shoulders'], type: 'Compound' },
  { id: '12', name: 'Plank', muscleGroup: 'Core', type: 'Isolation' },
];

export const useExerciseStore = create<ExerciseState>()(
  persist(
    (set, get) => ({
      exercises: INITIAL_EXERCISES,
      addExercise: (exercise) =>
        set((state) => ({ exercises: [...state.exercises, exercise] })),
      getExercisesByMuscle: (muscle) =>
        get().exercises.filter((e) => e.muscleGroup === muscle || e.secondaryMuscles?.includes(muscle)),
      searchExercises: (query) => {
        const lowerQuery = query.toLowerCase();
        return get().exercises.filter((e) =>
          e.name.toLowerCase().includes(lowerQuery)
        );
      },
    }),
    {
      name: 'exercise-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
