import { POSITIONS } from './positions';

export const DEFAULT_OPTIONS = {
  type: 'info' as const,
  duration: 3000,
  position: POSITIONS.TOP_RIGHT,
  dismissible: true,
  maxToasts: 5
} as const;
