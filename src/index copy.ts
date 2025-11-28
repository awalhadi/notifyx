import type { ToastOptions, NormalizedToastOptions } from './types';
import { getContainer } from './utils/dom';
import { ANIMATION_CLASSES } from './constants/animations';
import { DEFAULT_OPTIONS } from './constants/defaults';

/**
 * NotifyX - Modern toast notification library
 * @public
 */
export class NotifyX {
  /**
   * Creates the toast DOM element with proper structure and accessibility
   * @private
   */
  private static createToastElement(options: NormalizedToastOptions): HTMLElement {
    const toast = document.createElement('div');
    toast.className = `notifyx notifyx-${options.type} ${ANIMATION_CLASSES.enter}`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'polite');

    // Content wrapper for better layout control
    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'notifyx-content';

    const message = document.createElement('span');
    message.className = "notifyx-msg";
    message.textContent = options.message;
    contentWrapper.appendChild(message);

    if (options.dismissible) {
      contentWrapper.appendChild(this.createCloseButton(toast));
    }

    toast.appendChild(contentWrapper);

    // Add progress bar if enabled and duration is set
    if (options.showProgress && options.duration && options.duration > 0) {
      const progressBar = document.createElement('div');
      progressBar.className = 'notifyx-progress-bar';
      toast.appendChild(progressBar);
    }

