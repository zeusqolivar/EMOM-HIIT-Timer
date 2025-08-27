import { useState, useCallback } from 'react';
import { TimerConfiguration, ActiveTimerSettings, WorkRestSplit } from '../types/timer.types';
import { TIMER_CONSTANTS, WORK_REST_SPLIT_CONFIG } from '../constants/timer.constants';



// Default values
const DEFAULT_VALUES = {
  PREPARATION_TIME: 0 as number,
  COOLDOWN_TIME: 0 as number,
  NUMBER_OF_MINUTES: 10 as number,
  SPEED_FACTOR: 1.0 as number,
  SPLIT_TIME: 0 as number,
  SELECTED_SPLIT: WorkRestSplit.NONE,
} as const;

export const useTimerSettings = () => {
  const [settings, setSettings] = useState<TimerConfiguration>({
    numberOfRounds: DEFAULT_VALUES.NUMBER_OF_MINUTES,
    isInfiniteMode: false,
    restIntervalSeconds: DEFAULT_VALUES.SPLIT_TIME,
    selectedWorkRestSplit: DEFAULT_VALUES.SELECTED_SPLIT,
    availablePresetRounds: [...TIMER_CONSTANTS.DEFAULT_PRESET_ROUNDS],
  });

  const [preparationTime, setPreparationTime] = useState(DEFAULT_VALUES.PREPARATION_TIME);
  const [cooldownTime, setCooldownTime] = useState(DEFAULT_VALUES.COOLDOWN_TIME);
  const [speedFactor, setSpeedFactor] = useState(DEFAULT_VALUES.SPEED_FACTOR);

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
