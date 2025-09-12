import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
  Switch,
} from 'react-native';
import { COLORS } from '../constants/timer.constants';

interface SettingsSheetProps {
  visible: boolean;
  onClose: () => void;
  preparationTime: number;
  cooldownTime: number;
  speedUpTimer: boolean;
  onPreparationTimeChange: (time: number) => void;
  onCooldownTimeChange: (time: number) => void;
  onSpeedUpTimerChange: (enabled: boolean) => void;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const SettingsSheet: React.FC<SettingsSheetProps> = ({
  visible,
  onClose,
  preparationTime,
  cooldownTime,
  speedUpTimer,
  onPreparationTimeChange,
  onCooldownTimeChange,
  onSpeedUpTimerChange,
}) => {
  const preparationOptions = [
    { label: 'None', value: 0, display: 'None' },
    { label: '0:03 SEC', value: 3, display: '0:03', unit: 'SEC' },
    { label: '0:10 SEC', value: 10, display: '0:10', unit: 'SEC' },
  ];

  const cooldownOptions = [
    { label: 'None', value: 0, display: 'None' },
    { label: '1:00 MIN', value: 60, display: '1:00', unit: 'MIN' },
    { label: '2:00 MIN', value: 120, display: '2:00', unit: 'MIN' },
    { label: '5:00 MIN', value: 300, display: '5:00', unit: 'MIN' },
  ];

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Preparation Time Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preparation Time</Text>
          <View style={styles.optionsContainer}>
            {preparationOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionButton,
                  {
                    backgroundColor: preparationTime === option.value 
                      ? COLORS.PRIMARY 
                      : 'rgba(255, 204, 0, 0.2)',
                  },
                ]}
                onPress={() => onPreparationTimeChange(option.value)}
              >
                <Text
                  style={[
                    styles.optionText,
                    {
                      color: preparationTime === option.value 
                        ? '#000000' 
                        : '#FFFFFF',
                    },
                  ]}
                >
                  {option.display}
                </Text>
                {option.unit && (
                  <Text
                    style={[
                      styles.optionUnit,
                      {
                        color: preparationTime === option.value 
                          ? '#000000' 
                          : '#FFFFFF',
                      },
                    ]}
                  >
                    {option.unit}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Cooldown Time Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: '#007AFF' }]}>Cooldown Time</Text>
          <View style={styles.optionsContainer}>
            {cooldownOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionButton,
                  {
                    backgroundColor: cooldownTime === option.value 
                      ? '#007AFF' 
                      : 'rgba(0, 122, 255, 0.2)',
                  },
                ]}
                onPress={() => onCooldownTimeChange(option.value)}
              >
                <Text
                  style={[
                    styles.optionText,
                    {
                      color: cooldownTime === option.value 
                        ? '#FFFFFF' 
                        : '#FFFFFF',
                    },
                  ]}
                >
                  {option.display}
                </Text>
                {option.unit && (
                  <Text
                    style={[
                      styles.optionUnit,
                      {
                        color: cooldownTime === option.value 
                          ? '#FFFFFF' 
                          : '#FFFFFF',
                      },
                    ]}
                  >
                    {option.unit}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Speed Up Timer Section */}
        <View style={styles.section}>
          <View style={styles.toggleContainer}>
            <Text style={styles.sectionTitle}>Speed Up Timer (4x)</Text>
            <Switch
              value={speedUpTimer}
              onValueChange={onSpeedUpTimerChange}
              trackColor={{ false: 'rgba(255, 255, 255, 0.2)', true: 'rgba(255, 255, 255, 0.2)' }}
              thumbColor={speedUpTimer ? '#FFFFFF' : '#FFFFFF'}
              ios_backgroundColor="rgba(255, 255, 255, 0.2)"
            />
          </View>
        </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  container: {
    backgroundColor: '#000000',
    borderRadius: 32,
    paddingTop: 20,
    paddingBottom: 20,
    width: '100%',
    maxWidth: 400,
    maxHeight: screenHeight * 0.8,
    borderWidth: 3,
    borderColor: '#FFD700', // Yellow border
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    minWidth: 80,
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  optionUnit: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default SettingsSheet;
