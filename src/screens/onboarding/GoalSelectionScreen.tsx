import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { OptionCard } from '@/components/onboarding/OptionCard';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { COLORS } from '@/theme';
import { Dumbbell, TrendingUp, Activity, Trophy } from 'lucide-react-native';

const GOALS = [
  {
    id: 'build_muscle',
    title: 'Build Muscle',
    description: 'Gain mass and strength',
    icon: <Dumbbell size={24} color={COLORS.primary} />,
  },
  {
    id: 'lose_weight',
    title: 'Lose Weight',
    description: 'Burn fat and get lean',
    icon: <TrendingUp size={24} color={COLORS.primary} />,
  },
  {
    id: 'get_fit',
    title: 'Get Fit',
    description: 'Improve general health',
    icon: <Activity size={24} color={COLORS.primary} />,
  },
  {
    id: 'athletic_performance',
    title: 'Athletic Performance',
    description: 'Train like an athlete',
    icon: <Trophy size={24} color={COLORS.primary} />,
  },
];

export const GoalSelectionScreen = () => {
  const navigation = useNavigation<any>();
  const { fitnessGoal, setFitnessGoal } = useOnboardingStore();

  const handleNext = () => {
    if (fitnessGoal) {
      navigation.navigate('ExperienceLevel');
    }
  };

  return (
    <OnboardingLayout
      title="What's your goal?"
      subtitle="We'll personalize your workouts based on what you want to achieve."
      currentStep={1}
      totalSteps={4}
      nextButton={
        <TouchableOpacity
          style={[styles.button, !fitnessGoal && styles.disabledButton]}
          onPress={handleNext}
          disabled={!fitnessGoal}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      }
    >
      {GOALS.map((goal) => (
        <OptionCard
          key={goal.id}
          title={goal.title}
          description={goal.description}
          icon={goal.icon}
          selected={fitnessGoal === goal.id}
          onPress={() => setFitnessGoal(goal.id)}
        />
      ))}
    </OnboardingLayout>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: COLORS.primaryForeground,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
