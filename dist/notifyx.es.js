/*!
 * NotifyX v2.3.0
 * A lightweight, framework-agnostic toast notification library
 * https://github.com/awalhadi/notifyx
 * @author A Awal Hadi
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
  enter: "notifyx-spring-enter",
  exit: "notifyx-spring-exit",
  slideEnter: "notifyx-slide-enter",
  slideExit: "notifyx-slide-exit"
};

const POSITIONS = {
  TOP_RIGHT: "top-right",
  TOP_LEFT: "top-left",
  TOP_CENTER: "top-center",
  BOTTOM_RIGHT: "bottom-right",
  BOTTOM_LEFT: "bottom-left",
  BOTTOM_CENTER: "bottom-center",
  CENTER: "center"
  // For loading toasts
};

const DEFAULT_OPTIONS = {
  type: "default",
  duration: 3e3,
  showProgress: true,
  showIcon: true,
  pauseOnHover: true,
  position: POSITIONS.TOP_RIGHT,
  dismissible: true,
  maxToasts: 5
};

const TOAST_ICONS = {
  success: "✓",
  error: "✕",
  warning: "⚠",
  info: "ℹ",
  default: "●"
};
let activeLoadingToast = null;
class NotifyX {
  /**
   * Creates the toast DOM element
   * @private
   */
  static createToastElement(options) {
    const toast = document.createElement("div");
    toast.className = `notifyx notifyx-${options.type} ${ANIMATION_CLASSES.enter}`;
    toast.setAttribute("role", "alert");
    toast.setAttribute(
      "aria-live",
      options.type === "error" ? "assertive" : "polite"
    );
    toast.setAttribute("aria-atomic", "true");
    const contentWrapper = document.createElement("div");
    contentWrapper.className = "notifyx-content";
    const contentAndIconWrapper = document.createElement("div");
    contentAndIconWrapper.className = "notifyx-content-and-icon";
    if (options.showIcon) {
      const icon = document.createElement("div");
      icon.className = "notifyx-icon";
      icon.textContent = options.icon || TOAST_ICONS[options.type];
      icon.setAttribute("aria-hidden", "true");
      contentAndIconWrapper.appendChild(icon);
    }
    const message = document.createElement("span");
    message.className = "notifyx-msg";
    message.textContent = options.message;
    contentAndIconWrapper.appendChild(message);
    contentWrapper.appendChild(contentAndIconWrapper);
    if (options.dismissible) {
      contentWrapper.appendChild(this.createCloseButton(toast, options));
    }
    toast.appendChild(contentWrapper);
    if (options.showProgress && options?.duration && options?.duration > 0) {
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
  static createLoaderElement(options) {
    const toast = document.createElement("div");
    toast.className = `notifyx notifyx-${options.type} ${ANIMATION_CLASSES.enter}`;
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    toast.setAttribute("aria-busy", "true");
    const loaderWrapper = document.createElement("div");
    loaderWrapper.className = "notifyx-loader";
    const spinner = document.createElement("div");
    spinner.className = "notifyx-spinner";
    spinner.setAttribute("aria-label", "Loading");
    loaderWrapper.appendChild(spinner);
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
  static createCloseButton(toast, options) {
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
  static removeToast(toastElement, onClose) {
    if (toastElement.hasAttribute("data-removing")) {
      return;
    }
    toastElement.setAttribute("data-removing", "true");
    const timeoutData = toastElement?.__notifyxTimeout;
    console.log("toastElement:", toastElement, "timeoutData:", timeoutData);
    if (timeoutData && timeoutData.timeoutId !== null) {
      clearTimeout(timeoutData.timeoutId);
      timeoutData.timeoutId = null;
    }
    const pauseTimer = toastElement.__notifyxPauseTimer;
    const resumeTimer = toastElement.__notifyxResumeTimer;
    if (pauseTimer) {
      toastElement.removeEventListener("mouseenter", pauseTimer);
    }
    if (resumeTimer) {
      toastElement.removeEventListener("mouseleave", resumeTimer);
    }
    delete toastElement.__notifyxTimeout;
    delete toastElement.__notifyxPauseTimer;
    delete toastElement.__notifyxResumeTimer;
    const performCleanup = () => {
      if (toastElement.isConnected) {
        toastElement.remove();
      }
      this.cleanupEmptyContainer(toastElement.parentElement);
      onClose?.();
    };
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) {
      performCleanup();
      return;
    }
    toastElement.classList.remove(ANIMATION_CLASSES.enter);
    toastElement.classList.add(ANIMATION_CLASSES.exit);
    const fallbackTimeout = window.setTimeout(() => {
      performCleanup();
    }, 400);
    const handleAnimationEnd = (event) => {
      if (event.target !== toastElement) return;
      clearTimeout(fallbackTimeout);
      toastElement.removeEventListener("animationend", handleAnimationEnd);
      performCleanup();
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
   * FIXED: Manages auto-dismiss timer with pause on hover
   * @private
   */
  static setupAutoDismiss(toastElement, options) {
    if (!options.duration || options.duration <= 0) return;
    const timeoutData = {
      timeoutId: null,
      startTime: Date.now(),
      remainingTime: options.duration,
      isPaused: false
    };
    const progressBar = toastElement.querySelector(
      ".notifyx-progress-bar"
    );
    if (progressBar) {
      progressBar.style.width = "100%";
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          progressBar.style.transition = `width ${options.duration}ms linear`;
          progressBar.style.width = "0%";
        });
      });
    }
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
          void progressBar.offsetWidth;
        }
        clearTimeout(timeoutData.timeoutId);
        timeoutData.timeoutId = null;
      }
    };
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
    toastElement.__notifyxPauseTimer = pauseTimer;
    toastElement.__notifyxResumeTimer = resumeTimer;
    if (options.pauseOnHover) {
      toastElement.addEventListener("mouseenter", pauseTimer);
      toastElement.addEventListener("mouseleave", resumeTimer);
    }
    timeoutData.timeoutId = window.setTimeout(() => {
      this.removeToast(toastElement, options.onClose);
    }, options.duration);
    toastElement.__notifyxTimeout = timeoutData;
  }
  /**
   * Enforces maximum toast limit
   * @private
   */
  static enforceMaxToasts(container, maxToasts) {
    const existingToasts = container.querySelectorAll(".notifyx");
    if (existingToasts.length >= maxToasts) {
      const toastToRemove = existingToasts[0];
      this.removeToast(toastToRemove);
    }
  }
  /**
   * Display a toast notification
   * @public
   */
  static show(options) {
    const mergedOptions = {
      ...DEFAULT_OPTIONS,
      ...options
    };
    const container = getContainer(mergedOptions.position);
    this.enforceMaxToasts(container, mergedOptions.maxToasts);
    const toastElement = this.createToastElement(mergedOptions);
    container.appendChild(toastElement);
    this.setupAutoDismiss(toastElement, mergedOptions);
  }
  /**
   * Display a success toast
   * @public
   */
  static success(message, options) {
    this.show({ ...options, message, type: "success" });
  }
  /**
   * Display an error toast
   * @public
   */
  static error(message, options) {
    this.show({ ...options, message, type: "error" });
  }
  /**
   * Display a warning toast
   * @public
   */
  static warning(message, options) {
    this.show({ ...options, message, type: "warning" });
  }
  /**
   * Display an info toast
   * @public
   */
  static info(message, options) {
    this.show({ ...options, message, type: "info" });
  }
  /**
   * PRODUCTION GRADE LOADING - Centered, beautiful spinner
   * @public
   */
  static loading(message, options) {
    if (activeLoadingToast) {
      this.removeToast(activeLoadingToast);
      activeLoadingToast = null;
    }
    const mergedOptions = {
      ...DEFAULT_OPTIONS,
      ...options,
      message,
      type: "info",
      duration: 0,
      // Persistent
      showProgress: false,
      dismissible: false,
      position: "center"
      // Special center position for loading
    };
    const container = getContainer("center");
    const loaderElement = this.createLoaderElement(mergedOptions);
    container.appendChild(loaderElement);
    activeLoadingToast = loaderElement;
  }
  /**
   * Dismiss the active loading toast
   * @public
   */
  static dismissLoading() {
    if (activeLoadingToast) {
      this.removeToast(activeLoadingToast);
      activeLoadingToast = null;
    }
  }
  /**
   * IMPROVED: Promise support with proper loading management
   * @public
   */
  static async promise(promise, messages, options) {
    this.loading(messages.loading, options);
    try {
      const result = await promise;
      this.dismissLoading();
      const successMessage = typeof messages.success === "function" ? messages.success(result) : messages.success;
      this.success(successMessage, options);
      return result;
    } catch (error) {
      this.dismissLoading();
      const errorMessage = typeof messages.error === "function" ? messages.error(error) : messages.error;
      this.error(errorMessage, options);
      throw error;
    }
  }
  /**
   * Clear all active toasts
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
    activeLoadingToast = null;
  }
  /**
   * Clear a specific toast by its element
   * @param toastElement - The toast element to remove
   * @public
   */
  static dismiss(toastElement) {
    if (toastElement && toastElement.classList.contains("notifyx")) {
      this.removeToast(toastElement);
    }
  }
}
if (typeof window !== "undefined") {
  window.NotifyX = NotifyX;
}

export { ANIMATION_CLASSES, DEFAULT_OPTIONS, NotifyX, POSITIONS, NotifyX as default };
