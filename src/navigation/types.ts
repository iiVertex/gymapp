import { NavigatorScreenParams } from '@react-navigation/native';

export type TabParamList = {
  Dashboard: undefined;

  History: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Main: NavigatorScreenParams<TabParamList>;
  ActiveWorkout: undefined;
  ExerciseLibrary: { isSelectionMode: boolean; category?: string };
  ExerciseCategories: undefined;
  ExerciseDetails: { exerciseId: string };
  WorkoutDetails: { workoutId: string };
  WorkoutBuilder: { selectedExercise?: any };
  Settings: undefined;
  Welcome: undefined;
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
  GoalSelection: undefined;
  ExperienceLevel: undefined;
  ProfileDetails: undefined;
};
