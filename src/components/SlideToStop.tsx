import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  PanResponder,
  Animated,
  StyleSheet,
  Dimensions,
  Vibration,
  TouchableOpacity,
} from 'react-native';
import { COLORS } from '../constants/timer.constants';

interface SlideToStopProps {
  onStop: () => void;
  onPauseToggle: () => void;
  isPaused: boolean;
  disabled?: boolean;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const SLIDER_WIDTH = screenWidth * 0.8;
const SLIDER_HEIGHT = screenHeight * 0.08;
const THUMB_SIZE = SLIDER_HEIGHT * 0.8;
const SLIDE_THRESHOLD = SLIDER_WIDTH - THUMB_SIZE - 20; // Leave some padding

const SlideToStop: React.FC<SlideToStopProps> = ({ 
  onStop, 
  onPauseToggle, 
  isPaused, 
  disabled = false 
}) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const [isSliding, setIsSliding] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

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
        
        const newValue = Math.max(0, Math.min(gestureState.dx, SLIDE_THRESHOLD));
        translateX.setValue(newValue);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (disabled || isCompleted) return;
        
        const { dx, dy, vx } = gestureState;
        
        // If it was more of a tap than a drag, handle as tap
        if (Math.abs(dx) < 10 && Math.abs(dy) < 10 && Math.abs(vx) < 0.5) {
          setIsSliding(false);
          onPauseToggle();
          Vibration.vibrate(10);
          return;
        }
        
        setIsSliding(false);
        
        if (dx >= SLIDE_THRESHOLD) {
          // Slide completed - trigger stop
          setIsCompleted(true);
          Vibration.vibrate([10, 50, 10]);
          
          Animated.spring(translateX, {
            toValue: SLIDE_THRESHOLD,
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
          <View style={styles.thumb}>
            <Text style={styles.thumbIcon}>
              {isCompleted ? '■' : isPaused ? '▶' : '⏸'}
            </Text>
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
    borderRadius: SLIDER_HEIGHT / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  slideText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: screenHeight * 0.022,
    fontWeight: '500',
    position: 'absolute',
  },
  thumbContainer: {
    position: 'absolute',
    left: 8,
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
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
  thumbIcon: {
    fontSize: screenHeight * 0.025,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default SlideToStop;
