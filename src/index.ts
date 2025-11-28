import type { ToastOptions, NormalizedToastOptions, ToastType } from "./types";
import { getContainer } from "./utils/dom";
import { ANIMATION_CLASSES } from "./constants/animations";
import { DEFAULT_OPTIONS } from "./constants/defaults";

/**
 * Icon mapping for different toast types
 * @private
 */
const TOAST_ICONS: Record<ToastType, string> = {
  success: "✓",
  error: "✕",
  warning: "⚠",
  info: "ℹ",
  default: "●",
};

/**
 * Active loading toast reference
 * @private
 */
let activeLoadingToast: HTMLElement | null = null;

/**
 * NotifyX - Modern toast notification library
 * @public
 */
export class NotifyX {
  /**
   * Creates the toast DOM element
   * @private
   */
  private static createToastElement(
    options: NormalizedToastOptions
  ): HTMLElement {
    const toast = document.createElement("div");
    toast.className = `notifyx notifyx-${options.type} ${ANIMATION_CLASSES.enter}`;
    toast.setAttribute("role", "alert");
    toast.setAttribute(
      "aria-live",
      options.type === "error" ? "assertive" : "polite"
    );
    toast.setAttribute("aria-atomic", "true");

    // Content wrapper
    const contentWrapper = document.createElement("div");
    contentWrapper.className = "notifyx-content";

    // Add icon if showIcon is enabled
    if (options.showIcon) {
      const icon = document.createElement("div");
      icon.className = "notifyx-icon";
      icon.textContent = options.icon || TOAST_ICONS[options.type];
      icon.setAttribute("aria-hidden", "true");
      contentWrapper.appendChild(icon);
    }

    // Message container
    const message = document.createElement("span");
    message.className = "notifyx-msg";
    message.textContent = options.message;
    contentWrapper.appendChild(message);

    // Close button - FIXED: Pass the actual callback
    if (options.dismissible) {
      const closeBtn = this.createCloseButton(toast, options.onClose);
      contentWrapper.appendChild(closeBtn);
    }

    toast.appendChild(contentWrapper);

    // Add progress bar if enabled and duration is set
    if (options.showProgress && options.duration && options.duration > 0) {
      const progressBar = document.createElement("div");
      progressBar.className = "notifyx-progress-bar";
      toast.appendChild(progressBar);
    }

    return toast;
  }

  /**
   * Creates loader element for loading state
   * @private
   */
  private static createLoaderElement(
    options: NormalizedToastOptions
  ): HTMLElement {
    const toast = document.createElement("div");
    toast.className = `notifyx notifyx-${options.type} ${ANIMATION_CLASSES.enter}`;
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    toast.setAttribute("aria-busy", "true");

    // Loader wrapper
    const loaderWrapper = document.createElement("div");
    loaderWrapper.className = "notifyx-loader";

    // Spinner (default loader style)
    const spinner = document.createElement("div");
    spinner.className = "notifyx-spinner";
    spinner.setAttribute("aria-label", "Loading");
    loaderWrapper.appendChild(spinner);

    // Message
    if (options.message) {
      const message = document.createElement("span");
      message.className = "notifyx-msg";
      message.textContent = options.message;
      loaderWrapper.appendChild(message);
    }

    toast.appendChild(loaderWrapper);

    return toast;
  }

