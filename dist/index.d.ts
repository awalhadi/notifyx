export declare interface AIMetadata {
    model?: string;
    toolName?: string;
    confidence?: number;
    streaming?: boolean;
    tokens?: number;
    latencyMs?: number;
}

export declare const ANIMATION_PRESETS: {
    readonly SPRING: "spring";
    readonly SLIDE: "slide";
    readonly BLOOM: "bloom";
    readonly FLIP: "flip";
    readonly FADE: "fade";
    readonly NONE: "none";
};

/**
 * AnimationEngine — centralises all animation logic.
 * @public
 */
declare class AnimationEngine {
    private static prefersReducedMotion;
    /**
     * Apply the enter animation to a toast element.
     * Accepts optional position/theme args (currently unused — reserved for slide direction override).
     */
    static enter(el: HTMLElement, style?: AnimationPreset, _position?: string): void;
    /**
     * Apply the exit animation and return a Promise that resolves when done.
     */
    static exit(el: HTMLElement, style?: AnimationPreset, _position?: string): Promise<void>;
    /**
     * Brief attention-shake animation (used for critical priority toasts).
     */
    static shake(el: HTMLElement): void;
    /**
     * Pulse attention on an existing toast (e.g. dedup hit).
     */
    static pulse(el: HTMLElement): void;
    /**
     * Post-stream celebratory shimmer.
     */
    static shimmerHighlight(el: HTMLElement): void;
    /**
     * Stagger entrance of multiple elements (e.g. queue flush).
     */
    static staggerEnter(elements: HTMLElement[], style?: AnimationPreset, delayMs?: number): void;
}

export declare type AnimationPreset = 'spring' | 'slide' | 'bloom' | 'flip' | 'fade' | 'none';

export declare const DEFAULT_OPTIONS: {
    readonly type: "info";
    readonly duration: 3000;
    readonly position: "top-right";
    readonly dismissible: true;
    readonly maxToasts: 5;
    readonly animation: "spring";
    readonly theme: "auto";
    readonly pauseOnHover: true;
    readonly pauseOnFocus: false;
    readonly priority: "normal";
};

