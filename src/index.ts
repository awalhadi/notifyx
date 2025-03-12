import { ToastOptions, ToastType } from './types';
import { getContainer } from './utils/dom';

const defaultOptions: Partial<ToastOptions> = {
  type: 'info',
  duration: 3000,
  position: 'top-right',
  dismissible: true
};

const ANIMATION_CLASSES = {
  enter: 'animate-slide-in',
  exit: 'animate-slide-out'
};
export class NotifyX {
  private static createToastElement(options: ToastOptions): HTMLElement {
    const toast = document.createElement('div');
    toast.className = `toast toast-${options.type} ${ANIMATION_CLASSES.enter}`;
    toast.setAttribute('role', 'alert')
    
    const message = document.createElement('span');
    message.textContent = options.message;
    toast.appendChild(message);

    if (options.dismissible) {
      const closeButton = document.createElement('button');
      closeButton.className = 'toast-close';
      closeButton.innerHTML = '✕';
      closeButton.setAttribute('aria-label', 'Close');
      closeButton.onclick = () => toast.remove();
      toast.appendChild(closeButton);
    }

    return toast;
  }

  public static show(options: ToastOptions): void {
    const mergedOptions = { ...defaultOptions, ...options };
    const container = getContainer(mergedOptions.position!);
    const toastElement = this.createToastElement(mergedOptions);
    
    container.appendChild(toastElement);

    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    const cleanupToast = () => {
      mergedOptions.onClose?.();
      if (container.childNodes.length === 0) {
        container.remove();
      }
    };
    if (mergedOptions.duration) {
      timeoutId = setTimeout(() => {
        toastElement.classList.remove(ANIMATION_CLASSES.enter);
        toastElement.classList.add(ANIMATION_CLASSES.exit);

        const handleAnimationEnd = () => {
          toastElement.remove();
          cleanupToast();
          toastElement.removeEventListener('animationend', handleAnimationEnd);
        };
        
        toastElement.addEventListener('animationend', handleAnimationEnd);
        // toastElement.addEventListener('animationend', () => {
        //   toastElement.remove();
        //   mergedOptions.onClose?.();
          
        //   if (container.childNodes.length === 0) {
        //     container.remove();
        //   }
        // });
      }, mergedOptions.duration);
    }

    if (mergedOptions.dismissible) {
      const closeButton = toastElement.querySelector('.toast-close') as HTMLButtonElement;
      closeButton.onclick = () => {
        if (timeoutId) clearTimeout(timeoutId);
        toastElement.remove();
        cleanupToast();
      };
    }
  }

  public static success(message: string, options?: Partial<ToastOptions>): void {
    this.show({ ...options, message, type: 'success' });
  }

  public static error(message: string, options?: Partial<ToastOptions>): void {
    this.show({ ...options, message, type: 'error' });
  }

  public static warning(message: string, options?: Partial<ToastOptions>): void {
    this.show({ ...options, message, type: 'warning' });
  }

  public static info(message: string, options?: Partial<ToastOptions>): void {
    this.show({ ...options, message, type: 'info' });
  }
}

// check window object to avoid conflicts
if (typeof window !== 'undefined' && !(window as any).NotifyX) {
  (window as any).NotifyX = NotifyX;
}
export default NotifyX;