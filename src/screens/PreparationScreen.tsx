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
  const [currentValue, setCurrentValue] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showReady, setShowReady] = useState(true);

  useEffect(() => {
    if (preparationTime === 0) {
      // No preparation time, go directly to workout
      onPreparationComplete();
      return;
    }

    // Start with "Ready" state and initial progress
    setShowReady(true);
    setCurrentValue(0);
    setProgress(0);
    
    let timeRemaining = preparationTime;
    const totalTime = preparationTime;
    
    const interval = setInterval(() => {
      timeRemaining -= 0.05; // Update every 50ms for smoother animation
      
      // Compute progress based on current value/phase, not continuous time
      const computePreparationProgress = (timeLeft: number, totalTime: number) => {
        if (timeLeft > 3) {
          // Ready phase: circle fills from 0% to 25% (or appropriate fraction)
          const readyPhaseProgress = (totalTime - timeLeft) / (totalTime - 3);
          return readyPhaseProgress * 0.25; // Ready gets 25% of the circle
        } else if (timeLeft > 2) {
          // "3" phase: circle fills from 25% to 50%
          const phase3Progress = (3 - timeLeft) / 1; // 1 second for "3"
          return 0.25 + (phase3Progress * 0.25);
        } else if (timeLeft > 1) {
          // "2" phase: circle fills from 50% to 75%
          const phase2Progress = (2 - timeLeft) / 1; // 1 second for "2"
          return 0.5 + (phase2Progress * 0.25);
        } else if (timeLeft > 0) {
          // "1" phase: circle fills from 75% to 100%
          const phase1Progress = (1 - timeLeft) / 1; // 1 second for "1"
          return 0.75 + (phase1Progress * 0.25);
        } else {
          // "GO" phase: circle is 100% filled
          return 1.0;
        }
      };
      
      const currentProgress = computePreparationProgress(timeRemaining, totalTime);
      setProgress(currentProgress);
      
      if (timeRemaining > 3) {
        // Still in "Ready" phase
        if (!showReady) {
          setShowReady(true);
          setCurrentValue(0);
        }
      } else if (timeRemaining > 0) {
        // Countdown phase: 3, 2, 1
        const countdownValue = Math.ceil(timeRemaining);
        if (showReady || currentValue !== countdownValue) {
          setShowReady(false);
          setCurrentValue(countdownValue);
        }
      } else {
        // Time's up - show "GO"
        if (currentValue !== 0 || showReady) {
          setShowReady(false);
          setCurrentValue(0); // This will show "GO"
          setProgress(1); // Circle fully filled
        }
        
        // Complete after showing "GO" briefly
        setTimeout(() => {
          onPreparationComplete();
        }, 800);
        
        clearInterval(interval);
      }
    }, 50); // Update every 50ms for smoother progress

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
        value={currentValue}
        progress={progress}
        onCancel={handleCancel}
        showReady={showReady}
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

