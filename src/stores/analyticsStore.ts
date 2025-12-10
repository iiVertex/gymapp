import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { GraphConfig, GraphType, GraphData } from '@/types/analytics';
import { zustandStorage } from '@/utils/storage';
import { useHistoryStore } from './historyStore';

interface AnalyticsState {
    graphs: GraphConfig[];
    addGraph: (type: GraphType) => void;
    removeGraph: (id: string) => void;
    updateGraph: (id: string, updates: Partial<GraphConfig>) => void;
    reorderGraphs: (graphs: GraphConfig[]) => void;
}

const getDefaultTitle = (type: GraphType): string => {
    const titles: Record<GraphType, string> = {
        weekly_volume: 'Weekly Volume',
        workouts_per_week: 'Workouts Per Week',
        exercise_progress: 'Exercise Progress',
        personal_records: 'Personal Records',
        muscle_group_distribution: 'Muscle Groups',
        workout_duration: 'Workout Duration',
    };
    return titles[type];
};

export const useAnalyticsStore = create<AnalyticsState>()(
    persist(
        (set, get) => ({
            graphs: [],

            addGraph: (type: GraphType) => {
                const newGraph: GraphConfig = {
                    id: `graph-${Date.now()}`,
                    type,
                    title: getDefaultTitle(type),
                    timeRange: '30d',
                };
                set(state => ({ graphs: [...state.graphs, newGraph] }));
            },

            removeGraph: (id: string) => {
                set(state => ({
                    graphs: state.graphs.filter(g => g.id !== id)
                }));
            },

            updateGraph: (id: string, updates: Partial<GraphConfig>) => {
                set(state => ({
                    graphs: state.graphs.map(g =>
                        g.id === id ? { ...g, ...updates } : g
                    )
                }));
            },

            reorderGraphs: (graphs: GraphConfig[]) => {
                set({ graphs });
            },
        }),
        {
            name: 'analytics-storage',
            storage: createJSONStorage(() => zustandStorage),
        }
    )
);
