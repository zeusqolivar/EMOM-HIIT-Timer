import React, { useRef, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import { COLORS } from '../constants/timer.constants';

interface CustomSegmentedControlProps<T> {
  selection: T;
  options: T[];
  onSelectionChange: (selection: T) => void;
  label: (option: T) => string;
  backgroundColor?: string;
  highlightColor?: string;
  textColor?: string;
  selectedTextColor?: string;
}

const CustomSegmentedControl = <T extends string>({
  selection,
  options,
  onSelectionChange,
  label,
  backgroundColor = COLORS.SEGMENT_BACKGROUND,
  highlightColor = COLORS.SEGMENT_SELECTED,
  textColor = COLORS.PRIMARY,
  selectedTextColor = COLORS.BACKGROUND,
}: CustomSegmentedControlProps<T>) => {
  const animatedValues = useRef<{ [key: string]: Animated.Value }>({});
  const highlightAnim = useRef(new Animated.Value(0)).current;

  // Initialize animated values for each option
  useEffect(() => {
    options.forEach(option => {
      if (!animatedValues.current[option]) {
        animatedValues.current[option] = new Animated.Value(0);
      }
    });
  }, [options]);

  // Animate selection change
  useEffect(() => {
    options.forEach(option => {
      const isSelected = option === selection;
      const targetValue = isSelected ? 1 : 0;
      
      Animated.spring(animatedValues.current[option], {
        toValue: targetValue,
        useNativeDriver: false,
        tension: 100,
        friction: 8,
      }).start();
    });
  }, [selection, options]);

  const handleSelectionChange = (newSelection: T) => {
    // Add spring animation for the highlight
    Animated.spring(highlightAnim, {
      toValue: 1,
      useNativeDriver: false,
      tension: 100,
      friction: 8,
    }).start(() => {
      highlightAnim.setValue(0);
    });

    onSelectionChange(newSelection);
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.optionsContainer}>
        {options.map((option, index) => {
          const isSelected = option === selection;
          const textParts = label(option).split('\n');
          const scale = animatedValues.current[option]?.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 1.05],
          }) || 1;
          
          return (
            <TouchableOpacity
              key={index}
              style={styles.option}
              onPress={() => handleSelectionChange(option)}
              activeOpacity={0.7}
            >
              <Animated.View style={[
                styles.optionBackground,
                {
                  backgroundColor: isSelected ? highlightColor : 'transparent',
                  transform: [{ scale }],
                }
              ]} />
              <View style={styles.textContainer}>
                <Text style={[
                  styles.mainText,
                  { color: isSelected ? selectedTextColor : textColor }
                ]}>
                  {textParts[0] || ''}
                </Text>
                <Text style={[
                  styles.subText,
                  { 
                    color: isSelected ? selectedTextColor : textColor,
                    opacity: isSelected ? 1 : 0.9
                  }
                ]}>
                  {textParts[1] || ''}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 4,
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  option: {
    flex: 1,
    paddingVertical: 20,
    borderRadius: 20,
    marginHorizontal: 2,
    position: 'relative',
  },
  optionBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
  },
  textContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  mainText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  subText: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 2,
  },
});

export default CustomSegmentedControl;
