import { Exercise } from './exercise';
import { WorkoutSet } from './set';

export interface WorkoutExercise {
  id: string; // Unique ID for this instance in the workout
  exerciseId: string;
  exercise: Exercise;
  sets: WorkoutSet[];
  notes?: string;
  orderIndex?: number;
}

export interface Workout {
  id: string;
  name: string;
  startTime: number;
  endTime?: number;
  exercises: WorkoutExercise[];
  status: 'active' | 'completed' | 'discarded';
  volume: number; // Total volume in kg
  notes?: string;
  selfRating?: number; // 1-5
  restTimerUsed?: boolean;
}
