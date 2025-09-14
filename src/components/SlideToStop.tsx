import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  PanResponder,
  Animated,
  StyleSheet,
  Dimensions,
  Vibration,
} from 'react-native';
import { COLORS } from '../constants/timer.constants';

interface SlideToStopProps {
  onStop: () => void;
  onPauseToggle: () => void;
  isPaused: boolean;
  disabled?: boolean;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const SLIDER_WIDTH = screenWidth * 0.9;
const SLIDER_HEIGHT = 80;
const THUMB_HEIGHT = 80; // Fill entire track height
const THUMB_WIDTH = 80; // square box shape
// Ratios to match SwiftUI reference
const STOP_THRESHOLD_RATIO = 0.35;
const MAX_DRAG_RATIO = 0.7;

const SlideToStop: React.FC<SlideToStopProps> = ({ 
  onStop, 
  onPauseToggle, 
  isPaused, 
  disabled = false 
}) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const [isSliding, setIsSliding] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isPastStop, setIsPastStop] = useState(false);

  const stopThreshold = SLIDER_WIDTH * STOP_THRESHOLD_RATIO;
  const maxDrag = SLIDER_WIDTH * MAX_DRAG_RATIO;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !disabled && !isCompleted,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Allow pan if there's horizontal movement greater than vertical
        const { dx, dy } = gestureState;
        return !disabled && !isCompleted && Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10;
      },
      onPanResponderGrant: () => {
        setIsSliding(true);
        Vibration.vibrate(10);
      },
      onPanResponderMove: (_, gestureState) => {
        if (disabled || isCompleted) return;
        
        const newValue = Math.max(0, Math.min(gestureState.dx, maxDrag));
        translateX.setValue(newValue);
        setIsPastStop(newValue >= stopThreshold);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (disabled || isCompleted) return;
        
        const { dx, dy } = gestureState;
        
        // If it was more of a tap than a drag, handle as tap
        if (Math.abs(dx) < 8 && Math.abs(dy) < 8) {
          setIsSliding(false);
          onPauseToggle();
          Vibration.vibrate(10);
          return;
        }
        
        setIsSliding(false);
        
        if (dx >= stopThreshold) {
          // Slide completed - trigger stop
          setIsCompleted(true);
          Vibration.vibrate([10, 50, 10]);
          
          Animated.spring(translateX, {
            toValue: maxDrag,
            useNativeDriver: false,
            tension: 100,
            friction: 8,
          }).start(() => {
            setTimeout(() => {
              onStop();
            }, 200);
          });
        } else {
          // Slide not completed - animate back to start
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: false,
            tension: 100,
            friction: 8,
          }).start();
          setIsPastStop(false);
        }
      },
    })
  ).current;

  return (
    <View style={styles.container}>
      {/* Track */}
      <View style={styles.track}>
        {/* Background text */}
        <Text style={styles.slideText}>Slide to Stop</Text>
        
        {/* Sliding thumb - Combined pause/slide button */}
        <Animated.View
          style={[
            styles.thumbContainer,
            {
              transform: [{ translateX }],
            },
          ]}
          {...panResponder.panHandlers}
        >
          <View style={[
            styles.thumb,
            { backgroundColor: isPastStop ? '#FF3B30' : COLORS.PRIMARY }
          ]}>
            {isPaused ? (
              // Play symbol: right-pointing triangle
              <View style={styles.iconContainer}>
                <View style={styles.playTriangle} />
              </View>
            ) : (
              // Pause symbol: two vertical bars
              <View style={[styles.iconContainer, { flexDirection: 'row' }]}>
                <View style={styles.pauseBar} />
                <View style={styles.pauseBar} />
              </View>
            )}
          </View>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 20,
  },
  track: {
    width: SLIDER_WIDTH,
    height: SLIDER_HEIGHT,
    borderRadius: 25, // Same as home screen buttons
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    padding: 0,
    margin: 0,
  },
  slideText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: screenHeight * 0.022,
    fontWeight: '500',
    position: 'absolute',
  },
  thumbContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: THUMB_WIDTH,
    height: THUMB_HEIGHT,
    borderRadius: 25, // Same as home screen buttons
  },
  thumb: {
    width: THUMB_WIDTH,
    height: THUMB_HEIGHT,
    borderRadius: 25, // Same as home screen buttons - box shape
    backgroundColor: COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pauseBar: {
    width: THUMB_HEIGHT * 0.14,
    height: THUMB_HEIGHT * 0.5,
    borderRadius: THUMB_HEIGHT * 0.04,
    backgroundColor: '#000000',
    marginHorizontal: THUMB_HEIGHT * 0.06,
  },
  playTriangle: {
    width: 0,
    height: 0,
    borderTopWidth: THUMB_HEIGHT * 0.18,
    borderBottomWidth: THUMB_HEIGHT * 0.18,
    borderLeftWidth: THUMB_HEIGHT * 0.32,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: '#000000',
    marginLeft: THUMB_HEIGHT * 0.05,
  },
});

export default SlideToStop;
