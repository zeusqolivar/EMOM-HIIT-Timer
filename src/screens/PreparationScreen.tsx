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

  // Helper function to match SwiftUI computePreparationProgress
  const computePreparationProgress = (value: number, progress: number): number => {
    // Simplified logic: circle should fill from 0 to 1 during Ready phase
    // and empty during countdown
    if (value > 3) {
      // Ready phase: fill circle based on progress
      return progress;
    } else if (value > 0) {
      // Countdown phase: empty circle
      const countdownProgress = (3 - value) / 3;
      return 1.0 - countdownProgress;
    } else {
      // At 0: empty circle
      return 0;
    }
  };

  useEffect(() => {
    if (preparationTime === 0) {
      // No preparation time, go directly to workout
      onPreparationComplete();
      return;
    }

    // Start with "Ready" state and circle prefilled to 100%
    setShowReady(true);
    setCurrentValue(0);
    setProgress(1.0); // Start with circle prefilled to 100%
    
    // Delay timer start by 1 second (like SwiftUI onAppear delay)
    const startTimer = setTimeout(() => {
      let timeRemaining = preparationTime;
      const totalTime = preparationTime;
      
      const interval = setInterval(() => {
        timeRemaining -= 0.05; // Update every 50ms for smoother animation
        
        // Calculate phase progress exactly like SwiftUI ViewModel handleTick()
        // currentPhaseProgress = max(0.0, min(1.0, Double(preparationTime - currentPhaseTimeRemaining) / Double(preparationTime)))
        const phaseProgress = Math.max(0.0, Math.min(1.0, (totalTime - timeRemaining) / totalTime));
        
        if (timeRemaining > 3) {
          // Ready phase: Show "Ready" with circle reducing from 100% to 66%
          const readyProgress = 1.0 - ((totalTime - timeRemaining) / (totalTime - 3)) * 0.34; // 100% to 66%
          setProgress(Math.max(0.66, readyProgress));
          setShowReady(true);
          setCurrentValue(0);
        } else if (timeRemaining > 0) {
          // Countdown phase: 3, 2, 1 with circle emptying from 66% to 0%
          const countdownValue = Math.ceil(timeRemaining);
          setShowReady(false);
          setCurrentValue(countdownValue);
          
          // Circle empties during countdown: 3=66%, 2=33%, 1=0%
          const countdownProgress = timeRemaining / 3 * 0.66; // 66% to 0%
          setProgress(countdownProgress);
        } else {
          // Time's up - complete preparation immediately
          clearInterval(interval);
          onPreparationComplete();
        }
      }, 50); // Update every 50ms for smoother progress

      // Cleanup function for the interval
      return () => clearInterval(interval);
    }, 1000); // 1 second delay like SwiftUI

    return () => {
      clearTimeout(startTimer);
    };
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

