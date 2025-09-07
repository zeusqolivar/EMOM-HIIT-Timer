import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import { ActiveTimerSettings } from '../types/timer.types';
import { COLORS } from '../constants/timer.constants';
import GymProgressBar from '../components/GymProgressBar';
import SlideToStop from '../components/SlideToStop';

interface ActiveTimerScreenProps {
  timerSettings: ActiveTimerSettings;
  onTimerStop: () => void;
  onTimerFinish: () => void;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const ActiveTimerScreen: React.FC<ActiveTimerScreenProps> = ({
  timerSettings,
  onTimerStop,
  onTimerFinish,
}) => {
  const [currentTime, setCurrentTime] = useState(timerSettings.workIntervalSeconds);
  const [currentRound, setCurrentRound] = useState(1);
  const [isWorkPhase, setIsWorkPhase] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (timerSettings.isInfiniteMode) {
      // Handle infinite mode
      return;
    }

    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentTime(prev => {
        if (prev <= 1) {
          // Phase complete
          if (isWorkPhase && timerSettings.restIntervalSeconds > 0) {
            // Switch to rest phase
            setIsWorkPhase(false);
            return timerSettings.restIntervalSeconds;
          } else {
            // Round complete
            if (currentRound >= timerSettings.totalRounds) {
              onTimerFinish();
              return 0;
            } else {
              // Next round
              setCurrentRound(prev => prev + 1);
              setIsWorkPhase(true);
              return timerSettings.workIntervalSeconds;
            }
          }
        } else {
          return prev - 1;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerSettings, currentRound, isWorkPhase, onTimerFinish, isPaused]);

  const formatTime = (seconds: number) => {
    const displaySeconds = seconds === 0 ? 60 : seconds;
    return displaySeconds.toString().padStart(2, '0');
  };

  const getRemainingRounds = () => {
    if (timerSettings.isInfiniteMode) {
      return (currentRound + 1).toString().padStart(2, '0');
    } else {
      const remaining = Math.max(0, timerSettings.totalRounds - currentRound);
      return remaining.toString().padStart(2, '0');
    }
  };

  const handlePauseResume = () => {
    // Add slide animation
    Animated.spring(slideAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start(() => {
      slideAnim.setValue(0);
    });
    
    // Use functional update to avoid stale state
    setIsPaused(prev => !prev);
  };

  const handleStop = () => {
    onTimerStop();
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Timer Display - Much larger like native */}
        <View style={styles.timerContainer}>
          <Text style={[
            styles.timerText,
            { backgroundColor: isWorkPhase ? COLORS.PRIMARY : '#FF4444' }
          ]}>
            {formatTime(currentTime)}
          </Text>
        </View>

        {/* Rounds Display - Gym machine style progress bar */}
        <View style={styles.roundsContainer}>
          <GymProgressBar totalRounds={timerSettings.totalRounds} currentRound={currentRound} segmented={false} />
          <Text style={styles.roundLabel}>Round {currentRound} / {timerSettings.totalRounds}</Text>
        </View>

        {/* Spacer to minimize empty space and push slider down slightly */}
        <View style={{ flex: 1 }} />

        {/* Slide to Stop Control - iPhone style slider with integrated pause/play */}
        <SlideToStop 
          onStop={handleStop} 
          onPauseToggle={handlePauseResume}
          isPaused={isPaused}
          disabled={false} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    flex: 1,
  },
  timerContainer: {
    width: screenWidth * 0.95,
    height: screenHeight * 0.45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    fontSize: screenHeight * 0.28,
    fontWeight: 'bold',
    color: COLORS.BACKGROUND,
    paddingHorizontal: screenWidth * 0.12,
    paddingVertical: screenHeight * 0.08,
    borderRadius: 28,
    fontVariant: ['tabular-nums'],
    textAlign: 'center',
  },
  roundsContainer: {
    marginTop: 8,
    marginBottom: 8,
    width: screenWidth * 0.94,
    alignItems: 'center',
    gap: 8,
  },
  roundLabel: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: screenHeight * 0.02,
    fontWeight: '600',
  },

});

export default ActiveTimerScreen;
