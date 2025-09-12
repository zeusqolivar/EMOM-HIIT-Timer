export enum TimerScene {
  PRESET_SELECTION = 'preset_selection',
  PREPARATION = 'preparation',
  TIMER_ACTIVE = 'timer_active',
}

export enum WorkRestSplit {
  NONE = 'NO\nSPLIT',
  THIRTY_THIRTY = '30|30\nSPLIT',
  FORTY_TWENTY = '40|20\nSPLIT',
  FORTY_FIVE_FIFTEEN = '45|15\nSPLIT',
}

export interface TimerConfiguration {
  numberOfRounds: number;
  isInfiniteMode: boolean;
  restIntervalSeconds: number;
  selectedWorkRestSplit: string;
  availablePresetRounds: number[];
  preparationTime: number;
  cooldownTime: number;
  speedUpTimer: boolean;
}

export interface ActiveTimerSettings {
  workIntervalSeconds: number;
  restIntervalSeconds: number;
  totalRounds: number;
  isInfiniteMode: boolean;
}

export interface ButtonInteractionState {
  currentlyPressedButtonId: string | null;
}

export interface TimerState {
  isRunning: boolean;
  currentRound: number;
  timeRemaining: number;
  isWorkPhase: boolean;
}
