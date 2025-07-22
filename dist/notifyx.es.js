const u = (n) => {
  const t = document.querySelector(`.notifyx-container[data-position="${n}"]`);
  if (t) return t;
  const e = ((i) => {
    const o = document.createElement("div");
    return o.className = "notifyx-container", o.setAttribute("data-position", i), o.setAttribute("aria-label", `Notifications ${i.replace("-", " ")}`), o;
  })(n);
  return document.body.appendChild(e), e;
}, r = { enter: "notifyx-enter", exit: "notifyx-exit", slideEnter: "notifyx-slide-enter", slideExit: "notifyx-slide-exit" }, f = { TOP_RIGHT: "top-right", TOP_LEFT: "top-left", BOTTOM_RIGHT: "bottom-right", BOTTOM_LEFT: "bottom-left" }, d = { type: "info", duration: 3e3, position: f.TOP_RIGHT, dismissible: !0, maxToasts: 5 };
class y {
  static generateToastElement(t) {
    const e = document.createElement("div");
    e.className = `notifyx notifyx-${t.type} ${r.enter} rounded-lg border shadow-md`, e.setAttribute("role", "alert"), e.setAttribute("aria-live", "polite");
    const i = document.createElement("span");
    if (i.className = "notifyx-msg", i.textContent = t.message, e.appendChild(i), t.dismissible) {
      const o = document.createElement("button");
      o.className = "notifyx-close", o.innerHTML = "✕", o.setAttribute("aria-label", "Close notification"), o.setAttribute("type", "button"), o.onclick = () => this.removeToast(e), e.appendChild(o);
    }
    return e;
  }
  static removeToast(t) {
    t.classList.remove(r.enter), t.classList.add(r.exit);
    const e = () => {
      t.remove(), t.removeEventListener("animationend", e);
      const i = t.parentElement;
      i && i.childNodes.length === 0 && i.remove();
    };
    t.addEventListener("animationend", e);
  }
  static show(t) {
    const e = { ...d, ...t }, i = u(e.position), o = this.generateToastElement(e), c = i.querySelectorAll(".notifyx");
    if (c.length >= d.maxToasts) {
      const s = c[0];
      this.removeToast(s);
    }
    i.appendChild(o);
    let a = null;
    if (e.duration && e.duration > 0 && (a = setTimeout(() => {
      this.removeToast(o), e.onClose?.();
    }, e.duration)), e.dismissible) {
      const s = o.querySelector(".notifyx-close");
      if (s) {
        const l = s.onclick;
        s.onclick = (m) => {
          a && clearTimeout(a), e.onClose?.(), l && l.call(s, m);
        };
      }
    }
  }
  static success(t, e) {
    this.show({ ...e, message: t, type: "success" });
  }
  static error(t, e) {
    this.show({ ...e, message: t, type: "error" });
  }
  static warning(t, e) {
    this.show({ ...e, message: t, type: "warning" });
  }
  static info(t, e) {
    this.show({ ...e, message: t, type: "info" });
  }
  static clear() {
    document.querySelectorAll(".notifyx-container").forEach((t) => {
      t.querySelectorAll(".notifyx").forEach((e) => {
        this.removeToast(e);
      });
    });
  }
}
typeof window > "u" || window.NotifyX || (window.NotifyX = y);
export {
  r as ANIMATION_CLASSES,
  d as DEFAULT_OPTIONS,
  y as NotifyX,
  f as POSITIONS,
  y as default
};
//# sourceMappingURL=notifyx.es.js.map
