import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
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
import CircularGauge from '../components/CircularGauge';

interface ActiveTimerScreenProps {
  timerSettings: ActiveTimerSettings;
  onTimerStop: () => void;
  onTimerFinish: () => void;
  speedUpTimer?: boolean;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const ActiveTimerScreen: React.FC<ActiveTimerScreenProps> = ({
  timerSettings,
  onTimerStop,
  onTimerFinish,
  speedUpTimer = false,
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
        const timeDecrement = speedUpTimer ? 4 : 1; // 4x speed when enabled
        if (prev <= timeDecrement) {
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
          return prev - timeDecrement;
        }
      });
    }, speedUpTimer ? 250 : 1000); // 4x faster interval when speed up is enabled

    return () => clearInterval(interval);
  }, [timerSettings, currentRound, isWorkPhase, onTimerFinish, isPaused, speedUpTimer]);

  const formatTime = useCallback((seconds: number) => {
    const displaySeconds = seconds === 0 ? 60 : seconds;
    return displaySeconds.toString().padStart(2, '0');
  }, []);

  const formattedTime = useMemo(() => formatTime(currentTime), [currentTime, formatTime]);

  const getRemainingRounds = useCallback(() => {
    if (timerSettings.isInfiniteMode) {
      return (currentRound + 1).toString().padStart(2, '0');
    } else {
      const remaining = Math.max(0, timerSettings.totalRounds - currentRound);
      return remaining.toString().padStart(2, '0');
    }
  }, [timerSettings.isInfiniteMode, timerSettings.totalRounds, currentRound]);

  const handlePauseResume = useCallback(() => {
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
  }, [slideAnim]);

  const handleStop = useCallback(() => {
    onTimerStop();
  }, [onTimerStop]);

  // Calculate progress values
  const currentProgress = isWorkPhase 
    ? (timerSettings.workIntervalSeconds - currentTime) / timerSettings.workIntervalSeconds
    : (timerSettings.restIntervalSeconds - currentTime) / timerSettings.restIntervalSeconds;
  
  const overallProgress = (currentRound - 1) / timerSettings.totalRounds;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Timer Display - Big and Dominant */}
        <View style={styles.timerContainer}>
          <View
            style={[
              styles.timerBox,
              { backgroundColor: isWorkPhase ? COLORS.PRIMARY : '#FF4444' },
            ]}
          >
            <Text style={styles.timerText}>{formattedTime}</Text>
            <Text style={styles.phaseText}>{isWorkPhase ? 'WORK' : 'REST'}</Text>
          </View>
        </View>

        {/* Gym Style Progress Bars */}
        <View style={styles.gymProgressContainer}>
          {/* Round Progress - Gym Equipment Style */}
          <View style={styles.roundProgressSection}>
            <Text style={styles.sectionLabel}>Round Progress</Text>
            <View style={styles.gymProgressBar}>
              {Array.from({ length: timerSettings.totalRounds }, (_, index) => (
                <View
                  key={index}
                  style={[
                    styles.progressSegment,
                    {
                      backgroundColor: index < currentRound - 1 
                        ? COLORS.PRIMARY 
                        : index === currentRound - 1 
                        ? 'rgba(255, 204, 0, 0.8)' // Current round - yellow
                        : 'rgba(128, 128, 128, 0.3)', // Future rounds - grey
                    }
                  ]}
                />
              ))}
            </View>
            <Text style={styles.roundInfoText}>
              {currentRound} / {timerSettings.totalRounds}
            </Text>
          </View>

          {/* Phase Progress - Smooth Animation */}
          <View style={styles.phaseProgressSection}>
            <Text style={styles.sectionLabel}>
              {isWorkPhase ? 'Work Phase' : 'Rest Phase'}
            </Text>
            <View style={styles.smoothProgressBar}>
              <View 
                style={[
                  styles.smoothProgressFill, 
                  { 
                    width: `${currentProgress * 100}%`,
                    backgroundColor: isWorkPhase ? COLORS.PRIMARY : '#FF4444'
                  }
                ]} 
              />
            </View>
            <Text style={styles.phaseInfoText}>
              {Math.round(currentProgress * 100)}%
            </Text>
          </View>
        </View>
      </View>

      {/* Slide to Stop Control - Lock Screen Style at Bottom */}
      <View style={styles.lockScreenContainer}>
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
    paddingTop: 20,
    paddingBottom: 0,
    flex: 1,
  },
  lockScreenContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    paddingTop: 0,
  },
  timerContainer: {
    width: screenWidth * 0.9,
    height: screenHeight * 0.4,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  timerBox: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  timerText: {
    fontSize: screenHeight * 0.25,
    fontWeight: 'bold',
    color: COLORS.BACKGROUND,
    lineHeight: screenHeight * 0.25,
    fontVariant: ['tabular-nums'],
    textAlign: 'center',
  },
  phaseText: {
    fontSize: screenHeight * 0.02,
    fontWeight: '600',
    color: COLORS.BACKGROUND,
    marginTop: 6,
    letterSpacing: 2,
  },
  gymProgressContainer: {
    width: screenWidth * 0.9,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    gap: 12,
    marginBottom: 20,
  },
  roundProgressSection: {
    alignItems: 'center',
  },
  phaseProgressSection: {
    alignItems: 'center',
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 6,
    textAlign: 'center',
  },
  gymProgressBar: {
    flexDirection: 'row',
    gap: 3,
    marginBottom: 6,
  },
  progressSegment: {
    height: 10,
    flex: 1,
    borderRadius: 5,
    minWidth: 6,
  },
  smoothProgressBar: {
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 6,
    width: '100%',
  },
  smoothProgressFill: {
    height: '100%',
    borderRadius: 5,
  },
  roundInfoText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
  },
  phaseInfoText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
  },

});

export default ActiveTimerScreen;
