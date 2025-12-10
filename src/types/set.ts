export type SetType = 'Normal' | 'Warmup' | 'Drop' | 'Failure';

export interface WorkoutSet {
  id: string;
  weight: number;
  reps: number;
  completed: boolean;
  type: SetType;
  isWarmup?: boolean;
  isDropSet?: boolean;
  isFailure?: boolean;
  restTime?: number; // Seconds rested before this set
  notes?: string;
}