  /**
   * FIXED: Creates simple close button that actually works
   * @private
   */
  private static createCloseButton(
    toast: HTMLElement,
    onClose?: () => void
  ): HTMLButtonElement {
    const button = document.createElement("button");
    button.className = "notifyx-close";
    button.setAttribute("aria-label", "Close notification");
    button.setAttribute("type", "button");

    // CRITICAL FIX: Direct inline handler that definitely works
    button.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.removeToast(toast, onClose);
    });

    return button;
  }

  /**
   * FIXED: Removes a toast with proper cleanup
   * @private
   */
  private static removeToast(
    toastElement: HTMLElement,
    onClose?: () => void
  ): void {
    if (!toastElement || !toastElement.parentElement) return;

    // Clean up timeout if exists
    const timeoutData = (toastElement as any).__notifyxTimeout;
    if (timeoutData && timeoutData.timeoutId !== null) {
      clearTimeout(timeoutData.timeoutId);
      timeoutData.timeoutId = null;
    }

    // Clean up event listeners
    const pauseTimer = (toastElement as any).__notifyxPauseTimer;
    const resumeTimer = (toastElement as any).__notifyxResumeTimer;
    if (pauseTimer) toastElement.removeEventListener("mouseenter", pauseTimer);
    if (resumeTimer)
      toastElement.removeEventListener("mouseleave", resumeTimer);

    // Add exit animation
    toastElement.classList.remove(ANIMATION_CLASSES.enter);
    toastElement.classList.add(ANIMATION_CLASSES.exit);

    // Remove after animation
    const handleAnimationEnd = () => {
      if (toastElement.parentElement) {
        const container = toastElement.parentElement;
        toastElement.remove();
        this.cleanupEmptyContainer(container);
      }
      onClose?.();
    };

    toastElement.addEventListener("animationend", handleAnimationEnd, {
      once: true,
    });

    // Fallback in case animation doesn't fire
    setTimeout(() => {
      if (toastElement.parentElement) {
        handleAnimationEnd();
      }
    }, 400);
  }

  /**
   * Removes container if it has no children
   * @private
   */
  private static cleanupEmptyContainer(container: HTMLElement | null): void {
    if (container && container.childNodes.length === 0) {
      container.remove();
    }
  }

  /**
   * COMPLETELY FIXED: Auto-dismiss that actually works
   * @private
   */
  private static setupAutoDismiss(
    toastElement: HTMLElement,
    options: NormalizedToastOptions
  ): void {
    if (!options.duration || options.duration <= 0) return;

    const timeoutData = {
      timeoutId: null as number | null,
      startTime: Date.now(),
      remainingTime: options.duration,
      isPaused: false,
    };

    // CRITICAL FIX: Start timer immediately before any animation
    const startTimer = () => {
      timeoutData.timeoutId = window.setTimeout(() => {
        this.removeToast(toastElement, options.onClose);
      }, timeoutData.remainingTime);
    };

    // Pause timer function
    const pauseTimer = () => {
      if (!timeoutData.isPaused && timeoutData.timeoutId !== null) {
        timeoutData.isPaused = true;
        const elapsed = Date.now() - timeoutData.startTime;
        timeoutData.remainingTime = Math.max(
          0,
          timeoutData.remainingTime - elapsed
        );

        clearTimeout(timeoutData.timeoutId);
        timeoutData.timeoutId = null;
      }
    };

    // Resume timer function
    const resumeTimer = () => {
      if (timeoutData.isPaused && timeoutData.remainingTime > 0) {
        timeoutData.isPaused = false;
        timeoutData.startTime = Date.now();

        timeoutData.timeoutId = window.setTimeout(() => {
          this.removeToast(toastElement, options.onClose);
        }, timeoutData.remainingTime);
      }
    };

    // Set up hover events
    (toastElement as any).__notifyxPauseTimer = pauseTimer;
    (toastElement as any).__notifyxResumeTimer = resumeTimer;

    if (options.pauseOnHover) {
      toastElement.addEventListener("mouseenter", pauseTimer);
      toastElement.addEventListener("mouseleave", resumeTimer);
    }

    // Store timeout data
    (toastElement as any).__notifyxTimeout = timeoutData;

    // START THE TIMER NOW!
    startTimer();
  }

  /**
   * Enforces maximum toast limit
   * @private
   */
  private static enforceMaxToasts(
    container: HTMLElement,
    maxToasts: number
  ): void {
    const existingToasts = container.querySelectorAll(".notifyx");
    if (existingToasts.length >= maxToasts) {
      const toastToRemove = existingToasts[0] as HTMLElement;
      this.removeToast(toastToRemove);
    }
  }

  /**
   * Display a toast notification
   * @public
   */
  public static show(options: ToastOptions): void {
    const mergedOptions = {
      ...DEFAULT_OPTIONS,
      ...options,
    } as NormalizedToastOptions;
    const container = getContainer(mergedOptions.position);

    this.enforceMaxToasts(container, mergedOptions.maxToasts);

    const toastElement = this.createToastElement(mergedOptions);
    container.appendChild(toastElement);

    // Setup auto-dismiss immediately
    this.setupAutoDismiss(toastElement, mergedOptions);
  }

  /**
   * Display a success toast
   * @public
   */
  public static success(
    message: string,
    options?: Partial<ToastOptions>
  ): void {
    this.show({ ...options, message, type: "success" });
  }

  /**
   * Display an error toast
   * @public
   */
  public static error(message: string, options?: Partial<ToastOptions>): void {
    this.show({ ...options, message, type: "error" });
  }

  /**
   * Display a warning toast
   * @public
   */
  public static warning(
    message: string,
    options?: Partial<ToastOptions>
  ): void {
    this.show({ ...options, message, type: "warning" });
  }

  /**
   * Display an info toast
   * @public
   */
  public static info(message: string, options?: Partial<ToastOptions>): void {
    this.show({ ...options, message, type: "info" });
  }

  /**
   * Production-grade loading toast
   * @public
   */
  public static loading(
    message: string,
    options?: Partial<ToastOptions>
  ): void {
    // Remove existing loading toast if any
    if (activeLoadingToast) {
      this.removeToast(activeLoadingToast);
      activeLoadingToast = null;
    }

    const mergedOptions = {
      ...DEFAULT_OPTIONS,
      ...options,
      message,
      type: "info" as ToastType,
      duration: 0, // Persistent
      showProgress: false,
      dismissible: false,
      position: "center" as any, // Special center position for loading
    } as NormalizedToastOptions;

    const container = getContainer("center" as any);
    const loaderElement = this.createLoaderElement(mergedOptions);

    container.appendChild(loaderElement);
    activeLoadingToast = loaderElement;
  }

  /**
   * Dismiss the active loading toast
   * @public
   */
  public static dismissLoading(): void {
    if (activeLoadingToast) {
      this.removeToast(activeLoadingToast);
      activeLoadingToast = null;
    }
  }

  /**
   * Promise support with loading management
   * @public
   */
  public static async promise<T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    },
    options?: Partial<ToastOptions>
  ): Promise<T> {
    this.loading(messages.loading, options);

    try {
      const result = await promise;
      this.dismissLoading();

      const successMessage =
        typeof messages.success === "function"
          ? messages.success(result)
          : messages.success;
      this.success(successMessage, options);

      return result;
    } catch (error) {
      this.dismissLoading();

      const errorMessage =
        typeof messages.error === "function"
          ? messages.error(error)
          : messages.error;
      this.error(errorMessage, options);

      throw error;
    }
  }

  /**
   * FIXED: Clear all active toasts
   * @public
   */
  public static clear(): void {
    const containers = document.querySelectorAll(".notifyx-container");
    containers.forEach((container) => {
      const toasts = container.querySelectorAll(".notifyx");
      toasts.forEach((toast) => {
        this.removeToast(toast as HTMLElement);
      });
    });
    activeLoadingToast = null;
  }
}

// Export constants for external use
export { ANIMATION_CLASSES, DEFAULT_OPTIONS, POSITIONS } from "./constants";
export type { ToastOptions, ToastType, Position } from "./types";

// Attach to window for UMD builds
if (typeof window !== "undefined") {
  (window as any).NotifyX = NotifyX;
}

export default NotifyX;
