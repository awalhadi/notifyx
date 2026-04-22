import type {
  ToastOptions,
  NormalizedToastOptions,
  ToastType,
  AnimationPreset,
  ThemePreset,
  StreamOptions,
  StreamController,
  PromiseOptions,
  AIMetadata,
  Position
} from "../types";
import { getContainer } from "../utils/dom";
import { DEFAULT_OPTIONS } from "./constants";
import { AnimationEngine } from "./AnimationEngine";
import { ToastQueue } from "./ToastQueue";
import { StreamBridge } from "./StreamBridge";

interface NotifyXElement extends HTMLElement {
  __notifyxTimeout?: {
    timeoutId: number | null;
    startTime: number;
    remaining: number;
    paused: boolean;
  };
  __notifyxPauseTimer?: () => void;
  __notifyxResumeTimer?: () => void;
}

// ─── SVG Icons ────────────────────────────────────────────────────────────────

const SVG_ICONS: Record<ToastType | "ai", string> = {
  success: `<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><circle cx="10" cy="10" r="9" stroke="currentColor" stroke-width="1.5"/><path d="M6.5 10.5l2.5 2.5 4.5-5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  error:   `<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><circle cx="10" cy="10" r="9" stroke="currentColor" stroke-width="1.5"/><path d="M7 7l6 6M13 7l-6 6" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/></svg>`,
  warning: `<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M9.106 3.481L1.925 16.05A1 1 0 002.819 17.5h14.362a1 1 0 00.894-1.45L10.894 3.48a1 1 0 00-1.788 0z" stroke="currentColor" stroke-width="1.5"/><path d="M10 8v4M10 13.5v.5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/></svg>`,
  info:    `<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><circle cx="10" cy="10" r="9" stroke="currentColor" stroke-width="1.5"/><path d="M10 9v5M10 6.5v.5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/></svg>`,
  default: `<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><circle cx="10" cy="10" r="9" stroke="currentColor" stroke-width="1.5"/><circle cx="10" cy="10" r="3" fill="currentColor"/></svg>`,
  loading: `<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="2" stroke-dasharray="24 16" transform="rotate(45 10 10)"/></svg>`,
  ai:      `<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M10 2l2.4 5.6L18 10l-5.6 2.4L10 18l-2.4-5.6L2 10l5.6-2.4L10 2z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>`,
};

// ─── Module-level state ────────────────────────────────────────────────────────

let activeLoadingToast: HTMLElement | null = null;
const globalQueue = new ToastQueue(100);
const activeToastIds = new Map<string, HTMLElement>();
let globalDefaults: Partial<ToastOptions> = {};
let globalTheme: ThemePreset = 'auto';

// ─── NotifyX ──────────────────────────────────────────────────────────────────

/**
 * NotifyX — AI-native, premium toast notification library.
 * Zero dependencies · Framework-agnostic · TypeScript-first
 * @public
 */
export default class NotifyX {

  // ─── Element Builders ─────────────────────────────────────────────────────

  /** @private */
  private static attachGestures(element: HTMLElement, id: string): void {
    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    const onStart = (e: TouchEvent | MouseEvent) => {
      startX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      isDragging = true;
      element.style.transition = 'none';
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onEnd);
    };

    const onMove = (e: TouchEvent | MouseEvent) => {
      if (!isDragging) return;
      currentX = ('touches' in e ? e.touches[0].clientX : e.clientX) - startX;
      element.style.transform = `translateX(${currentX}px) rotate(${currentX * 0.03}deg)`;
      element.style.opacity = String(1 - Math.abs(currentX) / 200);
    };

