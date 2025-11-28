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
  const [lastCountdownValue, setLastCountdownValue] = useState<number | null>(null);

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

    // Start with empty circle and gradually fill it up
    setShowReady(true);
    setCurrentValue(0);
    setProgress(0.0); // Start with empty circle
    
    let interval: NodeJS.Timeout;
    
    // Delay timer start by 1 second (like SwiftUI onAppear delay)
    const startTimer = setTimeout(() => {
      let timeRemaining = preparationTime;
      const totalTime = preparationTime;
      
      interval = setInterval(() => {
        timeRemaining -= 0.1; // Update every 100ms for slower, more deliberate animation
        
        if (timeRemaining > 3) {
          // Ready phase: Gradually fill circle from 0% to 100% over the ready duration
          const readyDuration = totalTime - 3;
          const readyElapsed = totalTime - timeRemaining;
          const readyProgress = Math.min(1.0, readyElapsed / readyDuration);
          setProgress(readyProgress);
          setShowReady(true);
          setCurrentValue(0);
          setLastCountdownValue(null); // Reset for countdown phase
        } else if (timeRemaining > 0) {
          // Countdown phase: Discrete steps - circle empties in distinct steps
          const countdownValue = Math.ceil(timeRemaining);
          setShowReady(false);
          setCurrentValue(countdownValue);
          
          // Play short beep for countdown ticks (3, 2, 1) - only when value changes
          if (countdownValue >= 1 && countdownValue <= 3 && countdownValue !== lastCountdownValue) {
            // SoundService.playShortBeep(); // Commented out since we removed sound
            setLastCountdownValue(countdownValue);
            
            // Set discrete progress values for each countdown number
            if (countdownValue === 3) {
              setProgress(0.66); // 66% when showing "3"
            } else if (countdownValue === 2) {
              setProgress(0.33); // 33% when showing "2"
            } else if (countdownValue === 1) {
              setProgress(0.0);  // 0% when showing "1"
            }
          }
        } else {
          // Time's up - complete preparation immediately
          clearInterval(interval);
          // SoundService.playLongBeep(); // Commented out since we removed sound
          onPreparationComplete();
        }
      }, 100); // Update every 100ms for more deliberate animation
    }, 1000); // 1 second delay like SwiftUI

    // Cleanup function - this runs when component unmounts or dependencies change
    return () => {
      clearTimeout(startTimer);
      if (interval) {
        clearInterval(interval);
      }
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

