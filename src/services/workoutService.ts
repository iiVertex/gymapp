import { supabase } from '@/lib/supabase';
import { Workout, WorkoutExercise } from '@/types/workout';
import { WorkoutSet } from '@/types/set';

export const workoutService = {
  async saveWorkout(workout: Workout) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // 1. Save Workout Session
    const { data: sessionData, error: sessionError } = await supabase
      .from('workout_sessions')
      .insert({
        user_id: user.id,
        name: workout.name,
        notes: workout.notes,
        started_at: new Date(workout.startTime).toISOString(),
        completed_at: workout.endTime ? new Date(workout.endTime).toISOString() : null,
        rest_timer_used: workout.restTimerUsed,
        self_rating: workout.selfRating,
      })
      .select()
      .single();

    if (sessionError) throw sessionError;

    // 2. Save Exercises and Sets
    for (const exercise of workout.exercises) {
      const { data: exerciseData, error: exerciseError } = await supabase
        .from('workout_exercises')
        .insert({
          workout_session_id: sessionData.id,
          exercise_id: exercise.exerciseId,
          exercise_name: exercise.exercise.name,
          muscle_group: exercise.exercise.muscleGroup,
          order_index: exercise.orderIndex || 0,
          notes: exercise.notes,
        })
        .select()
        .single();

      if (exerciseError) throw exerciseError;

      const setsToInsert = exercise.sets.map((set, index) => ({
        workout_exercise_id: exerciseData.id,
        set_number: index + 1,
        weight: set.weight,
        reps: set.reps,
        is_warmup: set.isWarmup || set.type === 'Warmup',
        is_drop_set: set.isDropSet || set.type === 'Drop',
        is_failure: set.isFailure || set.type === 'Failure',
        rest_time_seconds: set.restTime,
      }));

      const { error: setsError } = await supabase
        .from('workout_sets')
        .insert(setsToInsert);

      if (setsError) throw setsError;
    }

    // 3. Check for Personal Records
    await this.checkPersonalRecords(workout, sessionData.id);

    return sessionData;
  },

  async checkPersonalRecords(workout: Workout, sessionId: string) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      for (const exercise of workout.exercises) {
          // Calculate max weight for this session
          let maxWeight = 0;
          let bestSet: WorkoutSet | undefined;

          for (const set of exercise.sets) {
              if (set.completed && !set.isWarmup && set.type !== 'Warmup') {
                  if (set.weight > maxWeight) {
                      maxWeight = set.weight;
                      bestSet = set;
                  }
              }
          }

          if (maxWeight > 0 && bestSet) {
              // Check against existing PR
              const { data: existingPr } = await supabase
                  .from('personal_records')
                  .select('*')
                  .eq('user_id', user.id)
                  .eq('exercise_id', exercise.exerciseId)
                  .eq('type', 'weight')
                  .order('value', { ascending: false })
                  .limit(1)
                  .maybeSingle();

              if (!existingPr || maxWeight > existingPr.value) {
                  // New PR!
                  await supabase.from('personal_records').insert({
                      user_id: user.id,
                      exercise_id: exercise.exerciseId,
                      type: 'weight',
                      value: maxWeight,
                      reps: bestSet.reps,
                      weight: maxWeight,
                      achieved_at: new Date().toISOString(),
                      workout_session_id: sessionId,
                      previous_record_id: existingPr?.id
                  });
              }
          }
      }
  },

  async getHistory() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('workout_sessions')
        .select(`
            *,
            workout_exercises (
                *,
                workout_sets (*)
            )
        `)
        .eq('user_id', user.id)
        .order('started_at', { ascending: false });
      
      if (error) throw error;
      return data;
  },

  async deleteWorkout(workoutId: string) {
    const { error } = await supabase
      .from('workout_sessions')
      .delete()
      .eq('id', workoutId);
    
    if (error) throw error;
  },

  async updateWorkoutName(workoutId: string, name: string) {
    const { error } = await supabase
      .from('workout_sessions')
      .update({ name })
      .eq('id', workoutId);

    if (error) throw error;
  }
};
