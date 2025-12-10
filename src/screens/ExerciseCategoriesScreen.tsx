import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '@/theme';
import { ChevronRight, ArrowLeft } from 'lucide-react-native';

const CATEGORIES = [
  { id: 'chest', name: 'Chest', image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80' },
  { id: 'back', name: 'Back', image: 'https://images.unsplash.com/photo-1603287681836-b174ce5074c2?w=800&q=80' },
  { id: 'arms', name: 'Arms', image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&q=80' },
  { id: 'legs', name: 'Legs', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80' },
  { id: 'abs', name: 'Abs', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80' },
  { id: 'full_body', name: 'Full Body', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80' },
];

export const ExerciseCategoriesScreen = () => {
  const navigation = useNavigation<any>();

  const renderItem = ({ item }: { item: typeof CATEGORIES[0] }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ExerciseLibrary', { category: item.id })}
    >
      <ImageBackground
        source={{ uri: item.image }}
        style={styles.cardImage}
        imageStyle={{ borderRadius: 12 }}
      >
        <View style={styles.overlay} />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <ChevronRight color={COLORS.foreground} size={24} />
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color={COLORS.foreground} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Workout Library</Text>
          <Text style={styles.headerSubtitle}>Browse exercises by muscle group</Text>
        </View>
      </View>

      <FlatList
        data={CATEGORIES}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 16,
  },
  header: {
    padding: 20,
    paddingTop: 20,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.foreground,
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.mutedForeground,
    marginTop: 4,
  },
  listContent: {
    padding: 20,
    gap: 16,
  },
  card: {
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
  },
  cardImage: {
    flex: 1,
    justifyContent: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 12,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.foreground,
  },
});
