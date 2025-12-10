import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, Text, View, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { COLORS } from '@/theme';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';

export const ProfileDetailsScreen = () => {
  const navigation = useNavigation<any>();
  const { user, setSession } = useAuthStore();
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [loading, setLoading] = useState(false);

  const handleComplete = async (skipped = false) => {
    setLoading(true);
    try {
      const updates = {
        id: user?.id,
        age: skipped ? null : parseInt(age) || null,
        weight: skipped ? null : parseFloat(weight) || null,
        height: skipped ? null : parseFloat(height) || null,
        onboarding_completed: true,
        updated_at: new Date(),
      };

      const { error } = await supabase.from('profiles').upsert(updates);

      if (error) throw error;

      // Refresh session to ensure app knows onboarding is done
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      
      // Navigation will be handled by RootNavigator based on onboarding_completed
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <OnboardingLayout
      title="About You"
      subtitle="Optional details to help us calculate your calorie needs."
      currentStep={4}
      totalSteps={4}
      onSkip={() => handleComplete(true)}
      nextButton={
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleComplete(false)}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? 'Finishing...' : 'Complete Profile'}</Text>
        </TouchableOpacity>
      }
    >
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Age</Text>
        <TextInput
          style={styles.input}
          value={age}
          onChangeText={setAge}
          placeholder="Years"
          placeholderTextColor={COLORS.mutedForeground}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.row}>
        <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
          <Text style={styles.label}>Weight</Text>
          <TextInput
            style={styles.input}
            value={weight}
            onChangeText={setWeight}
            placeholder="kg"
            placeholderTextColor={COLORS.mutedForeground}
            keyboardType="numeric"
          />
        </View>
        <View style={[styles.inputGroup, { flex: 1, marginLeft: 10 }]}>
          <Text style={styles.label}>Height</Text>
          <TextInput
            style={styles.input}
            value={height}
            onChangeText={setHeight}
            placeholder="cm"
            placeholderTextColor={COLORS.mutedForeground}
            keyboardType="numeric"
          />
        </View>
      </View>
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
  buttonText: {
    color: COLORS.primaryForeground,
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: COLORS.mutedForeground,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.input,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 16,
    color: COLORS.foreground,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