declare type NormalizedToastOptions = Required<Omit<ToastOptions, "icon" | "title" | "actions" | "id" | "className" | "onClick" | "onClose" | "ai" | "richHtml">> & {
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

/**
 * NotifyX — AI-native, premium toast notification library.
 * Zero dependencies · Framework-agnostic · TypeScript-first
 * @public
 */
declare class NotifyX {
    /** @private */
    private static attachGestures;
    /** @private */
    private static createToastElement;
    /** @private */
    private static createLoaderElement;
    /** @private */
    private static removeToast;
    /** @private */
    private static setupAutoDismiss;
    /** @private */
    private static enforceMaxToasts;
    /**
     * Show a toast. Returns the toast element for imperative control.
     * @public
     */
    static show(options: ToastOptions): HTMLElement;
    /** @public */
    static success(msg: string, options?: Partial<ToastOptions>): HTMLElement;
    /** @public */
    static error(msg: string, options?: Partial<ToastOptions>): HTMLElement;
    /** @public */
    static warning(msg: string, options?: Partial<ToastOptions>): HTMLElement;
    /** @public */
    static info(msg: string, options?: Partial<ToastOptions>): HTMLElement;
    /** @public */
    static ai(msg: string, options?: Partial<ToastOptions> & {
        agentName?: string;
        confidence?: number;
        showCursor?: boolean;
    }): HTMLElement;
    /**
     * Show a centered loading toast. Dismiss with `dismissLoading()`.
     * @public
     */
    static loading(msg: string, options?: Partial<ToastOptions>): void;
    /** @public */
    static dismissLoading(): void;
    /**
     * Promise-based toast — loading → success | error.
     * @public
     */
    /**
     * Shows a loading toast, then auto-transitions to success or error.
     * Perfect for API calls, file uploads, form submissions.
     */
    static promise<T>(promiseOrFn: Promise<T> | (() => Promise<T>), options: PromiseOptions<T>): Promise<T>;
    /**
     * Shows an AI-typing-style toast that streams text chunk by chunk.
     * Returns a StreamController to push chunks from LLM streams.
     */
    static stream(options: StreamOptions): StreamController;
    /**
     * Update an existing toast by ID (message, type, anything).
     */
    static update(id: string, options: Partial<ToastOptions>): void;
    /**
     * Pause all running timers (e.g., when showing a modal).
     */
    static pauseAll(): void;
    /**
     * Resume all paused timers.
     */
    static resumeAll(): void;
    /**
     * Show multiple toasts as a grouped batch with shared dismiss.
     */
    static batch(toasts: ToastOptions[], sharedOptions?: Partial<ToastOptions>): string[];
    /**
     * Change global default theme at runtime.
     */
    static setTheme(theme: ThemePreset): void;
    /**
     * Set global defaults once.
     */
    static configure(defaults: Partial<ToastOptions>): void;
    /**
     * Dismiss a toast by ID string or HTMLElement reference.
     * @public
     */
    static dismiss(idOrEl: string | HTMLElement): void;
    /**
     * Clear all active toasts.
     * @public
     */
    static clear(): void;
    /** Access the global priority queue for advanced use cases. */
    static get queue(): ToastQueue;
    /** Access AnimationEngine for advanced animation control. */
    static get animation(): typeof AnimationEngine;
    /** Access StreamBridge for streaming utilities. */
    static get stream_bridge(): typeof StreamBridge;
}
export default NotifyX;

declare type Position_2 = 'top-right' | 'top-left' | 'top-center' | 'bottom-right' | 'bottom-left' | 'bottom-center' | 'center';
export { Position_2 as Position }

export declare const POSITIONS: {
    readonly TOP_RIGHT: "top-right";
    readonly TOP_LEFT: "top-left";
    readonly TOP_CENTER: "top-center";
    readonly BOTTOM_RIGHT: "bottom-right";
    readonly BOTTOM_LEFT: "bottom-left";
    readonly BOTTOM_CENTER: "bottom-center";
    readonly CENTER: "center";
};

export declare interface PromiseOptions<T> {
    loading: string | {
        title?: string;
        message: string;
    };
    success: string | ((data: T) => string) | {
        title?: string;
        message: string | ((data: T) => string);
    };
    error: string | ((err: unknown) => string) | {
        title?: string;
        message: string | ((err: unknown) => string);
    };
    position?: Position_2;
    animation?: AnimationPreset;
    id?: string;
}

declare interface QueueEntry {
    options: NormalizedToastOptions;
    priority: number;
    timestamp: number;
    id: string;
}

/**
 * StreamBridge — pure utility class for reading streaming sources.
 * No circular dependency on NotifyX. The NotifyX class calls these
 * helpers to obtain async generators it pipes into DOM elements.
 * @public
 */
declare class StreamBridge {
    /**
     * Yields decoded string chunks from a fetch() ReadableStream<Uint8Array>.
     */
    static fromUint8Stream(stream: ReadableStream<Uint8Array>, parseChunk?: (raw: string) => string): AsyncGenerator<string>;
    /**
     * Extracts text chunks from an AsyncIterable (OpenAI / Anthropic / custom).
     * Uses a heuristic extractor that handles common LLM SDK chunk shapes.
     */
    static fromIterable<T>(source: AsyncIterable<T>, extract?: (chunk: T) => string): AsyncGenerator<string>;
    /**
     * Yields characters from a plain string with a delay (for demos / testing).
     */
    static fakeStream(text: string, chunkSize?: number, delayMs?: number): AsyncGenerator<string>;
    /**
     * Pipes any supported source into a DOM element's textContent,
     * appending each chunk. Returns the full accumulated text.
     *
     * Supported sources:
     *   - string (immediate)
     *   - Promise<string>
     *   - AsyncIterable<T>
     *   - ReadableStream<Uint8Array>  (fetch body)
     *   - ReadableStream<string>
     */
    static pipe<T>(source: string | Promise<string> | AsyncIterable<T> | ReadableStream<Uint8Array> | ReadableStream<string>, target: HTMLElement, onChunk?: (chunk: string, full: string) => void): Promise<string>;
    /**
     * Heuristic text extractor — handles common LLM SDK chunk shapes.
     */
    static extractText(chunk: unknown): string;
}

export declare interface StreamController {
    update: (chunk: string) => void;
    set: (message: string) => void;
    success: (message: string, options?: Partial<ToastOptions>) => void;
    error: (message: string, options?: Partial<ToastOptions>) => void;
    dismiss: () => void;
}

export declare interface StreamOptions {
    position?: Position_2;
    animation?: AnimationPreset;
    id?: string;
    title?: string;
    ai?: AIMetadata;
    onComplete?: (finalMessage: string) => void;
    onChunk?: (chunk: string, accumulated: string) => void;
    loadingMessage?: string;
}

export declare type ThemePreset = 'auto' | 'light' | 'dark' | 'glass' | 'minimal' | 'brutal';

export declare const THEMES: {
    readonly AUTO: "auto";
    readonly LIGHT: "light";
    readonly DARK: "dark";
    readonly GLASS: "glass";
    readonly MINIMAL: "minimal";
    readonly BRUTAL: "brutal";
};

export declare interface ToastAction {
    label: string;
    onClick: (toastId: string) => void;
    variant?: 'primary' | 'ghost' | 'danger';
}

export declare interface ToastOptions {
    message: string;
    title?: string;
    type?: ToastType;
    position?: Position_2;
    duration?: number;
    dismissible?: boolean;
    animation?: AnimationPreset;
    theme?: ThemePreset;
    priority?: ToastPriority;
    id?: string;
    actions?: ToastAction[];
    icon?: string | HTMLElement;
    richHtml?: string;
    ai?: AIMetadata;
    pauseOnHover?: boolean;
    pauseOnFocus?: boolean;
    onClose?: (id: string) => void;
    onClick?: (id: string) => void;
    maxToasts?: number;
    showProgress?: boolean;
    showIcon?: boolean;
    className?: string;
}

export declare type ToastPriority = 'low' | 'normal' | 'high' | 'critical';

/* Excluded from this release type: ToastQueue */

export declare type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading' | 'ai' | 'default';

export { }
