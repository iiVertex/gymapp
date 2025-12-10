import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { COLORS } from '@/theme';
import { Bell, Moon, Shield, Download, ChevronRight } from 'lucide-react-native';

export const SettingsScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General</Text>

          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Bell size={20} color={COLORS.foreground} />
              <Text style={styles.rowText}>Push Notifications</Text>
            </View>
            <Switch
              value={true}
              trackColor={{ false: COLORS.muted, true: COLORS.primary }}
              thumbColor={COLORS.foreground}
            />
          </View>

          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Moon size={20} color={COLORS.foreground} />
              <Text style={styles.rowText}>Dark Mode</Text>
            </View>
            <Switch
              value={true}
              disabled
              trackColor={{ false: COLORS.muted, true: COLORS.primary }}
              thumbColor={COLORS.foreground}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data & Privacy</Text>

          <TouchableOpacity style={styles.row}>
            <View style={styles.rowLeft}>
              <Download size={20} color={COLORS.foreground} />
              <Text style={styles.rowText}>Export Data</Text>
            </View>
            <ChevronRight size={20} color={COLORS.mutedForeground} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.row}>
            <View style={styles.rowLeft}>
              <Shield size={20} color={COLORS.foreground} />
              <Text style={styles.rowText}>Privacy Policy</Text>
            </View>
            <ChevronRight size={20} color={COLORS.mutedForeground} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.foreground,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.mutedForeground,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowText: {
    fontSize: 16,
    color: COLORS.foreground,
  },
});
