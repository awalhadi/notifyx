export const POSITIONS = {
  TOP_RIGHT: 'top-right',
  TOP_LEFT: 'top-left',
  TOP_CENTER: 'top-center',
  BOTTOM_RIGHT: 'bottom-right',
  BOTTOM_LEFT: 'bottom-left',
  BOTTOM_CENTER: 'bottom-center',
  CENTER: 'center',
} as const;

export const ANIMATION_PRESETS = {
  SPRING: 'spring',
  SLIDE: 'slide',
  BLOOM: 'bloom',
  FLIP: 'flip',
  FADE: 'fade',
  NONE: 'none',
} as const;

export const THEMES = {
  AUTO: 'auto',
  LIGHT: 'light',
  DARK: 'dark',
  GLASS: 'glass',
  MINIMAL: 'minimal',
  BRUTAL: 'brutal',
} as const;

export const DEFAULT_OPTIONS = {
  type: 'info',
  duration: 3000,
  position: 'top-right',
  dismissible: true,
  maxToasts: 5,
  animation: 'spring',
  theme: 'auto',
  pauseOnHover: true,
  pauseOnFocus: false,
  priority: 'normal',
} as const;
