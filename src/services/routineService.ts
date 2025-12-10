import { supabase } from '@/lib/supabase';
import { Routine } from '@/types/routine';

export const routineService = {
    async getRoutines() {
        const { data, error } = await supabase
            .from('routines')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as Routine[];
    },

    async createRoutine(routine: Omit<Routine, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) {
        const { data, error } = await supabase
            .from('routines')
            .insert(routine)
            .select()
            .single();

        if (error) throw error;
        return data as Routine;
    },

    async updateRoutine(id: string, updates: Partial<Routine>) {
        const { data, error } = await supabase
            .from('routines')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as Routine;
    },

    async deleteRoutine(id: string) {
        const { error } = await supabase
            .from('routines')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
};
