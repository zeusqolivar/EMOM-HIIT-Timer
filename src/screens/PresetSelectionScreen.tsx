import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { WorkRestSplit, ButtonInteractionState } from '../types/timer.types';
import { TIMER_CONSTANTS, COLORS, WORK_REST_SPLIT_CONFIG } from '../constants/timer.constants';
import { useTimerSettings } from '../hooks/useTimerSettings';
import CustomSegmentedControl from '../components/CustomSegmentedControl';
import RoundButton from '../components/RoundButton';

interface PresetSelectionScreenProps {
  timerSettings: ReturnType<typeof useTimerSettings>;
  onRoundSelect: (rounds: number) => void;
}

const { width: screenWidth } = Dimensions.get('window');

const PresetSelectionScreen: React.FC<PresetSelectionScreenProps> = ({
  timerSettings,
  onRoundSelect,
}) => {
  const [buttonInteractionState, setButtonInteractionState] = useState<ButtonInteractionState>({
    currentlyPressedButtonId: null,
  });
  const [selectedTimeSplit, setSelectedTimeSplit] = useState<WorkRestSplit>(
    timerSettings.settings.selectedWorkRestSplit as WorkRestSplit
  );

  // Sync selectedTimeSplit when timerSettings change
  useEffect(() => {
    setSelectedTimeSplit(timerSettings.settings.selectedWorkRestSplit as WorkRestSplit);
  }, [timerSettings.settings.selectedWorkRestSplit]);

  const handleRoundSelect = (rounds: number) => {
    timerSettings.updateSettings({ 
      numberOfRounds: rounds,
      isInfiniteMode: rounds === 1 && timerSettings.settings.isInfiniteMode 
    });
    onRoundSelect(rounds);
  };

  const handleInfiniteMode = () => {
    timerSettings.updateSettings({ isInfiniteMode: true });
    onRoundSelect(1);
  };

  const handleTimeSplitChange = (split: WorkRestSplit) => {
    setSelectedTimeSplit(split);
    const splitConfig = WORK_REST_SPLIT_CONFIG[split];
    timerSettings.updateSettings({
      selectedWorkRestSplit: split,
      restIntervalSeconds: splitConfig.restSeconds,
    });
  };

  const handleButtonPress = (buttonId: string) => {
    setButtonInteractionState({ currentlyPressedButtonId: buttonId });
  };

  const handleButtonRelease = () => {
    setButtonInteractionState({ currentlyPressedButtonId: null });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{TIMER_CONSTANTS.HEADER_TITLE}</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.upgradeButton}>
            <Text style={styles.upgradeButtonText}>
              {TIMER_CONSTANTS.UPGRADE_BUTTON_LABEL}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingsButton}>
            <Text style={styles.settingsButtonText}>⋯</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Round Selection Grid */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.gridContainer}>
          <View style={styles.grid}>
            {/* Infinite Mode Button */}
            <RoundButton
              id="infinite"
              label={TIMER_CONSTANTS.INFINITE_MODE_LABEL}
              icon="∞"
              onPress={handleInfiniteMode}
              isPressed={buttonInteractionState.currentlyPressedButtonId === 'infinite'}
              onPressIn={() => handleButtonPress('infinite')}
              onPressOut={handleButtonRelease}
            />

            {/* Round Buttons */}
            {timerSettings.settings.availablePresetRounds.map((rounds) => (
              <RoundButton
                key={`rounds_${rounds}`}
                id={`rounds_${rounds}`}
                label={TIMER_CONSTANTS.MINUTES_LABEL}
                value={rounds.toString().padStart(2, '0')}
                onPress={() => handleRoundSelect(rounds)}
                isPressed={buttonInteractionState.currentlyPressedButtonId === `rounds_${rounds}`}
                onPressIn={() => handleButtonPress(`rounds_${rounds}`)}
                onPressOut={handleButtonRelease}
              />
            ))}
          </View>

          {/* Time Split Control */}
          <View style={styles.splitControlContainer}>
                      <CustomSegmentedControl
            selection={selectedTimeSplit}
            options={Object.values(WorkRestSplit)}
            onSelectionChange={handleTimeSplitChange}
            label={(option) => option}
          />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    flex: 1,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  upgradeButton: {
    backgroundColor: COLORS.ACCENT,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  upgradeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.PRIMARY,
  },
  settingsButton: {
    backgroundColor: COLORS.ACCENT,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsButtonText: {
    fontSize: 20,
    color: COLORS.PRIMARY,
  },
  scrollView: {
    flex: 1,
  },
  gridContainer: {
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    marginBottom: 30,
  },
  splitControlContainer: {
    marginBottom: 20,
  },
  splitOptionText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    textAlign: 'center',
  },
});

export default PresetSelectionScreen;
