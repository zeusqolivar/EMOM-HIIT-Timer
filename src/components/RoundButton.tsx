import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { COLORS } from '../constants/timer.constants';

interface RoundButtonProps {
  id: string;
  label?: string;
  value?: string;
  icon?: string;
  onPress: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
  isPressed?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const RoundButton: React.FC<RoundButtonProps> = ({
  label,
  value,
  icon,
  onPress,
  onPressIn,
  onPressOut,
  isPressed = false,
  style,
  textStyle,
}) => {
  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: isPressed ? COLORS.BUTTON_PRESSED : COLORS.PRIMARY,
            transform: [{ scale: isPressed ? 0.95 : 1.0 }],
          },
          style,
        ]}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={0.8}
      >
        {icon ? (
          <Text style={[styles.iconText, textStyle]}>{icon}</Text>
        ) : (
          <Text style={[styles.valueText, textStyle]}>{value}</Text>
        )}
        {label && <Text style={[styles.labelText, textStyle]}>{label}</Text>}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    width: '30%',
    aspectRatio: 1,
  },
  button: {
    flex: 1,
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  iconText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.BACKGROUND,
    marginBottom: 4,
  },
  valueText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.BACKGROUND,
    fontVariant: ['tabular-nums'],
    marginBottom: -8,
  },
  labelText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.BACKGROUND,
  },
});

export default RoundButton;
