import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Routine } from '@/types/routine';
import { zustandStorage } from '@/utils/storage';

interface RoutineState {
    routines: Routine[];
    isLoading: boolean;
    error: string | null;

    fetchRoutines: () => Promise<void>;
    createRoutine: (routine: Omit<Routine, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
    updateRoutine: (id: string, updates: Partial<Routine>) => Promise<void>;
    deleteRoutine: (id: string) => Promise<void>;
    duplicateRoutine: (routine: Routine) => Promise<void>;
}

export const useRoutineStore = create<RoutineState>()(
    persist(
        (set, get) => ({
            routines: [],
            isLoading: false,
            error: null,

            fetchRoutines: async () => {
                // For now, just use local persisted state
                // Supabase sync will be added later
                set({ isLoading: false });
            },

            createRoutine: async (routineData) => {
                const timestamp = Date.now();
                const newRoutine: Routine = {
                    id: `routine-${timestamp}`,
                    userId: 'local-user',
                    ...routineData,
                    createdAt: timestamp,
                    updatedAt: timestamp,
                };

                set(state => ({
                    routines: [newRoutine, ...state.routines],
                }));
            },

            updateRoutine: async (id, updates) => {
                set(state => ({
                    routines: state.routines.map(r =>
                        r.id === id ? { ...r, ...updates, updatedAt: Date.now() } : r
                    ),
                }));
            },

            deleteRoutine: async (id) => {
                set(state => ({
                    routines: state.routines.filter(r => r.id !== id),
                }));
            },

            duplicateRoutine: async (routine) => {
                const { createRoutine } = get();
                const newRoutineData = {
                    name: `${routine.name} (Copy)`,
                    description: routine.description,
                    exercises: routine.exercises,
                };
                await createRoutine(newRoutineData as any);
            }
        }),
        {
            name: 'routine-storage',
            storage: createJSONStorage(() => zustandStorage),
        }
    )
);
