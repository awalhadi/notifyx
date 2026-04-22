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

export { POSITIONS, ANIMATION_PRESETS, THEMES, DEFAULT_OPTIONS } from './core/constants';

if (typeof window !== 'undefined') {
  (window as any).NotifyX = NotifyX;
}
