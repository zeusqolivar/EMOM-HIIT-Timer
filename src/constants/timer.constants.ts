import { WorkRestSplit } from '../types/timer.types';

export const TIMER_CONSTANTS = {
  DEFAULT_PRESET_ROUNDS: [5, 10, 12, 15, 20, 30, 45, 60],
  INFINITE_MODE_LABEL: 'INFINITE',
  UPGRADE_BUTTON_LABEL: 'Upgrade',
  MINUTES_LABEL: 'MIN',
  HEADER_TITLE: '',
} as const;

export const WORK_REST_SPLIT_CONFIG = {
  [WorkRestSplit.NONE]: {
    workSeconds: 60,
    restSeconds: 0,
  },
  [WorkRestSplit.THIRTY_THIRTY]: {
    workSeconds: 30,
    restSeconds: 30,
  },
  [WorkRestSplit.FORTY_TWENTY]: {
    workSeconds: 40,
    restSeconds: 20,
  },
  [WorkRestSplit.FORTY_FIVE_FIFTEEN]: {
    workSeconds: 45,
    restSeconds: 15,
  },
} as const;

export const COLORS = {
  PRIMARY: '#FF6B35',
  BACKGROUND: '#000000',
  TEXT: '#FFFFFF',
  ACCENT: 'rgba(255, 107, 53, 0.3)',
  BUTTON_PRESSED: 'rgba(255, 107, 53, 0.3)',
  SEGMENT_BACKGROUND: 'rgba(255, 107, 53, 0.2)',
  SEGMENT_SELECTED: '#FF6B35',
  SEGMENT_UNSELECTED: 'rgba(255, 107, 53, 0.6)',
} as const;
