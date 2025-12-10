import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { TabNavigator } from './TabNavigator';
import { COLORS } from '@/theme';
import { View, ActivityIndicator } from 'react-native';

import { ActiveWorkoutScreen } from '@/screens/ActiveWorkoutScreen';
import { ExerciseLibraryScreen } from '@/screens/ExerciseLibraryScreen';
import { ExerciseCategoriesScreen } from '@/screens/ExerciseCategoriesScreen';
import { ExerciseDetailsScreen } from '@/screens/ExerciseDetailsScreen';
import { WorkoutDetailsScreen } from '@/screens/WorkoutDetailsScreen';
import { WorkoutBuilderScreen } from '@/screens/WorkoutBuilderScreen';
import { SettingsScreen } from '@/screens/SettingsScreen';
import { LoginScreen } from '@/screens/auth/LoginScreen';
import { SignupScreen } from '@/screens/auth/SignupScreen';
import { WelcomeScreen } from '@/screens/auth/WelcomeScreen';
import { ForgotPasswordScreen } from '@/screens/auth/ForgotPasswordScreen';
import { GoalSelectionScreen } from '@/screens/onboarding/GoalSelectionScreen';
import { ExperienceLevelScreen } from '@/screens/onboarding/ExperienceLevelScreen';
import { ProfileDetailsScreen } from '@/screens/onboarding/ProfileDetailsScreen';
import { useAuthStore } from '@/stores/authStore';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const { session, profile, initialize, loading, initialized } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (!initialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: COLORS.background },
        }}
      >
        {session ? (
          profile?.onboarding_completed ? (
            <>
              <Stack.Screen name="Main" component={TabNavigator} />
              <Stack.Screen
                name="ActiveWorkout"
                component={ActiveWorkoutScreen}
                options={{ presentation: 'fullScreenModal', gestureEnabled: false }}
              />
              <Stack.Screen
                name="ExerciseLibrary"
                component={ExerciseLibraryScreen}
                options={{ presentation: 'modal' }}
              />
              <Stack.Screen name="ExerciseDetails" component={ExerciseDetailsScreen} />
              <Stack.Screen name="WorkoutDetails" component={WorkoutDetailsScreen} />
              <Stack.Screen name="WorkoutBuilder" component={WorkoutBuilderScreen} />
              <Stack.Screen name="ExerciseCategories" component={ExerciseCategoriesScreen} />
              <Stack.Screen name="Settings" component={SettingsScreen} />
            </>
          ) : (
            <Stack.Screen name="ProfileDetails" component={ProfileDetailsScreen} />
          )
        ) : (
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="GoalSelection" component={GoalSelectionScreen} />
            <Stack.Screen name="ExperienceLevel" component={ExperienceLevelScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
