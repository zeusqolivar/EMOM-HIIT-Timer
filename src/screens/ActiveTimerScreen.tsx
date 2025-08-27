import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { ActiveTimerSettings } from '../types/timer.types';
import { COLORS } from '../constants/timer.constants';

interface ActiveTimerScreenProps {
  timerSettings: ActiveTimerSettings;
  onTimerStop: () => void;
  onTimerFinish: () => void;
}

const ActiveTimerScreen: React.FC<ActiveTimerScreenProps> = ({
  timerSettings,
  onTimerStop,
  onTimerFinish,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.timerText}>00:00</Text>
        <Text style={styles.roundText}>Round 1 / {timerSettings.totalRounds}</Text>
        <Text style={styles.phaseText}>Work Phase</Text>
      </View>
      
      <View style={styles.controls}>
        <TouchableOpacity style={styles.stopButton} onPress={onTimerStop}>
          <Text style={styles.stopButtonText}>Stop</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    marginBottom: 50,
  },
  timerText: {
    fontSize: 72,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    fontVariant: ['tabular-nums'],
  },
  roundText: {
    fontSize: 24,
    color: COLORS.PRIMARY,
    marginTop: 20,
  },
  phaseText: {
    fontSize: 18,
    color: COLORS.TEXT,
    marginTop: 10,
  },
  controls: {
    flexDirection: 'row',
    gap: 20,
  },
  stopButton: {
    backgroundColor: '#FF4444',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
  },
  stopButtonText: {
    color: COLORS.TEXT,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ActiveTimerScreen;
