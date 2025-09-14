import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { TimerScene } from '../types/timer.types';
import { useTimerSettings } from '../hooks/useTimerSettings';
import { useWorkoutStats } from '../hooks/useWorkoutStats';
import PresetSelectionScreen from '../screens/PresetSelectionScreen';
import PreparationScreen from '../screens/PreparationScreen';
import ActiveTimerScreen from '../screens/ActiveTimerScreen';

const TimerContainer: React.FC = () => {
  const [currentScene, setCurrentScene] = useState<TimerScene>(TimerScene.PRESET_SELECTION);
  const [currentWorkoutId, setCurrentWorkoutId] = useState<string | null>(null);
  const [workoutStartTime, setWorkoutStartTime] = useState<number>(0);
  const timerSettings = useTimerSettings();
  const workoutStats = useWorkoutStats();

  const handleStartTimer = (rounds: number) => {
    timerSettings.updateSettings({ numberOfRounds: rounds });
    
    // Start workout tracking
    const workoutId = workoutStats.startWorkout(rounds);
    setCurrentWorkoutId(workoutId);
    setWorkoutStartTime(Date.now());
    
    // Check if there's preparation time
    if (timerSettings.settings.preparationTime > 0) {
      setCurrentScene(TimerScene.PREPARATION);
    } else {
      setCurrentScene(TimerScene.TIMER_ACTIVE);
    }
  };

  const handlePreparationComplete = () => {
    setCurrentScene(TimerScene.TIMER_ACTIVE);
  };

  const handlePreparationCancel = () => {
    // Cancel workout tracking
    if (currentWorkoutId) {
      workoutStats.cancelWorkout(currentWorkoutId);
      setCurrentWorkoutId(null);
    }
    setCurrentScene(TimerScene.PRESET_SELECTION);
  };

  const handleTimerStop = () => {
    // Cancel workout tracking
    if (currentWorkoutId) {
      workoutStats.cancelWorkout(currentWorkoutId);
      setCurrentWorkoutId(null);
    }
    setCurrentScene(TimerScene.PRESET_SELECTION);
  };

  const handleTimerFinish = () => {
    // Complete workout tracking
    if (currentWorkoutId) {
      const duration = Math.round((Date.now() - workoutStartTime) / 60000); // Convert to minutes
      workoutStats.completeWorkout(currentWorkoutId, duration);
      setCurrentWorkoutId(null);
    }
    setCurrentScene(TimerScene.PRESET_SELECTION);
  };

  return (
    <View style={styles.container}>
      {currentScene === TimerScene.PRESET_SELECTION ? (
        <PresetSelectionScreen
          timerSettings={timerSettings}
          onRoundSelect={handleStartTimer}
        />
      ) : currentScene === TimerScene.PREPARATION ? (
        <PreparationScreen
          preparationTime={timerSettings.settings.preparationTime}
          onPreparationComplete={handlePreparationComplete}
          onCancel={handlePreparationCancel}
        />
      ) : (
        <ActiveTimerScreen
          timerSettings={timerSettings.createNewTimerSettings()}
          onTimerStop={handleTimerStop}
          onTimerFinish={handleTimerFinish}
          speedUpTimer={timerSettings.settings.speedUpTimer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
});

export default TimerContainer;
