import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TimerScene } from '../types/timer.types';
import { useTimerSettings } from '../hooks/useTimerSettings';
import PresetSelectionScreen from '../screens/PresetSelectionScreen';
import PreparationScreen from '../screens/PreparationScreen';
import ActiveTimerScreen from '../screens/ActiveTimerScreen';

const TimerContainer: React.FC = () => {
  const [currentScene, setCurrentScene] = useState<TimerScene>(TimerScene.PRESET_SELECTION);
  const timerSettings = useTimerSettings();

  const handleStartTimer = (rounds: number) => {
    timerSettings.updateSettings({ numberOfRounds: rounds });
    
    // Check if there's preparation time
    if (timerSettings.preparationTime > 0) {
      setCurrentScene(TimerScene.PREPARATION);
    } else {
      setCurrentScene(TimerScene.TIMER_ACTIVE);
    }
  };

  const handlePreparationComplete = () => {
    setCurrentScene(TimerScene.TIMER_ACTIVE);
  };

  const handlePreparationCancel = () => {
    setCurrentScene(TimerScene.PRESET_SELECTION);
  };

  const handleTimerStop = () => {
    setCurrentScene(TimerScene.PRESET_SELECTION);
  };

  const handleTimerFinish = () => {
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
          preparationTime={timerSettings.preparationTime}
          onPreparationComplete={handlePreparationComplete}
          onCancel={handlePreparationCancel}
        />
      ) : (
        <ActiveTimerScreen
          timerSettings={timerSettings.createNewTimerSettings()}
          onTimerStop={handleTimerStop}
          onTimerFinish={handleTimerFinish}
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
