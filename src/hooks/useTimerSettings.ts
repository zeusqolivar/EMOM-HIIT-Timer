import { useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TimerConfiguration, ActiveTimerSettings, WorkRestSplit } from '../types/timer.types';
import { TIMER_CONSTANTS, WORK_REST_SPLIT_CONFIG } from '../constants/timer.constants';



// Default values - matching original SwiftUI app
const DEFAULT_VALUES = {
  PREPARATION_TIME: 0 as number, // Match original: 0 seconds
  COOLDOWN_TIME: 0 as number,    // Match original: 0 seconds  
  NUMBER_OF_MINUTES: 10 as number, // Match original: 10 minutes
  SPEED_FACTOR: 1.0 as number,   // Match original: 1.0x speed
  SPLIT_TIME: 0 as number,       // Match original: 0 seconds
  SELECTED_SPLIT: WorkRestSplit.NONE,
} as const;

const SETTINGS_STORAGE_KEY = 'st_emom_timer_settings_key';

export const useTimerSettings = () => {
  const [settings, setSettings] = useState<TimerConfiguration>({
    numberOfRounds: DEFAULT_VALUES.NUMBER_OF_MINUTES,
    isInfiniteMode: false,
    restIntervalSeconds: DEFAULT_VALUES.SPLIT_TIME,
    selectedWorkRestSplit: DEFAULT_VALUES.SELECTED_SPLIT,
    availablePresetRounds: [...TIMER_CONSTANTS.DEFAULT_PRESET_ROUNDS],
    preparationTime: DEFAULT_VALUES.PREPARATION_TIME,
    cooldownTime: DEFAULT_VALUES.COOLDOWN_TIME,
    speedUpTimer: false,
  });

  const [preparationTime, setPreparationTime] = useState(DEFAULT_VALUES.PREPARATION_TIME);
  const [cooldownTime, setCooldownTime] = useState(DEFAULT_VALUES.COOLDOWN_TIME);
  const [speedFactor, setSpeedFactor] = useState(DEFAULT_VALUES.SPEED_FACTOR);

  // Load settings from storage on mount
  useEffect(() => {
    loadSettings();
  }, []);

  // Save settings to storage whenever settings change
  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(parsedSettings);
      }
    } catch (error) {
      console.log('Error loading settings:', error);
    }
  };

  const saveSettings = async (settingsToSave: TimerConfiguration) => {
    try {
      await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settingsToSave));
    } catch (error) {
      console.log('Error saving settings:', error);
    }
  };

  // Update settings
  const updateSettings = useCallback((updates: Partial<TimerConfiguration>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  }, []);

  const updatePreparationTime = useCallback((time: number) => {
    setPreparationTime(time);
  }, []);

  const updateCooldownTime = useCallback((time: number) => {
    setCooldownTime(time);
  }, []);

  const updateSpeedFactor = useCallback((factor: number) => {
    setSpeedFactor(factor);
  }, []);

  const createNewTimerSettings = useCallback((): ActiveTimerSettings => {
    const splitConfig = WORK_REST_SPLIT_CONFIG[settings.selectedWorkRestSplit as WorkRestSplit];
    const workIntervalSeconds = splitConfig?.workSeconds || 60;
    const restIntervalSeconds = settings.restIntervalSeconds;
    
    return {
      workIntervalSeconds,
      restIntervalSeconds,
      totalRounds: settings.numberOfRounds,
      isInfiniteMode: settings.isInfiniteMode,
    };
  }, [settings]);

  return {
    // Settings state
    settings,
    preparationTime,
    cooldownTime,
    speedFactor,
    
    // Update functions
    updateSettings,
    updatePreparationTime,
    updateCooldownTime,
    updateSpeedFactor,
    
    // Timer creation
    createNewTimerSettings,
  };
};
