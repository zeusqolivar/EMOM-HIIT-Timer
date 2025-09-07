import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { COLORS } from '../constants/timer.constants';

interface CircularTimerProps {
  value: number;
  progress: number; // 0.0 to 1.0
  onCancel: () => void;
  onComplete?: () => void;
  size?: number;
  strokeWidth?: number;
}

const { width: screenWidth } = Dimensions.get('window');

const CircularTimer: React.FC<CircularTimerProps> = ({
  value,
  progress,
  onCancel,
  onComplete,
  size = 300,
  strokeWidth = 15,
}) => {
  const [showReady, setShowReady] = useState(true);
  const [circleProgress, setCircleProgress] = useState(0);
  
  const scaleAnim = useRef(new Animated.Value(1.0)).current;
  const opacityAnim = useRef(new Animated.Value(1.0)).current;

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    // Update circle progress with animation
    setCircleProgress(progress);
  }, [progress]);

  useEffect(() => {
    if (value !== undefined && value !== null) {
      setShowReady(false);
    }
  }, [value]);

  useEffect(() => {
    if (showReady) {
      // Ready animation sequence
      Animated.timing(opacityAnim, {
        toValue: 1.0,
        duration: 500,
        useNativeDriver: true,
      }).start();

      setTimeout(() => {
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start();

        setTimeout(() => {
          Animated.timing(opacityAnim, {
            toValue: 1.0,
            duration: 300,
            useNativeDriver: true,
          }).start();
        }, 300);
      }, 700);
    } else {
      // Countdown animation sequence
      Animated.spring(scaleAnim, {
        toValue: 1.5,
        useNativeDriver: true,
      }).start();

      setTimeout(() => {
        Animated.spring(scaleAnim, {
          toValue: 1.0,
          damping: 0.5,
          useNativeDriver: true,
        }).start();
      }, 150);
    }
  }, [progress, showReady]);

  const getDisplayText = () => {
    if (showReady) {
      return 'Ready';
    }
    return value.toString();
  };

  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (circleProgress * circumference);

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onCancel}
      activeOpacity={1}
    >
      <View style={styles.timerContainer}>
        <Svg width={size} height={size} style={styles.svg}>
          {/* Background circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(128, 128, 128, 0.3)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={COLORS.PRIMARY}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>
        
        {/* Center text with animations */}
        <Animated.View 
          style={[
            styles.textContainer,
            {
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            }
          ]}
        >
          <Text style={styles.timerText}>{getDisplayText()}</Text>
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND,
  },
  timerContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  svg: {
    position: 'absolute',
  },
  textContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 72,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    textAlign: 'center',
  },
});

export default CircularTimer;
