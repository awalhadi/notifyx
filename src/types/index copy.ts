
import type { Position } from '../constants/positions';

export type { Position } from '../constants/positions';
export type ToastType = 'success' | 'error' | 'warning' | 'info';

/**
 * Toast notification configuration options
 */
export interface ToastOptions {
  /** The message to display in the toast */
  message: string;
  /** Type of toast notification */
  type?: ToastType;
  /** Duration in milliseconds (0 = persistent) */
  duration?: number;
  /** Position on screen */
  position?: Position;
  /** Whether the toast can be manually dismissed */
  dismissible?: boolean;
  /** Show a small progress bar indicating remaining time (true = show) */
  showProgress?: boolean;
  /** Callback fired when toast is closed */
  onClose?: () => void;
  /** Maximum number of toasts to show simultaneously */
  maxToasts?: number;
}

/**
 * Result returned by promise-based notification methods
 */
export type ToastResult = {
  /** Unique id for the toast */
  id: string;
  /** Why the toast was closed */
  reason: 'timeout' | 'manual' | 'clear' | 'overflow' | 'removed';
};

/**
 * Normalized toast options with all required fields
 * @internal
 */
export type NormalizedToastOptions = Required<ToastOptions>;