    const onEnd = () => {
      if (!isDragging) return;
      isDragging = false;
      element.style.transition = '';
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onEnd);
      if (Math.abs(currentX) > 100) {
        const direction = currentX > 0 ? 1 : -1;
        element.style.transform = `translateX(${direction * 200}px) rotate(${direction * 10}deg)`;
        element.style.opacity = '0';
        setTimeout(() => NotifyX.dismiss(id), 200);
      } else {
        element.style.transform = '';
        element.style.opacity = '';
      }
      currentX = 0;
    };

    element.addEventListener('touchstart', onStart, { passive: true });
    element.addEventListener('touchmove', onMove, { passive: true });
    element.addEventListener('touchend', onEnd);
    element.addEventListener('mousedown', onStart);
  }

  /** @private */
  private static createToastElement(opts: NormalizedToastOptions): HTMLElement {
    const toast = document.createElement("div");
    toast.className = [
      "notifyx",
      `notifyx-${opts.type}`,
      opts.className ?? "",
    ].filter(Boolean).join(" ");

    toast.setAttribute("role", (opts.type === "error" || opts.type === "warning") ? "alert" : "status");
    toast.setAttribute("aria-live", opts.priority === "critical" ? "assertive" : "polite");
    toast.setAttribute("aria-atomic", "true");
    if (opts.id) toast.setAttribute("data-id", opts.id);
    if (opts.theme && opts.theme !== "auto") {
      toast.setAttribute("data-notifyx-theme", opts.theme);
    }

    if (opts.onClick) {
      toast.style.cursor = "pointer";
      toast.addEventListener("click", (e) => {
        if (!(e.target as HTMLElement).closest(".notifyx-close, .notifyx-action-btn"))
          opts.onClick!(opts.id!);
      });
    }

    // Content wrapper
    const contentWrapper = document.createElement("div");
    contentWrapper.className = "notifyx-content";

    const row = document.createElement("div");
    row.className = "notifyx-content-and-icon";

    // Icon
    if (opts.showIcon) {
      const icon = document.createElement("div");
      icon.className = "notifyx-icon";
      icon.setAttribute("aria-hidden", "true");
      icon.innerHTML = opts.icon
        ? `<span style="font-size:1.1em">${opts.icon}</span>`
        : SVG_ICONS[opts.type];
      row.appendChild(icon);
    }

    // Text block
    const textBlock = document.createElement("div");
    textBlock.className = "notifyx-body";

    if (opts.title) {
      const title = document.createElement("strong");
      title.className = "notifyx-title";
      title.textContent = opts.title;
      textBlock.appendChild(title);
    }


    const msg = document.createElement("span");
    msg.className = "notifyx-msg";
    if (opts.richHtml) {
      msg.innerHTML = opts.richHtml;
    } else {
      msg.textContent = opts.message;
    }
    
    if (opts.ai?.streaming) {
      const cursor = document.createElement("span");
      cursor.className = "notifyx-stream-cursor";
      msg.appendChild(cursor);
    }

    textBlock.appendChild(msg);

    row.appendChild(textBlock);
    contentWrapper.appendChild(row);

    // Close button
    if (opts.dismissible) {
      const closeBtn = document.createElement("button");
      closeBtn.className = "notifyx-close";
      closeBtn.setAttribute("aria-label", "Dismiss notification");
      closeBtn.setAttribute("type", "button");
      closeBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="1" y1="1" x2="11" y2="11"/><line x1="11" y1="1" x2="1" y2="11"/></svg>`;
      closeBtn.onclick = (e) => { e.stopPropagation(); this.removeToast(toast, opts); };
      contentWrapper.appendChild(closeBtn);
    }

    
    // AI Metadata
    if (opts.ai) {
      if (opts.ai.streaming) {
        toast.setAttribute("data-streaming", "true");
      }
      
      const hasMeta = opts.ai.model || opts.ai.toolName || opts.ai.latencyMs || opts.ai.tokens;
      if (hasMeta) {
        const metaBar = document.createElement("div");
        metaBar.className = "notifyx-ai-meta";
        
        if (opts.ai.model) {
          const badge = document.createElement("span");
          badge.className = "notifyx-ai-meta-badge";
          badge.textContent = opts.ai.model;
          metaBar.appendChild(badge);
        }
        if (opts.ai.toolName) {
          const badge = document.createElement("span");
          badge.className = "notifyx-ai-meta-badge";
          badge.textContent = opts.ai.toolName;
          metaBar.appendChild(badge);
        }
        if (opts.ai.tokens) {
          const txt = document.createElement("span");
          txt.textContent = `${opts.ai.tokens} tkns`;
          metaBar.appendChild(txt);
        }
        if (opts.ai.latencyMs) {
          const txt = document.createElement("span");
          txt.textContent = `${opts.ai.latencyMs}ms`;
          metaBar.appendChild(txt);
        }
        
        contentWrapper.appendChild(metaBar);
      }
    }

    toast.appendChild(contentWrapper);

    // Action buttons
    if (opts.actions && opts.actions.length > 0) {
      const actionsBar = document.createElement("div");
      actionsBar.className = "notifyx-actions";
      for (const action of opts.actions) {
        const btn = document.createElement("button");
        btn.className = `notifyx-action-btn notifyx-action-btn-${action.variant ?? "ghost"}`;
        btn.textContent = action.label;
        btn.setAttribute("type", "button");
        btn.addEventListener("click", (e) => { e.stopPropagation(); action.onClick(opts.id!); });
        actionsBar.appendChild(btn);
      }
      toast.appendChild(actionsBar);
    }

    // Progress bar
    if (opts.showProgress && opts.duration > 0) {
      const bar = document.createElement("div");
      bar.className = "notifyx-progress-bar";
      toast.appendChild(bar);
    }

    return toast;
  }

  /** @private */
  private static createLoaderElement(opts: NormalizedToastOptions): HTMLElement {
    const toast = document.createElement("div");
    toast.className = `notifyx notifyx-loading notifyx-${opts.type}`;
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    toast.setAttribute("aria-busy", "true");

    const wrapper = document.createElement("div");
    wrapper.className = "notifyx-loader";

    const spinner = document.createElement("div");
    spinner.className = "notifyx-spinner";
    spinner.setAttribute("aria-label", "Loading");
    wrapper.appendChild(spinner);

    if (opts.message) {
      const msg = document.createElement("span");
      msg.className = "notifyx-msg";
      msg.textContent = opts.message;
      wrapper.appendChild(msg);
    }

    toast.appendChild(wrapper);
    return toast;
  }

  // ─── Lifecycle ────────────────────────────────────────────────────────────

  /** @private */
  private static async removeToast(
    el: HTMLElement,
    opts: NormalizedToastOptions
  ): Promise<void> {
    if (el.hasAttribute("data-removing")) return;
    el.setAttribute("data-removing", "true");

    const timeoutData = (el as NotifyXElement).__notifyxTimeout;
    if (timeoutData?.timeoutId != null) {
      clearTimeout(timeoutData.timeoutId);
      timeoutData.timeoutId = null;
    }
    const pause = (el as NotifyXElement).__notifyxPauseTimer;
    const resume = (el as NotifyXElement).__notifyxResumeTimer;
    if (pause) el.removeEventListener("mouseenter", pause);
    if (resume) el.removeEventListener("mouseleave", resume);
    delete (el as NotifyXElement).__notifyxTimeout;
    delete (el as NotifyXElement).__notifyxPauseTimer;
    delete (el as NotifyXElement).__notifyxResumeTimer;

    if (opts.id) activeToastIds.delete(opts.id);

    await AnimationEngine.exit(el, (opts.animation ?? "spring") as AnimationPreset, opts.position);

    if (el.isConnected) el.remove();
    if (el.parentElement?.childNodes.length === 0) el.parentElement.remove();
    opts.onClose?.(opts.id!);
  }

  /** @private */
  private static setupAutoDismiss(el: HTMLElement, opts: NormalizedToastOptions): void {
    if (!opts.duration || opts.duration <= 0) return;

    const bar = el.querySelector(".notifyx-progress-bar") as HTMLElement | null;
    const td = { timeoutId: null as number | null, startTime: Date.now(), remaining: opts.duration, paused: false };

    if (bar) {
      bar.style.width = "100%";
      requestAnimationFrame(() => requestAnimationFrame(() => {
        bar.style.transition = `width ${opts.duration}ms linear`;
        bar.style.width = "0%";
      }));
    }

    const pause = () => {
      if (td.paused || td.timeoutId === null) return;
      td.paused = true;
      td.remaining = Math.max(0, td.remaining - (Date.now() - td.startTime));
      if (bar) { const w = getComputedStyle(bar).width; bar.style.transition = "none"; bar.style.width = w; void bar.offsetWidth; }
      clearTimeout(td.timeoutId); td.timeoutId = null;
    };

    const resume = () => {
      if (!td.paused || td.remaining <= 0) return;
      td.paused = false; td.startTime = Date.now();
      if (bar) requestAnimationFrame(() => { bar.style.transition = `width ${td.remaining}ms linear`; bar.style.width = "0%"; });
      td.timeoutId = window.setTimeout(() => this.removeToast(el, opts), td.remaining);
    };

    (el as NotifyXElement).__notifyxPauseTimer = pause;
    (el as NotifyXElement).__notifyxResumeTimer = resume;
    (el as NotifyXElement).__notifyxTimeout = td;

    if (opts.pauseOnHover) { el.addEventListener("mouseenter", pause); el.addEventListener("mouseleave", resume); }
    td.timeoutId = window.setTimeout(() => this.removeToast(el, opts), opts.duration);
  }

  /** @private */
  private static enforceMaxToasts(container: HTMLElement, max: number): void {
    const toasts = container.querySelectorAll<HTMLElement>(".notifyx:not([data-removing])");
    if (toasts.length >= max) this.removeToast(toasts[0], {} as NormalizedToastOptions);
  }

  // ─── Public API ───────────────────────────────────────────────────────────

  /**
   * Show a toast. Returns the toast element for imperative control.
   * @public
   */
  public static show(options: ToastOptions): HTMLElement {
    const opts = { ...DEFAULT_OPTIONS, ...globalDefaults, animation: "spring" as AnimationPreset, ...options } as NormalizedToastOptions;
    if (globalTheme !== "auto" && !opts.theme) opts.theme = globalTheme;
    if (!opts.id) opts.id = `nx-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    // Dedup by ID — pulse existing toast
    if (opts.id && activeToastIds.has(opts.id)) {
      const existing = activeToastIds.get(opts.id)!;
      AnimationEngine.pulse(existing);
      return existing;
    }

    const container = getContainer(opts.position);
    this.enforceMaxToasts(container, opts.maxToasts);

    const el = this.createToastElement(opts);
    container.appendChild(el);
    if (opts.id) {
      activeToastIds.set(opts.id, el);
      this.attachGestures(el, opts.id);
    }

    AnimationEngine.enter(el, opts.animation as AnimationPreset, opts.position);

    if (opts.priority === "critical") {
      setTimeout(() => {
        AnimationEngine.shake(el);
        const focusable = el.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusable.length) {
          const first = focusable[0] as HTMLElement;
          const last = focusable[focusable.length - 1] as HTMLElement;
          first.focus();
          el.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
              if (e.shiftKey) {
                if (document.activeElement === first) {
                  last.focus();
                  e.preventDefault();
                }
              } else {
                if (document.activeElement === last) {
                  first.focus();
                  e.preventDefault();
                }
              }
            }
          });
        }
      }, 650);
    }

    this.setupAutoDismiss(el, opts);
    return el;
  }

  /** @public */
  public static success(msg: string, options?: Partial<ToastOptions>): HTMLElement {
    return this.show({ ...options, message: msg, type: "success" });
  }

  /** @public */
  public static error(msg: string, options?: Partial<ToastOptions>): HTMLElement {
    return this.show({ ...options, message: msg, type: "error" });
  }

  /** @public */
  public static warning(msg: string, options?: Partial<ToastOptions>): HTMLElement {
    return this.show({ ...options, message: msg, type: "warning" });
  }


  /** @public */
  public static info(msg: string, options?: Partial<ToastOptions>): HTMLElement {
    return this.show({ ...options, message: msg, type: "info" });
  }

  /** @public */
  public static ai(msg: string, options?: Partial<ToastOptions> & { agentName?: string, confidence?: number, showCursor?: boolean }): HTMLElement {
    const aiOpts: AIMetadata = { ...options?.ai };
    if (options?.agentName) aiOpts.model = options.agentName;
    if (options?.confidence) aiOpts.confidence = options.confidence;
    if (options?.showCursor) aiOpts.streaming = true;
    
    return this.show({ ...options, message: msg, type: "ai", ai: Object.keys(aiOpts).length > 0 ? aiOpts : undefined });
  }


  /**
   * Show a centered loading toast. Dismiss with `dismissLoading()`.
   * @public
   */
  public static loading(msg: string, options?: Partial<ToastOptions>): void {
    if (activeLoadingToast) { this.removeToast(activeLoadingToast, {} as NormalizedToastOptions); activeLoadingToast = null; }
    const opts = { ...DEFAULT_OPTIONS, animation: "fade" as AnimationPreset, ...options, message: msg, type: "info" as ToastType, duration: 0, showProgress: false, dismissible: false, position: "center" as Position } as NormalizedToastOptions;
    const container = getContainer("center" as Position);
    const el = this.createLoaderElement(opts);
    container.appendChild(el);
    AnimationEngine.enter(el, "fade");
    activeLoadingToast = el;
  }

  /** @public */
  public static dismissLoading(): void {
    if (activeLoadingToast) { this.removeToast(activeLoadingToast, {} as NormalizedToastOptions); activeLoadingToast = null; }
  }

  /**
   * Promise-based toast — loading → success | error.
   * @public
   */
  
  /**
   * Shows a loading toast, then auto-transitions to success or error.
   * Perfect for API calls, file uploads, form submissions.
   */
  static promise<T>(
    promiseOrFn: Promise<T> | (() => Promise<T>),
    options: PromiseOptions<T>
  ): Promise<T> {
    const id = options.id ?? `promise-${Date.now()}`;
    const loadingOpts = typeof options.loading === 'string'
      ? { message: options.loading }
      : options.loading;

    // Show loading toast
    NotifyX.show({
      ...loadingOpts,
      type: 'loading',
      duration: 0,
      dismissible: false,
      id,
      position: options.position,
      animation: options.animation,
    });

    const p = typeof promiseOrFn === 'function' ? promiseOrFn() : promiseOrFn;

    return p.then((data) => {
      const msg = typeof options.success === 'function'
        ? options.success(data)
        : typeof options.success === 'string'
          ? options.success
          : typeof options.success.message === 'function'
            ? options.success.message(data)
            : options.success.message;

      NotifyX.update(id, {
        message: msg as string,
        type: 'success',
        duration: 4000,
        dismissible: true,
      });
      return data;
    }).catch((err) => {
      const msg = typeof options.error === 'function'
        ? options.error(err)
        : typeof options.error === 'string'
          ? options.error
          : typeof options.error.message === 'function'
            ? options.error.message(err)
            : options.error.message;

      NotifyX.update(id, {
        message: msg as string,
        type: 'error',
        duration: 5000,
        dismissible: true,
      });
      throw err;
    });
  }

  /**
   * Shows an AI-typing-style toast that streams text chunk by chunk.
   * Returns a StreamController to push chunks from LLM streams.
   */
  static stream(options: StreamOptions): StreamController {
    const id = options.id ?? `stream-${Date.now()}`;
    let accumulated = '';

    NotifyX.show({
      message: options.loadingMessage ?? '',
      title: options.title,
      type: 'ai',
      duration: 0,
      dismissible: false,
      id,
      position: options.position,
      animation: options.animation,
      ai: { ...options.ai, streaming: true },
    });

    return {
      update(chunk: string) {
        accumulated += chunk;
        options.onChunk?.(chunk, accumulated);
        NotifyX.update(id, {
          message: accumulated,
          type: 'ai',
        });
      },
      set(message: string) {
        accumulated = message;
        NotifyX.update(id, { message: message, type: 'ai' });
      },
      success(message: string, opts?: Partial<ToastOptions>) {
        options.onComplete?.(accumulated);
        NotifyX.update(id, {
          message,
          type: 'success',
          duration: 4000,
          dismissible: true,
          ai: { streaming: false },
          ...opts,
        });
      },
      error(message: string, opts?: Partial<ToastOptions>) {
        NotifyX.update(id, {
          message,
          type: 'error',
          duration: 5000,
          dismissible: true,
          ai: { streaming: false },
          ...opts,
        });
      },
      dismiss() {
        NotifyX.dismiss(id);
      },
    };
  }

  /**
   * Update an existing toast by ID (message, type, anything).
   */
  static update(id: string, options: Partial<ToastOptions>): void {
    const el = activeToastIds.get(id);
    if (!el) return;
    

    if (options.message) {
      const msgEl = el.querySelector('.notifyx-msg');
      if (msgEl) {
        if (options.richHtml) {
          msgEl.innerHTML = options.richHtml;
        } else {
          msgEl.textContent = options.message;
        }
        
        // Handle streaming state updates
        if (options.ai && 'streaming' in options.ai) {
          if (options.ai.streaming) {
            el.setAttribute("data-streaming", "true");
          } else {
            el.removeAttribute("data-streaming");
          }
        }
        
        if (el.getAttribute("data-streaming") === "true") {
          const cursor = document.createElement("span");
          cursor.className = "notifyx-stream-cursor";
          msgEl.appendChild(cursor);
        }
      }
    }

    
    if (options.title) {
      let titleEl = el.querySelector('.notifyx-title');
      if (!titleEl) {
        titleEl = document.createElement('strong');
        titleEl.className = 'notifyx-title';
        const bodyEl = el.querySelector('.notifyx-body');
        if (bodyEl) bodyEl.insertBefore(titleEl, bodyEl.firstChild);
      }
      titleEl.textContent = options.title;
    }

    if (options.type) {
      const classList = el.classList;
      classList.forEach(cls => {
        if (cls.startsWith('notifyx-') && !cls.match(/notifyx-(entering|exiting|stack-shifting|loading|streaming|stream-done)/)) {
          if (['success', 'error', 'warning', 'info', 'ai', 'default'].includes(cls.replace('notifyx-', ''))) {
            classList.remove(cls);
          }
        }
      });
      el.classList.add(`notifyx-${options.type}`);
      
      const iconEl = el.querySelector('.notifyx-icon');
      if (iconEl && !options.icon) {
        if (options.type === 'ai') {
          iconEl.innerHTML = SVG_ICONS.ai;
        } else {
          iconEl.innerHTML = SVG_ICONS[options.type as ToastType] || SVG_ICONS.default;
        }
      }
    }
    
    if (options.icon) {
      const iconEl = el.querySelector('.notifyx-icon');
      if (iconEl) {
        iconEl.innerHTML = typeof options.icon === 'string' ? `<span style="font-size:1.1em">${options.icon}</span>` : '';
        if (options.icon instanceof HTMLElement) {
            iconEl.appendChild(options.icon);
        }
      }
    }
    
    // Auto dismiss if duration > 0
    if (options.duration !== undefined && options.duration > 0) {
      this.setupAutoDismiss(el, { ...DEFAULT_OPTIONS, ...options } as NormalizedToastOptions);
    }
  }

  /**
   * Pause all running timers (e.g., when showing a modal).
   */
  static pauseAll(): void {
    activeToastIds.forEach((el) => {
      const pause = (el as NotifyXElement).__notifyxPauseTimer;
      if (pause) pause();
    });
  }

  /**
   * Resume all paused timers.
   */
  static resumeAll(): void {
    activeToastIds.forEach((el) => {
      const resume = (el as NotifyXElement).__notifyxResumeTimer;
      if (resume) resume();
    });
  }

  /**
   * Show multiple toasts as a grouped batch with shared dismiss.
   */
  static batch(toasts: ToastOptions[], sharedOptions?: Partial<ToastOptions>): string[] {
    return toasts.map(t => {
      const el = this.show({ ...sharedOptions, ...t });
      return el.getAttribute('data-id') || '';
    });
  }

  /**
   * Change global default theme at runtime.
   */
  static setTheme(theme: ThemePreset): void {
    globalTheme = theme;
    if (typeof document !== "undefined") {
      if (theme === "auto") {
        document.documentElement.removeAttribute("data-notifyx-theme");
      } else {
        document.documentElement.setAttribute("data-notifyx-theme", theme);
      }
    }
  }

  /**
   * Set global defaults once.
   */
  static configure(defaults: Partial<ToastOptions>): void {
    globalDefaults = { ...globalDefaults, ...defaults };
  }

  
  /**
   * Dismiss a toast by ID string or HTMLElement reference.
   * @public
   */
  public static dismiss(idOrEl: string | HTMLElement): void {
    if (typeof idOrEl === "string") {
      const el = activeToastIds.get(idOrEl);
      if (el) this.removeToast(el, {} as NormalizedToastOptions);
    } else if (idOrEl?.classList.contains("notifyx")) {
      this.removeToast(idOrEl, {} as NormalizedToastOptions);
    }
  }

  /**
   * Clear all active toasts.
   * @public
   */
  public static clear(): void {
    document.querySelectorAll<HTMLElement>(".notifyx").forEach((el) => {
      this.removeToast(el, {} as NormalizedToastOptions);
    });
    activeToastIds.clear();
    activeLoadingToast = null;
    globalQueue.clear();
  }

  // ─── Advanced accessors ───────────────────────────────────────────────────

  /** Access the global priority queue for advanced use cases. */
  static get queue(): ToastQueue { return globalQueue; }

  /** Access AnimationEngine for advanced animation control. */
  static get animation(): typeof AnimationEngine { return AnimationEngine; }

  /** Access StreamBridge for streaming utilities. */
  static get stream_bridge(): typeof StreamBridge { return StreamBridge; }
}
