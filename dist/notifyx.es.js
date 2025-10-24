/*!
 * NotifyX v3.0.0
 * A lightweight, framework-agnostic toast notification library
 * 
 * @license MIT
 * @author A Awal Hadi
 * @preserve
 * 
 * Copyright (c) 2025 A Awal Hadi
 * Released under the MIT License
 * https://github.com/awalhadi/notifyx
 */
const containerCache = /* @__PURE__ */ new Map();
const createToastContainer = (position) => {
  const container = document.createElement("div");
  container.className = "notifyx-container";
  container.setAttribute("data-position", position);
  container.setAttribute("aria-label", `Notifications ${position.replace("-", " ")}`);
  return container;
};
const getContainer = (position) => {
  const cached = containerCache.get(position);
  if (cached && document.body.contains(cached)) {
    return cached;
  }
  const existingContainer = document.querySelector(
    `.notifyx-container[data-position="${position}"]`
  );
  if (existingContainer) {
    containerCache.set(position, existingContainer);
    return existingContainer;
  }
  const container = createToastContainer(position);
  document.body.appendChild(container);
  containerCache.set(position, container);
  return container;
};

const ANIMATION_CLASSES = {
  enter: "notifyx-enter",
  exit: "notifyx-exit",
  slideEnter: "notifyx-slide-enter",
  slideExit: "notifyx-slide-exit"
};

const POSITIONS = {
  TOP_RIGHT: "top-right",
  TOP_LEFT: "top-left",
  BOTTOM_RIGHT: "bottom-right",
  BOTTOM_LEFT: "bottom-left"
};

const DEFAULT_OPTIONS = {
  type: "info",
  duration: 3e3,
  position: POSITIONS.TOP_RIGHT,
  dismissible: true,
  maxToasts: 5
};

class NotifyX {
  /**
   * Creates the toast DOM element with proper structure and accessibility
   * @private
   */
  static createToastElement(options) {
    const toast = document.createElement("div");
    toast.className = `notifyx notifyx-${options.type} ${ANIMATION_CLASSES.enter} rounded-lg border shadow-md`;
    toast.setAttribute("role", "alert");
    toast.setAttribute("aria-live", "polite");
    const message = document.createElement("span");
    message.className = "notifyx-msg";
    message.textContent = options.message;
    toast.appendChild(message);
    if (options.dismissible) {
      toast.appendChild(this.createCloseButton(toast));
    }
    return toast;
  }
  /**
   * Creates a close button for dismissible toasts
   * @private
   */
  static createCloseButton(toast) {
    const button = document.createElement("button");
    button.className = "notifyx-close";
    button.innerHTML = "✕";
    button.setAttribute("aria-label", "Close notification");
    button.setAttribute("type", "button");
    button.onclick = () => this.removeToast(toast);
    return button;
  }
  /**
   * Removes a toast with exit animation
   * @private
   */
  static removeToast(toastElement) {
    toastElement.classList.remove(ANIMATION_CLASSES.enter);
    toastElement.classList.add(ANIMATION_CLASSES.exit);
    const handleAnimationEnd = () => {
      toastElement.remove();
      toastElement.removeEventListener("animationend", handleAnimationEnd);
      this.cleanupEmptyContainer(toastElement.parentElement);
    };
    toastElement.addEventListener("animationend", handleAnimationEnd);
  }
  /**
   * Removes container if it has no children
   * @private
   */
  static cleanupEmptyContainer(container) {
    if (container && container.childNodes.length === 0) {
      container.remove();
    }
  }
  /**
   * Manages auto-dismiss timer for a toast
   * @private
   */
  static setupAutoDismiss(toastElement, options) {
    if (!options.duration || options.duration <= 0) return null;
    return window.setTimeout(() => {
      this.removeToast(toastElement);
      options.onClose?.();
    }, options.duration);
  }
  /**
   * Updates close button to clear timeout on manual dismiss
   * @private
   */
  static attachCloseHandler(toastElement, timeoutId, onClose) {
    const closeButton = toastElement.querySelector(".notifyx-close");
    if (!closeButton) return;
    const originalOnClick = closeButton.onclick;
    closeButton.onclick = (e) => {
      if (timeoutId !== null) clearTimeout(timeoutId);
      onClose?.();
      originalOnClick?.call(closeButton, e);
    };
  }
  /**
   * Enforces maximum toast limit by removing oldest
   * @private
   */
  static enforceMaxToasts(container) {
    const existingToasts = container.querySelectorAll(".notifyx");
    if (existingToasts.length >= DEFAULT_OPTIONS.maxToasts) {
      this.removeToast(existingToasts[0]);
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
  static show(options) {
    const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
    const container = getContainer(mergedOptions.position);
    this.enforceMaxToasts(container);
    const toastElement = this.createToastElement(mergedOptions);
    container.appendChild(toastElement);
    const timeoutId = this.setupAutoDismiss(toastElement, mergedOptions);
    if (mergedOptions.dismissible) {
      this.attachCloseHandler(toastElement, timeoutId, mergedOptions.onClose);
    }
  }
  /**
   * Display a success toast notification
   * @param message - The message to display
   * @param options - Optional configuration overrides
   * @public
   */
  static success(message, options) {
    this.show({ ...options, message, type: "success" });
  }
  /**
   * Display an error toast notification
   * @param message - The message to display
   * @param options - Optional configuration overrides
   * @public
   */
  static error(message, options) {
    this.show({ ...options, message, type: "error" });
  }
  /**
   * Display a warning toast notification
   * @param message - The message to display
   * @param options - Optional configuration overrides
   * @public
   */
  static warning(message, options) {
    this.show({ ...options, message, type: "warning" });
  }
  /**
   * Display an info toast notification
   * @param message - The message to display
   * @param options - Optional configuration overrides
   * @public
   */
  static info(message, options) {
    this.show({ ...options, message, type: "info" });
  }
  /**
   * Clear all active toast notifications
   * @public
   */
  static clear() {
    const containers = document.querySelectorAll(".notifyx-container");
    containers.forEach((container) => {
      const toasts = container.querySelectorAll(".notifyx");
      toasts.forEach((toast) => {
        this.removeToast(toast);
      });
    });
  }
}
if (typeof window !== "undefined") {
  window.NotifyX = NotifyX;
}

export { ANIMATION_CLASSES, DEFAULT_OPTIONS, NotifyX, POSITIONS, NotifyX as default };
