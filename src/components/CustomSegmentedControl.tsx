import React, { useRef, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
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
  const slideAnim = useRef(new Animated.Value(0)).current;
  const [containerWidth, setContainerWidth] = React.useState(0);
  const [optionWidth, setOptionWidth] = React.useState(0);

  // Calculate slide position based on selection
  useEffect(() => {
    const selectedIndex = options.findIndex(option => option === selection);
    if (selectedIndex !== -1 && optionWidth > 0) {
      const targetPosition = selectedIndex * optionWidth;
      
      Animated.timing(slideAnim, {
        toValue: targetPosition,
        duration: 250,
        useNativeDriver: false,
      }).start();
    }
  }, [selection, options, optionWidth, slideAnim]);

  const handleSelectionChange = (newSelection: T) => {
    onSelectionChange(newSelection);
  };

  const handleLayout = (event: any) => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(width);
    setOptionWidth(width / options.length);
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.optionsContainer} onLayout={handleLayout}>
        {/* Sliding background indicator */}
        {optionWidth > 0 && (
          <Animated.View
            style={[
              styles.slidingIndicator,
              {
                backgroundColor: highlightColor,
                width: optionWidth,
                transform: [{ translateX: slideAnim }],
              },
            ]}
          />
        )}
        
        {options.map((option, index) => {
          const isSelected = option === selection;
          const textParts = label(option).split('\n');
          
          return (
            <TouchableOpacity
              key={index}
              style={styles.option}
              onPress={() => handleSelectionChange(option)}
              activeOpacity={0.7}
            >
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
    position: 'relative',
  },
  slidingIndicator: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    borderRadius: 20,
    zIndex: 1,
  },
  option: {
    flex: 1,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  textContainer: {
    alignItems: 'center',
    justifyContent: 'center',
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
