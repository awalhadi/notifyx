import { Position } from '../constants/index';

export type ToastType = 'success' | 'error' | 'warning' | 'info';
export interface ToastOptions {
  message: string;
  type?: ToastType;
  duration?: number;
  position?: Position;
  dismissible?: boolean;
  onClose?: () => void;
  maxToasts?: number;
}