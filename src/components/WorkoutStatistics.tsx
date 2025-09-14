import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../constants/timer.constants';

interface WorkoutStatisticsProps {
  totalWorkouts?: number;
  totalTime?: number; // in minutes
  streak?: number; // days
}

const { width: screenWidth } = Dimensions.get('window');

const WorkoutStatistics: React.FC<WorkoutStatisticsProps> = ({
  totalWorkouts = 0,
  totalTime = 0,
  streak = 0,
}) => {
  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h${mins > 0 ? mins : ''}`;
  };

  const stats = [
    {
      label: 'Workouts',
      value: totalWorkouts.toString(),
      color: COLORS.PRIMARY,
    },
    {
      label: 'Total Time',
      value: formatTime(totalTime),
      color: '#007AFF',
    },
    {
      label: 'Streak',
      value: `${streak}d`,
      color: '#34C759',
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stats</Text>
      <View style={styles.statsRow}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statItem}>
            <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    paddingHorizontal: 14,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.PRIMARY,
    marginBottom: 8,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
});

export default WorkoutStatistics;
