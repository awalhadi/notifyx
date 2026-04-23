import type { AnimationPreset } from "../types";

/**
 * AnimationEngine — centralises all animation logic.
 * @public
 */

/** Exit duration (ms) per style — used for fallback timeout */
const EXIT_DURATION: Record<AnimationPreset, number> = {
  spring: 420, slide: 320, fade: 240, flip: 330, bloom: 280, none: 0,
};

/**
 * AnimationEngine — centralises all animation logic.
 * @public
 */
export class AnimationEngine {
  private static prefersReducedMotion(): boolean {
    return (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }

  /**
   * Apply the enter animation to a toast element.
   * Accepts optional position/theme args (currently unused — reserved for slide direction override).
   */
  static enter(
    el: HTMLElement,
    style: AnimationPreset = "spring",
    _position?: string
  ): void {
    if (this.prefersReducedMotion() || style === "none") {
      el.style.opacity = "1";
      return;
    }
    el.classList.add("notifyx-entering");
  }

  /**
   * Apply the exit animation and return a Promise that resolves when done.
   */
  static exit(
    el: HTMLElement,
    style: AnimationPreset = "spring",
    _position?: string
  ): Promise<void> {
    return new Promise((resolve) => {
      if (this.prefersReducedMotion() || style === "none") {
        resolve();
        return;
      }

      const duration  = EXIT_DURATION[style];

      el.classList.remove("notifyx-entering");
      el.classList.add("notifyx-exiting");

      const fallback = setTimeout(resolve, duration + 60);

      const handler = (e: AnimationEvent) => {
        if (e.target !== el) return;
        clearTimeout(fallback);
        el.removeEventListener("animationend", handler);
        resolve();
      };
      el.addEventListener("animationend", handler);
    });
  }

  /**
   * Brief attention-shake animation (used for critical priority toasts).
   */
  static shake(el: HTMLElement): void {
    if (this.prefersReducedMotion()) return;
    el.classList.remove("nx-pulse-attention");
    void el.offsetWidth;
    el.classList.add("nx-pulse-attention");
    el.addEventListener(
      "animationend",
      () => el.classList.remove("nx-pulse-attention"),
      { once: true }
    );
  }

  /**
   * Pulse attention on an existing toast (e.g. dedup hit).
   */
  static pulse(el: HTMLElement): void {
    this.shake(el);
  }

  /**
   * Post-stream celebratory shimmer.
   */
  static shimmerHighlight(el: HTMLElement): void {
    if (this.prefersReducedMotion()) return;
    el.classList.add("nx-shimmer-highlight");
    el.addEventListener(
      "animationend",
      () => el.classList.remove("nx-shimmer-highlight"),
      { once: true }
    );
  }

  /**
   * Stagger entrance of multiple elements (e.g. queue flush).
   */
  static staggerEnter(
    elements: HTMLElement[],
    style: AnimationPreset = "spring",
    delayMs = 80
  ): void {
    elements.forEach((el, i) => setTimeout(() => this.enter(el, style), i * delayMs));
  }
}
