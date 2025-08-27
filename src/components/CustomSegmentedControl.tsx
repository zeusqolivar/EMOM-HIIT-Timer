import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { COLORS } from '../constants/timer.constants';

interface CustomSegmentedControlProps<T> {
  options: T[];
  selectedOption: T;
  onOptionSelect: (option: T) => void;
  renderOption: (option: T) => React.ReactNode;
  backgroundColor?: string;
  highlightColor?: string;
  textColor?: string;
  selectedTextColor?: string;
}

const CustomSegmentedControl = <T,>({
  options,
  selectedOption,
  onOptionSelect,
  renderOption,
  backgroundColor = COLORS.SEGMENT_BACKGROUND,
  highlightColor = COLORS.SEGMENT_SELECTED,
  textColor = COLORS.SEGMENT_UNSELECTED,
  selectedTextColor = COLORS.BACKGROUND,
}: CustomSegmentedControlProps<T>) => {
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {options.map((option, index) => {
          const isSelected = option === selectedOption;
          
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.option,
                isSelected && { backgroundColor: highlightColor },
              ]}
              onPress={() => onOptionSelect(option)}
              activeOpacity={0.7}
            >
              <View style={styles.optionContent}>
                {renderOption(option)}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 4,
  },
  scrollContent: {
    paddingHorizontal: 4,
  },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 2,
    minWidth: 80,
  },
  optionContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CustomSegmentedControl;
