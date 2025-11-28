import type { Position } from "../constants/positions";

export type { Position } from "../constants/positions";

/**
 * Toast notification types
 * @public
 */
export type ToastType = "success" | "error" | "warning" | "info" | "default";

/**
 * Toast notification configuration options
 * @public
 */
export interface ToastOptions {
  /** The message to display in the toast */
  message: string;

  /** Type of toast notification */
  type?: ToastType;

  /** Duration in milliseconds (0 = persistent, stays until manually dismissed) */
  duration?: number;

  /** Position on screen */
  position?: Position;

  /** Whether the toast can be manually dismissed */
  dismissible?: boolean;

  /** Show a progress bar indicating remaining time */
  showProgress?: boolean;

  /** Show icon based on toast type */
  showIcon?: boolean;

  /** Custom icon to display (overrides default type icon) */
  icon?: string;

  /** Pause auto-dismiss timer on hover */
  pauseOnHover?: boolean;

  /** Callback fired when toast is closed */
  onClose?: () => void;

  /** Maximum number of toasts to show simultaneously */
  maxToasts?: number;
}

/**
 * Normalized toast options with all required fields
 * @internal
 */
export type NormalizedToastOptions = Required<Omit<ToastOptions, "icon">> & {
  icon?: string;
};

/**
 * Promise-based toast messages configuration
 * @public
 */
export interface PromiseMessages<T = any> {
  /** Message to show while promise is pending */
  loading: string;

  /** Message to show when promise resolves (can be a function receiving the result) */
  success: string | ((data: T) => string);

  /** Message to show when promise rejects (can be a function receiving the error) */
  error: string | ((error: any) => string);
}
