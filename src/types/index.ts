export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading' | 'ai' | 'default';

export type Position =
  | 'top-right' | 'top-left' | 'top-center'
  | 'bottom-right' | 'bottom-left' | 'bottom-center'
  | 'center';

export type AnimationPreset = 'spring' | 'slide' | 'bloom' | 'flip' | 'fade' | 'none';

export type ToastPriority = 'low' | 'normal' | 'high' | 'critical';

export type ThemePreset = 'auto' | 'light' | 'dark' | 'glass' | 'minimal' | 'brutal';

export interface ToastAction {
  label: string;
  onClick: (toastId: string) => void;
  variant?: 'primary' | 'ghost' | 'danger';
}

export interface AIMetadata {
  model?: string;          // e.g. "claude-3-5-sonnet"
  toolName?: string;       // MCP tool name
  confidence?: number;     // 0–1
  streaming?: boolean;     // is this a streaming update?
  tokens?: number;         // token count to display
  latencyMs?: number;      // response time
}

export interface ToastOptions {
  // Core
  message: string;
  title?: string;              // NEW: title above message
  type?: ToastType;
  position?: Position;
  duration?: number;           // 0 = persistent
  dismissible?: boolean;
  
  // NEW options
  animation?: AnimationPreset;
  theme?: ThemePreset;
  priority?: ToastPriority;    // affects queue order
  id?: string;                 // custom ID for updates
  
  // Rich content
  actions?: ToastAction[];     // action buttons
  icon?: string | HTMLElement; // custom icon (emoji or element)
  richHtml?: string;           // sanitized HTML body
  
  // AI-specific
  ai?: AIMetadata;
  
  // Behavior
  pauseOnHover?: boolean;      // pause countdown on hover
  pauseOnFocus?: boolean;      // pause when window loses focus
  onClose?: (id: string) => void;
  onClick?: (id: string) => void;
  
  // Internal
  maxToasts?: number;
  showProgress?: boolean;
  showIcon?: boolean;
  className?: string;
}

export type NormalizedToastOptions = Required<
  Omit<ToastOptions, "icon" | "title" | "actions" | "id" | "className" | "onClick" | "onClose" | "ai" | "richHtml">
> & {
  icon?: string | HTMLElement;
  title?: string;
  actions?: ToastAction[];
  id?: string;
  className?: string;
  onClick?: (id: string) => void;
  onClose?: (id: string) => void;
  ai?: AIMetadata;
  richHtml?: string;
};

export interface PromiseOptions<T> {
  loading: string | { title?: string; message: string };
  success: string | ((data: T) => string) | { title?: string; message: string | ((data: T) => string) };
  error: string | ((err: unknown) => string) | { title?: string; message: string | ((err: unknown) => string) };
  position?: Position;
  animation?: AnimationPreset;
  id?: string;
}

export interface StreamOptions {
  position?: Position;
  animation?: AnimationPreset;
  id?: string;
  title?: string;
  ai?: AIMetadata;
  onComplete?: (finalMessage: string) => void;
  onChunk?: (chunk: string, accumulated: string) => void;
  loadingMessage?: string;
}

export interface StreamController {
  update: (chunk: string) => void;  // append text chunk
  set: (message: string) => void;   // replace full message
  success: (message: string, options?: Partial<ToastOptions>) => void;
  error: (message: string, options?: Partial<ToastOptions>) => void;
  dismiss: () => void;
}

export interface QueueEntry {
  options: NormalizedToastOptions;
  priority: number;
  timestamp: number;
  id: string;
}
