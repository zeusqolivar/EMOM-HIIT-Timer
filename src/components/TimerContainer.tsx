import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TimerScene } from '../types/timer.types';
import { useTimerSettings } from '../hooks/useTimerSettings';
import PresetSelectionScreen from '../screens/PresetSelectionScreen';
import ActiveTimerScreen from '../screens/ActiveTimerScreen';

const TimerContainer: React.FC = () => {
  const [currentScene, setCurrentScene] = useState<TimerScene>(TimerScene.PRESET_SELECTION);
  const timerSettings = useTimerSettings();

  const handleStartTimer = (rounds: number) => {
    timerSettings.updateSettings({ numberOfRounds: rounds });
    setCurrentScene(TimerScene.TIMER_ACTIVE);
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
