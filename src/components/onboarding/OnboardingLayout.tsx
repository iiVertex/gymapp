import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '@/theme';
import { ArrowLeft } from 'lucide-react-native';
import { ProgressDots } from './ProgressDots';

interface OnboardingLayoutProps {
  title: string;
  subtitle?: string;
  currentStep: number;
  totalSteps: number;
  onBack?: () => void;
  onSkip?: () => void;
  children: React.ReactNode;
  nextButton?: React.ReactNode;
}

export const OnboardingLayout = ({
  title,
  subtitle,
  currentStep,
  totalSteps,
  onBack,
  onSkip,
  children,
  nextButton,
}: OnboardingLayoutProps) => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack || (() => navigation.goBack())} style={styles.backButton}>
          <ArrowLeft size={24} color={COLORS.foreground} />
        </TouchableOpacity>
        {onSkip && (
          <TouchableOpacity onPress={onSkip} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.content}>
        <ProgressDots current={currentStep} total={totalSteps} />

        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

        <ScrollView
          style={styles.scrollContent}
          contentContainerStyle={styles.scrollContentContainer}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </View>

      {nextButton && <View style={styles.footer}>{nextButton}</View>}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    height: 50,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  skipButton: {
    padding: 8,
    marginRight: -8,
  },
  skipText: {
    color: COLORS.mutedForeground,
    fontSize: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.foreground,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.mutedForeground,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  scrollContent: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingBottom: 20,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
});
