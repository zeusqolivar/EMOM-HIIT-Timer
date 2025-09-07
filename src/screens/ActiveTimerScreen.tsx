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
    
    setIsPaused(!isPaused);
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

        {/* Rounds Display with semi-circle progress */}
        <View style={styles.roundsContainer}>
          <View style={styles.progressContainer}>
            {/* Semi-circular progress segments */}
            <View style={styles.progressSegments}>
              {Array.from({ length: 12 }, (_, index) => {
                const isCompleted = index < Math.floor((currentRound - 1) / timerSettings.totalRounds * 12);
                const isCurrent = index === Math.floor((currentRound - 1) / timerSettings.totalRounds * 12);
                return (
                  <View
                    key={index}
                    style={[
                      styles.progressSegment,
                      {
                        backgroundColor: isCompleted || isCurrent ? COLORS.PRIMARY : 'rgba(128, 128, 128, 0.3)',
                        opacity: isCurrent ? 0.8 : 1,
                      }
                    ]}
                  />
                );
              })}
            </View>
            
            {/* Central rounds circle */}
            <View style={styles.roundsCircle}>
              <Text style={styles.roundsText}>{getRemainingRounds()}</Text>
            </View>
          </View>
        </View>

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
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  timerContainer: {
    marginBottom: 20,
    width: screenWidth * 0.8,
    height: screenHeight * 0.4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    fontSize: screenHeight * 0.15,
    fontWeight: 'bold',
    color: COLORS.BACKGROUND,
    paddingHorizontal: screenWidth * 0.1,
    paddingVertical: screenHeight * 0.05,
    borderRadius: screenHeight * 0.02,
    fontVariant: ['tabular-nums'],
    textAlign: 'center',
  },
  roundsContainer: {
    marginBottom: 40,
  },
  progressContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressSegments: {
    position: 'absolute',
    width: screenWidth * 0.6,
    height: screenWidth * 0.3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: screenWidth * 0.1,
  },
  progressSegment: {
    width: screenWidth * 0.02,
    height: screenWidth * 0.08,
    borderRadius: screenWidth * 0.01,
  },
  roundsCircle: {
    width: screenWidth * 0.4,
    height: screenWidth * 0.4,
    borderRadius: screenWidth * 0.2,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: COLORS.BACKGROUND,
    zIndex: 1,
  },
  roundsText: {
    fontSize: screenWidth * 0.15,
    fontWeight: 'bold',
    color: COLORS.BACKGROUND,
    fontVariant: ['tabular-nums'],
  },

});

export default ActiveTimerScreen;
