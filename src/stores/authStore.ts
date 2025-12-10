import { create } from 'zustand';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { useHistoryStore } from './historyStore';
import { useWorkoutStore } from './workoutStore';
import { useOnboardingStore } from './onboardingStore';

interface AuthState {
  session: Session | null;
  user: User | null;
  profile: any | null;
  loading: boolean;
  initialized: boolean;
  setSession: (session: Session | null) => void;
  initialize: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  user: null,
  profile: null,
  loading: false,
  initialized: false,
  setSession: async (session) => {
    set({ session, user: session?.user ?? null });
    if (session?.user) {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      set({ profile: data });
    } else {
      set({ profile: null });
    }
  },
  initialize: async () => {
    set({ loading: true });
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      let profile = null;
      if (session?.user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        profile = data;
      }

      set({ session, user: session?.user ?? null, profile, initialized: true });

      supabase.auth.onAuthStateChange(async (_event, session) => {
        let profile = get().profile;
        if (session?.user && !profile) {
           const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
           profile = data;
        } else if (!session) {
            profile = null;
        }
        set({ session, user: session?.user ?? null, profile });
      });
    } catch (error) {
      console.error('Error initializing auth:', error);
      set({ initialized: true });
    } finally {
      set({ loading: false });
    }
  },
  signOut: async () => {
    await supabase.auth.signOut();
    useHistoryStore.getState().clearHistory();
    useWorkoutStore.getState().reset();
    useOnboardingStore.getState().reset();
    set({ session: null, user: null, profile: null });
  },
}));
