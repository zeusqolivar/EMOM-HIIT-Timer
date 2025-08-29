import { useState, useCallback } from 'react';
import { EMOMSettings, TimeSplit, TimerSettings } from '../types';

const DEFAULT_PRESET_ROUNDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20, 25, 30];

export const useEMOMSettings = () => {
  const [settings, setSettings] = useState<EMOMSettings>({
    numberOfMinutes: 1,
    isInfiniteMode: false,
    splitTime: 0,
    selectedSplit: TimeSplit.NONE,
    presetRounds: DEFAULT_PRESET_ROUNDS,
  });

  const updateSettings = useCallback((updates: Partial<EMOMSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  }, []);

  const createNewTimerViewModel = useCallback((): TimerSettings => {
    const workSeconds = getWorkSecondsFromSplit(settings.selectedSplit);
    const restSeconds = settings.splitTime;
    
    return {
      workSeconds,
      restSeconds,
      totalRounds: settings.numberOfMinutes,
      isInfiniteMode: settings.isInfiniteMode,
    };
  }, [settings]);

  return {
    settings,
    updateSettings,
    createNewTimerViewModel,
  };
};

const getWorkSecondsFromSplit = (split: string): number => {
  switch (split) {
    case TimeSplit.NONE:
      return 60;
    case TimeSplit.SPLIT_30_30:
      return 30;
    case TimeSplit.SPLIT_40_20:
      return 40;
    case TimeSplit.SPLIT_45_15:
      return 45;
    default:
      return 60;
  }
};
