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

    // Close button
    if (options.dismissible) {
      contentWrapper.appendChild(this.createCloseButton(toast, options));
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
   * Creates simple close button (just × icon)
   * @private
   */
  private static createCloseButton(
    toast: HTMLElement,
    options: NormalizedToastOptions
  ): HTMLButtonElement {
    const button = document.createElement("button");
    button.className = "notifyx-close";
    button.setAttribute("aria-label", "Close notification");
    button.setAttribute("type", "button");
    button.onclick = () => this.removeToast(toast, options.onClose);
    return button;
  }

  /**
   * Removes a toast with exit animation
   * @private
   */
  private static removeToast(
    toastElement: HTMLElement,
    onClose?: () => void
  ): void {
    // Clean up timeout if exists
    const timeoutData = (toastElement as any).__notifyxTimeout;
    if (timeoutData && timeoutData.timeoutId !== null) {
      clearTimeout(timeoutData.timeoutId);
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

    const handleAnimationEnd = () => {
      toastElement.remove();
      toastElement.removeEventListener("animationend", handleAnimationEnd);
      this.cleanupEmptyContainer(toastElement.parentElement);
      onClose?.();
    };

    toastElement.addEventListener("animationend", handleAnimationEnd);
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
   * FIXED: Manages auto-dismiss timer with pause on hover
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

    const progressBar = toastElement.querySelector(
      ".notifyx-progress-bar"
    ) as HTMLElement | null;

    // Initialize progress bar
    if (progressBar) {
      progressBar.style.width = "100%";
      // Double RAF for smooth animation start
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          progressBar.style.transition = `width ${options.duration}ms linear`;
          progressBar.style.width = "0%";
        });
      });
    }

    // Pause timer function
    const pauseTimer = () => {
      if (!timeoutData.isPaused && timeoutData.timeoutId !== null) {
        timeoutData.isPaused = true;
        const elapsed = Date.now() - timeoutData.startTime;
        timeoutData.remainingTime = Math.max(
          0,
          timeoutData.remainingTime - elapsed
        );

        if (progressBar) {
          const computedStyle = window.getComputedStyle(progressBar);
          const currentWidth = computedStyle.width;
          progressBar.style.transition = "none";
          progressBar.style.width = currentWidth;
          void progressBar.offsetWidth; // Force reflow
        }

        clearTimeout(timeoutData.timeoutId);
        timeoutData.timeoutId = null;
      }
    };

    // Resume timer function
    const resumeTimer = () => {
      if (timeoutData.isPaused && timeoutData.remainingTime > 0) {
        timeoutData.isPaused = false;
        timeoutData.startTime = Date.now();

        if (progressBar) {
          requestAnimationFrame(() => {
            progressBar.style.transition = `width ${timeoutData.remainingTime}ms linear`;
            progressBar.style.width = "0%";
          });
        }

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

    // CRITICAL: Start the initial timer immediately
    timeoutData.timeoutId = window.setTimeout(() => {
      this.removeToast(toastElement, options.onClose);
    }, options.duration);

    // Store timeout data
    (toastElement as any).__notifyxTimeout = timeoutData;
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

    // CRITICAL: Always call setupAutoDismiss
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
   * PRODUCTION GRADE LOADING - Centered, beautiful spinner
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
   * IMPROVED: Promise support with proper loading management
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
    // Show loading toast (centered)
    this.loading(messages.loading, options);

    try {
      const result = await promise;

      // Dismiss loading
      this.dismissLoading();

      // Show success (at specified position)
      const successMessage =
        typeof messages.success === "function"
          ? messages.success(result)
          : messages.success;
      this.success(successMessage, options);

      return result;
    } catch (error) {
      // Dismiss loading
      this.dismissLoading();

      // Show error (at specified position)
      const errorMessage =
        typeof messages.error === "function"
          ? messages.error(error)
          : messages.error;
      this.error(errorMessage, options);

      throw error;
    }
  }

  /**
   * Clear all active toasts
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
