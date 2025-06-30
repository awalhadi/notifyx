import { Position } from '../constants/index';

export const createToastContainer = (position: Position): HTMLElement => {
  const container = document.createElement('div');
  container.className = 'notifyx-container';
  container.setAttribute('data-position', position);
  container.setAttribute('aria-label', `Notifications ${position.replace('-', ' ')}`);
  return container;
};

export const getContainer = (position: Position): HTMLElement => {
  const existingContainer = document.querySelector(
    `.notifyx-container[data-position="${position}"]`
  ) as HTMLElement;
  
  if (existingContainer) return existingContainer;
  
  const container = createToastContainer(position);
  document.body.appendChild(container);
  return container;
};