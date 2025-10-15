export declare const ANIMATION_CLASSES: {
    readonly enter: "notifyx-enter";
    readonly exit: "notifyx-exit";
    readonly slideEnter: "notifyx-slide-enter";
    readonly slideExit: "notifyx-slide-exit";
};

export declare const DEFAULT_OPTIONS: {
    readonly type: "info";
    readonly duration: 3000;
    readonly position: "top-right";
    readonly dismissible: true;
    readonly maxToasts: 5;
};

declare class NotifyX {
    private static generateToastElement;
    private static removeToast;
    static show(options: ToastOptionsType): void;
    static success(message: string, options?: Partial<ToastOptionsType>): void;
    static error(message: string, options?: Partial<ToastOptionsType>): void;
    static warning(message: string, options?: Partial<ToastOptionsType>): void;
    static info(message: string, options?: Partial<ToastOptionsType>): void;
    static clear(): void;
}
export { NotifyX }
export default NotifyX;

declare type Position_2 = typeof POSITIONS[keyof typeof POSITIONS];

export declare const POSITIONS: {
    readonly TOP_RIGHT: "top-right";
    readonly TOP_LEFT: "top-left";
    readonly BOTTOM_RIGHT: "bottom-right";
    readonly BOTTOM_LEFT: "bottom-left";
};

export declare interface ToastOptionsType {
    message: string;
    type?: ToastType;
    duration?: number;
    position?: Position_2;
    dismissible?: boolean;
    onClose?: () => void;
    maxToasts?: number;
}

export declare type ToastType = 'success' | 'error' | 'warning' | 'info';

export { }
