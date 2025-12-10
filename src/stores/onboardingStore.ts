import { create } from 'zustand';

interface OnboardingState {
  fitnessGoal: string | null;
  experienceLevel: string | null;
  setFitnessGoal: (goal: string) => void;
  setExperienceLevel: (level: string) => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  fitnessGoal: null,
  experienceLevel: null,
  setFitnessGoal: (goal) => set({ fitnessGoal: goal }),
  setExperienceLevel: (level) => set({ experienceLevel: level }),
  reset: () => set({ fitnessGoal: null, experienceLevel: null }),
}));
