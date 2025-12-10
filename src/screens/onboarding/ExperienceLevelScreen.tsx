import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { OptionCard } from '@/components/onboarding/OptionCard';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { COLORS } from '@/theme';
import { User, TrendingUp, Trophy } from 'lucide-react-native';

const LEVELS = [
  {
    id: 'beginner',
    title: 'Beginner',
    description: 'New to working out',
    icon: <User size={24} color={COLORS.primary} />,
  },
  {
    id: 'intermediate',
    title: 'Intermediate',
    description: 'Consistent for 6+ months',
    icon: <TrendingUp size={24} color={COLORS.primary} />,
  },
  {
    id: 'advanced',
    title: 'Advanced',
    description: 'Consistent for 2+ years',
    icon: <Trophy size={24} color={COLORS.primary} />,
  },
];

export const ExperienceLevelScreen = () => {
  const navigation = useNavigation<any>();
  const { experienceLevel, setExperienceLevel } = useOnboardingStore();

  const handleNext = () => {
    if (experienceLevel) {
      navigation.navigate('Signup');
    }
  };

  return (
    <OnboardingLayout
      title="Experience Level"
      subtitle="Help us adjust the difficulty of your recommended routines."
      currentStep={2}
      totalSteps={4}
      nextButton={
        <TouchableOpacity
          style={[styles.button, !experienceLevel && styles.disabledButton]}
          onPress={handleNext}
          disabled={!experienceLevel}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      }
    >
      {LEVELS.map((level) => (
        <OptionCard
          key={level.id}
          title={level.title}
          description={level.description}
          icon={level.icon}
          selected={experienceLevel === level.id}
          onPress={() => setExperienceLevel(level.id)}
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