    return toast;
  }

  /**
   * Creates a close button for dismissible toasts
   * @private
   */
  private static createCloseButton(toast: HTMLElement): HTMLButtonElement {
    const button = document.createElement('button');
    button.className = 'notifyx-error notifyx-close';
    button.innerHTML = '✕';
    button.setAttribute('aria-label', 'Close notification');
    button.setAttribute('type', 'button');
    button.onclick = () => this.removeToast(toast);
    return button;
  }



  /**
   * Removes a toast with exit animation
   * @private
   */
  private static removeToast(toastElement: HTMLElement): void {
    // Clean up timeout if exists
    const timeoutData = (toastElement as any).__notifyxTimeout;
    if (timeoutData && timeoutData.timeoutId !== null) {
      clearTimeout(timeoutData.timeoutId);
    }

    // Clean up event listeners
    const pauseTimer = (toastElement as any).__notifyxPauseTimer;
    const resumeTimer = (toastElement as any).__notifyxResumeTimer;
    if (pauseTimer) toastElement.removeEventListener('mouseenter', pauseTimer);
    if (resumeTimer) toastElement.removeEventListener('mouseleave', resumeTimer);

    toastElement.classList.remove(ANIMATION_CLASSES.enter);
    toastElement.classList.add(ANIMATION_CLASSES.exit);

    const handleAnimationEnd = () => {
      toastElement.remove();
      toastElement.removeEventListener('animationend', handleAnimationEnd);
      this.cleanupEmptyContainer(toastElement.parentElement);
    };

    toastElement.addEventListener('animationend', handleAnimationEnd);
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
   * Manages auto-dismiss timer for a toast with pause on hover
   * @private
   */
  private static setupAutoDismiss(
    toastElement: HTMLElement,
    options: NormalizedToastOptions
  ): { timeoutId: number | null; startTime: number; remainingTime: number; isPaused: boolean } | null {
    if (!options.duration || options.duration <= 0) return null;

    const timeoutData = {
      timeoutId: null as number | null,
      startTime: Date.now(),
      remainingTime: options.duration,
      isPaused: false
    };

    const progressBar = toastElement.querySelector('.notifyx-progress-bar') as HTMLElement | null;
    
    // Initialize progress bar with CSS transition (synchronized with timeout)
    if (progressBar) {
      progressBar.style.width = '100%';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          progressBar.style.transition = `width ${options.duration}ms linear`;
          progressBar.style.width = '0%';
        });
      });
    }

    // Function to pause the timer
    const pauseTimer = () => {
      if (!timeoutData.isPaused && timeoutData.timeoutId !== null) {
        timeoutData.isPaused = true;
        const elapsed = Date.now() - timeoutData.startTime;
        timeoutData.remainingTime = Math.max(0, timeoutData.remainingTime - elapsed);
        
        if (progressBar) {
          // Capture current computed width and freeze it
          const computedStyle = window.getComputedStyle(progressBar);
          const currentWidth = computedStyle.width;
          progressBar.style.transition = 'none';
          progressBar.style.width = currentWidth;
          void progressBar.offsetWidth; // Force reflow
        }

        clearTimeout(timeoutData.timeoutId);
        timeoutData.timeoutId = null;
      }
    };
    
    // Function to resume the timer
    const resumeTimer = () => {
      if (timeoutData.isPaused && timeoutData.remainingTime > 0) {
        timeoutData.isPaused = false;
        timeoutData.startTime = Date.now();
        
        if (progressBar) {
          // Resume animation with exact remaining time
          requestAnimationFrame(() => {
            progressBar.style.transition = `width ${timeoutData.remainingTime}ms linear`;
            progressBar.style.width = '0%';
          });
        }

        timeoutData.timeoutId = window.setTimeout(() => {
          this.removeToast(toastElement);
          options.onClose?.();
        }, timeoutData.remainingTime);
      }
    };

    // Set up hover events and store references for cleanup
    (toastElement as any).__notifyxPauseTimer = pauseTimer;
    (toastElement as any).__notifyxResumeTimer = resumeTimer;
    toastElement.addEventListener('mouseenter', pauseTimer);
    toastElement.addEventListener('mouseleave', resumeTimer);

    // Start the initial timer
    timeoutData.timeoutId = window.setTimeout(() => {
      this.removeToast(toastElement);
      options.onClose?.();
    }, options.duration);

    // Store timeout data on the element for cleanup
    (toastElement as any).__notifyxTimeout = timeoutData;

    return timeoutData;
  }

  /**
   * Updates close button to clear timeout on manual dismiss
   * @private
   */
  private static attachCloseHandler(
    toastElement: HTMLElement,
    timeoutData: { timeoutId: number | null; startTime: number; remainingTime: number; isPaused: boolean } | null,
    onClose?: () => void
  ): void {
    const closeButton = toastElement.querySelector('.notifyx-close') as HTMLButtonElement;
    if (!closeButton) return;

    const originalOnClick = closeButton.onclick;
    closeButton.onclick = (e) => {
      if (timeoutData) {
        if (timeoutData.timeoutId !== null) {
          clearTimeout(timeoutData.timeoutId);
        }
        // Remove hover event listeners
        const pauseTimer = (toastElement as any).__notifyxPauseTimer;
        const resumeTimer = (toastElement as any).__notifyxResumeTimer;
        if (pauseTimer) toastElement.removeEventListener('mouseenter', pauseTimer);
        if (resumeTimer) toastElement.removeEventListener('mouseleave', resumeTimer);
      }
      onClose?.();
      originalOnClick?.call(closeButton, e);
    };
  }

  /**
   * Enforces maximum toast limit by removing oldest
   * @private
   */
  private static enforceMaxToasts(container: HTMLElement): void {
    const existingToasts = container.querySelectorAll('.notifyx');
    if (existingToasts.length >= DEFAULT_OPTIONS.maxToasts) {
      this.removeToast(existingToasts[0] as HTMLElement);
    }
  }

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
  public static show(options: ToastOptions): void {
    const mergedOptions = { ...DEFAULT_OPTIONS, ...options } as NormalizedToastOptions;
    const container = getContainer(mergedOptions.position);

    this.enforceMaxToasts(container);

    const toastElement = this.createToastElement(mergedOptions);
    container.appendChild(toastElement);

    const timeoutData = this.setupAutoDismiss(toastElement, mergedOptions);

    if (mergedOptions.dismissible) {
      this.attachCloseHandler(toastElement, timeoutData, mergedOptions.onClose);
    }
  }

  /**
   * Display a success toast notification
   * @param message - The message to display
   * @param options - Optional configuration overrides
   * @public
   */
  public static success(message: string, options?: Partial<ToastOptions>): void {
    this.show({ ...options, message, type: 'success' });
  }

  /**
   * Display an error toast notification
   * @param message - The message to display
   * @param options - Optional configuration overrides
   * @public
   */
  public static error(message: string, options?: Partial<ToastOptions>): void {
    this.show({ ...options, message, type: 'error' });
  }

  /**
   * Display a warning toast notification
   * @param message - The message to display
   * @param options - Optional configuration overrides
   * @public
   */
  public static warning(message: string, options?: Partial<ToastOptions>): void {
    this.show({ ...options, message, type: 'warning' });
  }

  /**
   * Display an info toast notification
   * @param message - The message to display
   * @param options - Optional configuration overrides
   * @public
   */
  public static info(message: string, options?: Partial<ToastOptions>): void {
    this.show({ ...options, message, type: 'info' });
  }

  /**
   * Clear all active toast notifications
   * @public
   */
  public static clear(): void {
    const containers = document.querySelectorAll('.notifyx-container');
    containers.forEach(container => {
      const toasts = container.querySelectorAll('.notifyx');
      toasts.forEach(toast => {
        this.removeToast(toast as HTMLElement);
      });
    });
  }
}

// Export constants for external use
export { ANIMATION_CLASSES, DEFAULT_OPTIONS, POSITIONS } from './constants';
export type { ToastOptions, ToastType, Position } from './types';

// Attach to window for UMD builds
if (typeof window !== 'undefined') {
  (window as any).NotifyX = NotifyX;
}

export default NotifyX;