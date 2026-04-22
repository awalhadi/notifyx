import re

with open("src/core/NotifyX.ts", "r") as f:
    content = f.read()

# Find NotifyX.show and append attachGestures
show_original = """    const el = this.createToastElement(opts);
    container.appendChild(el);
    if (opts.id) activeToastIds.set(opts.id, el);

    AnimationEngine.enter(el, opts.animation as AnimationPreset, opts.position);"""

show_new = """    const el = this.createToastElement(opts);
    container.appendChild(el);
    if (opts.id) {
      activeToastIds.set(opts.id, el);
      this.attachGestures(el, opts.id);
    }

    AnimationEngine.enter(el, opts.animation as AnimationPreset, opts.position);"""

content = content.replace(show_original, show_new)

# Append attachGestures method before createToastElement or right after show
gestures_method = """  private static attachGestures(element: HTMLElement, id: string): void {
    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    const onStart = (e: TouchEvent | MouseEvent) => {
      startX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      isDragging = true;
      element.style.transition = 'none';
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
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);
  }"""

# Insert before createToastElement
create_toast = "  private static createToastElement(opts: NormalizedToastOptions): HTMLElement {"
content = content.replace(create_toast, gestures_method + "\n\n  /** @private */\n" + create_toast)

with open("src/core/NotifyX.ts", "w") as f:
    f.write(content)

