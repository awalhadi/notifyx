/**
 * CSS animation class names
 * @public
 */
export declare const ANIMATION_CLASSES: {
    readonly enter: "notifyx-enter";
    readonly exit: "notifyx-exit";
    readonly slideEnter: "notifyx-slide-enter";
    readonly slideExit: "notifyx-slide-exit";
};

/**
 * Default toast configuration
 * @public
 */
export declare const DEFAULT_OPTIONS: {
    readonly type: "default";
    readonly duration: 3000;
    readonly showProgress: true;
    readonly showIcon: true;
    readonly pauseOnHover: true;
    readonly position: "top-right";
    readonly dismissible: true;
    readonly maxToasts: 5;
};

/**
 * NotifyX - Modern toast notification library
 * @public
 */
declare class NotifyX {
    /**
     * Creates the toast DOM element
     * @private
     */
    private static createToastElement;
    /**
     * Creates loader element for loading state
     * @private
     */
    private static createLoaderElement;
    /**
     * Creates simple close button (just × icon)
     * @private
     */
    private static createCloseButton;
    /**
     * Removes a toast with exit animation
     * @private
     */
    private static removeToast;
    /**
     * Removes container if it has no children
     * @private
     */
    private static cleanupEmptyContainer;
    /**
     * FIXED: Manages auto-dismiss timer with pause on hover
     * @private
     */
    private static setupAutoDismiss;
    /**
     * Enforces maximum toast limit
     * @private
     */
    private static enforceMaxToasts;
    /**
     * Display a toast notification
     * @public
     */
    static show(options: ToastOptions): void;
    /**
     * Display a success toast
     * @public
     */
    static success(message: string, options?: Partial<ToastOptions>): void;
    /**
     * Display an error toast
     * @public
     */
    static error(message: string, options?: Partial<ToastOptions>): void;
    /**
     * Display a warning toast
     * @public
     */
    static warning(message: string, options?: Partial<ToastOptions>): void;
    /**
     * Display an info toast
     * @public
     */
    static info(message: string, options?: Partial<ToastOptions>): void;
    /**
     * PRODUCTION GRADE LOADING - Centered, beautiful spinner
     * @public
     */
    static loading(message: string, options?: Partial<ToastOptions>): void;
    /**
     * Dismiss the active loading toast
     * @public
     */
    static dismissLoading(): void;
    /**
     * IMPROVED: Promise support with proper loading management
     * @public
     */
    static promise<T>(promise: Promise<T>, messages: {
        loading: string;
        success: string | ((data: T) => string);
        error: string | ((error: any) => string);
    }, options?: Partial<ToastOptions>): Promise<T>;
    /**
     * Clear all active toasts
     * @public
     */
    static clear(): void;
}
export { NotifyX }
export default NotifyX;

/**
 * Toast position type
 * @public
 */
declare type Position_2 = (typeof POSITIONS)[keyof typeof POSITIONS];
export { Position_2 as Position }

/**
 * Available toast positions on screen
 * @public
 */
export declare const POSITIONS: {
    readonly TOP_RIGHT: "top-right";
    readonly TOP_LEFT: "top-left";
    readonly TOP_CENTER: "top-center";
    readonly BOTTOM_RIGHT: "bottom-right";
    readonly BOTTOM_LEFT: "bottom-left";
    readonly BOTTOM_CENTER: "bottom-center";
    readonly CENTER: "center";
};

/**
 * Toast notification configuration options
 * @public
 */
export declare interface ToastOptions {
    /** The message to display in the toast */
    message: string;
    /** Type of toast notification */
    type?: ToastType;
    /** Duration in milliseconds (0 = persistent, stays until manually dismissed) */
    duration?: number;
    /** Position on screen */
    position?: Position_2;
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
 * Toast notification types
 * @public
 */
export declare type ToastType = "success" | "error" | "warning" | "info" | "default";

export { }
