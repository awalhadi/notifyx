import NotifyX from './core/NotifyX';

export default NotifyX;

export type {
  ToastType,
  Position,
  AnimationPreset,
  ToastPriority,
  ThemePreset,
  ToastAction,
  ToastOptions,
  PromiseOptions,
  StreamOptions,
  StreamController,
  AIMetadata,
} from './types';

if (typeof window !== 'undefined') {
  (window as any).NotifyX = NotifyX;
}
