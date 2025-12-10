export type GraphType =
    | 'weekly_volume'
    | 'workouts_per_week'
    | 'exercise_progress'
    | 'personal_records'
    | 'muscle_group_distribution'
    | 'workout_duration';

export interface GraphConfig {
    id: string;
    type: GraphType;
    title: string;
    timeRange: '7d' | '30d' | '90d' | 'all';
    exerciseId?: string; // For exercise-specific graphs
}

export interface GraphData {
    labels: string[];
    datasets: {
        data: number[];
        color?: (opacity: number) => string;
    }[];
}

export interface GraphTypeInfo {
    type: GraphType;
    title: string;
    description: string;
    icon: string;
}
