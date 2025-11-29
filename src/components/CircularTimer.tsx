import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
import { COLORS } from '../constants/timer.constants';

interface CircularTimerProps {
  value: number;
  progress: number; // 0.0 to 1.0
  onCancel: () => void;
  onComplete?: () => void;
  size?: number;
  strokeWidth?: number;
  showReady?: boolean;
  // Use faster animation for countdown timers (preparation/cooldown)
  // Default 700ms is good for workout intervals, but countdown needs to be snappier
  progressAnimationDuration?: number;
}

const { width: screenWidth } = Dimensions.get('window');

const CircularTimer: React.FC<CircularTimerProps> = ({
  value,
  progress,
  onCancel,
  onComplete,
  size = 280,
  strokeWidth = 20,
  showReady = true,
  progressAnimationDuration = 700, // Default to smooth animation for workout intervals
}) => {
  const scaleAnim = useRef(new Animated.Value(1.0)).current;
  const opacityAnim = useRef(new Animated.Value(1.0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    // Animate progress - duration can be customized based on timer type
    // Longer duration (700ms) for smooth workout intervals
    // Shorter duration (300-400ms) for smooth countdown timers
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: progressAnimationDuration,
      easing: Easing.out(Easing.ease), // Smooth deceleration for natural feel
      useNativeDriver: false, // SVG properties can't use native driver
    }).start();
  }, [progress, progressAnim, progressAnimationDuration]);

  useEffect(() => {
    if (showReady) {
      // Ready animation sequence - fade out and back in (matching SwiftUI)
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
      // Reset opacity for countdown
      Animated.timing(opacityAnim, {
        toValue: 1.0,
        duration: 100,
        useNativeDriver: true,
      }).start();
      
      // Countdown animation sequence - scale up and down (matching SwiftUI spring)
      Animated.spring(scaleAnim, {
        toValue: 1.5,
        tension: 100,
        friction: 5,
        useNativeDriver: true,
      }).start();

      setTimeout(() => {
        Animated.spring(scaleAnim, {
          toValue: 1.0,
          tension: 100,
          friction: 5,
          useNativeDriver: true,
        }).start();
      }, 150);
    }
  }, [value, showReady]);

  const getDisplayText = () => {
    if (showReady) {
      return 'Ready';
    }
    if (value === 0) {
      return 'GO';
    }
    return value.toString();
  };

  const strokeDasharray = circumference;
  // Use Animated.Value for smooth SVG animation
  const animatedStrokeDashoffset = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  });

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onCancel}
      activeOpacity={1}
    >
      <View style={styles.timerContainer}>
        {/* Background circle */}
        <Svg width={size} height={size} style={styles.svg}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(128, 128, 128, 0.2)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
        </Svg>
        
        {/* Progress circle with animation */}
        <Svg width={size} height={size} style={[styles.svg, { position: 'absolute' }]}>
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={COLORS.PRIMARY}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={animatedStrokeDashoffset as any}
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
    fontSize: 80,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    textAlign: 'center',
    fontVariant: ['tabular-nums'],
  },
});

export default CircularTimer;
