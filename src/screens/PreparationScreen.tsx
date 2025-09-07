import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import CircularTimer from '../components/CircularTimer';
import { COLORS } from '../constants/timer.constants';

interface PreparationScreenProps {
  preparationTime: number;
  onPreparationComplete: () => void;
  onCancel: () => void;
}

const PreparationScreen: React.FC<PreparationScreenProps> = ({
  preparationTime,
  onPreparationComplete,
  onCancel,
}) => {
  const [currentValue, setCurrentValue] = useState(3);
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (preparationTime === 0) {
      // No preparation time, go directly to workout
      onPreparationComplete();
      return;
    }

    let timeLeft = preparationTime;
    const interval = setInterval(() => {
      timeLeft -= 1;
      
      if (timeLeft > 3) {
        // Show countdown numbers
        setCurrentValue(timeLeft);
        setProgress(1 - (timeLeft / preparationTime));
      } else if (timeLeft > 0) {
        // Show 3, 2, 1
        setCurrentValue(timeLeft);
        setProgress(1 - (timeLeft / preparationTime));
      } else {
        // Show "Ready"
        setIsReady(true);
        setProgress(1);
        
        // Wait a moment on "Ready" then complete
        setTimeout(() => {
          onPreparationComplete();
        }, 1000);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [preparationTime, onPreparationComplete]);

  const handleCancel = () => {
    onCancel();
  };

  if (preparationTime === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <CircularTimer
        value={isReady ? 0 : currentValue}
        progress={progress}
        onCancel={handleCancel}
      />
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
});

export default PreparationScreen;

