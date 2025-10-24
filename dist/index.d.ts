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
    readonly type: "info";
    readonly duration: 3000;
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
     * Creates the toast DOM element with proper structure and accessibility
     * @private
     */
    private static createToastElement;
    /**
     * Creates a close button for dismissible toasts
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
     * Manages auto-dismiss timer for a toast
     * @private
     */
    private static setupAutoDismiss;
    /**
     * Updates close button to clear timeout on manual dismiss
     * @private
     */
    private static attachCloseHandler;
    /**
     * Enforces maximum toast limit by removing oldest
     * @private
     */
    private static enforceMaxToasts;
    /**
     * Display a toast notification
     * @param options - Configuration for the toast
     * @public
     * @example
     * ```ts
     * NotifyX.show({
     *   message: 'Success!',
     *   type: 'success',
     *   duration: 3000
     * });
     * ```
     */
    static show(options: ToastOptions): void;
    /**
     * Display a success toast notification
     * @param message - The message to display
     * @param options - Optional configuration overrides
     * @public
     */
    static success(message: string, options?: Partial<ToastOptions>): void;
    /**
     * Display an error toast notification
     * @param message - The message to display
     * @param options - Optional configuration overrides
     * @public
     */
    static error(message: string, options?: Partial<ToastOptions>): void;
    /**
     * Display a warning toast notification
     * @param message - The message to display
     * @param options - Optional configuration overrides
     * @public
     */
    static warning(message: string, options?: Partial<ToastOptions>): void;
    /**
     * Display an info toast notification
     * @param message - The message to display
     * @param options - Optional configuration overrides
     * @public
     */
    static info(message: string, options?: Partial<ToastOptions>): void;
    /**
     * Clear all active toast notifications
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
declare type Position_2 = typeof POSITIONS[keyof typeof POSITIONS];
export { Position_2 as Position }

export declare const POSITIONS: {
    readonly TOP_RIGHT: "top-right";
    readonly TOP_LEFT: "top-left";
    readonly BOTTOM_RIGHT: "bottom-right";
    readonly BOTTOM_LEFT: "bottom-left";
};

/**
 * Toast notification configuration options
 */
export declare interface ToastOptions {
    /** The message to display in the toast */
    message: string;
    /** Type of toast notification */
    type?: ToastType;
    /** Duration in milliseconds (0 = persistent) */
    duration?: number;
    /** Position on screen */
    position?: Position_2;
    /** Whether the toast can be manually dismissed */
    dismissible?: boolean;
    /** Callback fired when toast is closed */
    onClose?: () => void;
    /** Maximum number of toasts to show simultaneously */
    maxToasts?: number;
}

export declare type ToastType = 'success' | 'error' | 'warning' | 'info';

export { }
