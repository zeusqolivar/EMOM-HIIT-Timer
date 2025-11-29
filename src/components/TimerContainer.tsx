import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
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
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerSettings = useTimerSettings();
  const workoutStats = useWorkoutStats();
  const zoomAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

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
    setIsTransitioning(true);
    
    // Fade out and zoom out simultaneously
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(zoomAnim, {
        toValue: 0.8,
        duration: 150,
        useNativeDriver: true,
      })
    ]).start(() => {
      // Switch to timer view
      setCurrentScene(TimerScene.TIMER_ACTIVE);
      
      // Reset fade for new scene
      fadeAnim.setValue(0);
      
      // Fade in and zoom in simultaneously
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(zoomAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        })
      ]).start(() => {
        setIsTransitioning(false);
      });
    });
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
      <Animated.View style={[
        styles.animatedContainer,
        {
          transform: [{ scale: zoomAnim }],
        }
      ]}>
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
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  animatedContainer: {
    flex: 1,
  },
});

export default TimerContainer;
