import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../constants/timer.constants';

interface GymProgressBarProps {
  totalRounds: number;
  currentRound: number; // 1-based index
  width?: number;
  height?: number;
  segmented?: boolean; // false -> continuous fill
}

const { width: screenWidth } = Dimensions.get('window');

const DEFAULT_WIDTH = screenWidth * 0.8;
const DEFAULT_HEIGHT = 14;
const SEGMENT_GAP = 4;

const GymProgressBar: React.FC<GymProgressBarProps> = ({
  totalRounds,
  currentRound,
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  segmented = false,
}) => {
  const safeTotal = Math.max(1, totalRounds);
  const clampedCurrent = Math.min(Math.max(1, currentRound), safeTotal);

  if (!segmented) {
    const progress = clampedCurrent / safeTotal;
    return (
      <View
        style={[styles.continuousContainer, { width, height: height + 8 }]}
        accessibilityRole="progressbar"
        accessibilityLabel={`Round progress: ${clampedCurrent} of ${safeTotal}`}
      >
        <View style={[styles.continuousTrack, { height }]} />
        <View
          style={[
            styles.continuousFill,
            { width: Math.max(height, (width - 16) * progress), height },
          ]}
        />
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { width }]}
      accessibilityRole="progressbar"
      accessibilityLabel={`Round progress: ${clampedCurrent} of ${safeTotal}`}
    >
      {Array.from({ length: safeTotal }, (_, index) => {
        const isCompleted = index < clampedCurrent - 1;
        const isCurrent = index === clampedCurrent - 1;
        return (
          <View
            key={index}
            style={[
              styles.segment,
              {
                height,
                marginRight: index === safeTotal - 1 ? 0 : SEGMENT_GAP,
                backgroundColor: isCompleted
                  ? COLORS.PRIMARY
                  : isCurrent
                  ? 'rgba(255, 204, 0, 0.9)'
                  : 'rgba(128,128,128,0.3)',
              },
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  continuousContainer: {
    position: 'relative',
    backgroundColor: 'transparent',
    justifyContent: 'center',
  },
  continuousTrack: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 999,
  },
  continuousFill: {
    position: 'absolute',
    left: 4,
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 999,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.06)',
    padding: 6,
    borderRadius: 14,
  },
  segment: {
    flex: 1,
    borderRadius: 7,
  },
});

export default GymProgressBar;


