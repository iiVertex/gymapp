import { Exercise } from './exercise';

export interface RoutineExercise {
    id: string;
    exerciseId: string;
    exercise: Exercise;
    order: number;
    targetSets?: number;
    targetReps?: number;
    targetWeight?: number;
    notes?: string;
}

export interface Routine {
    id: string;
    userId: string;
    name: string;
    description?: string;
    exercises: RoutineExercise[];
    createdAt: number;
    updatedAt: number;
    lastUsed?: number;
}
