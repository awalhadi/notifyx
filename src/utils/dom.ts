import type { Position } from '../constants/positions';

/**
 * Cache for container queries to improve performance
 */
const containerCache = new Map<Position, HTMLElement>();

/**
 * Creates a new toast container element
 * @internal
 */
const createToastContainer = (position: Position): HTMLElement => {
  const container = document.createElement('div');
  container.className = 'notifyx-container';
  container.setAttribute('data-position', position);
  container.setAttribute('aria-label', `Notifications ${position.replace('-', ' ')}`);
  return container;
};

/**
 * Gets or creates a toast container for a specific position
 * Uses caching for better performance
 * @param position - The screen position for the container
 * @returns The container element
 * @internal
 */
export const getContainer = (position: Position): HTMLElement => {
  // Check cache first
  const cached = containerCache.get(position);
  if (cached && document.body.contains(cached)) {
    return cached;
  }

  // Check DOM
  const existingContainer = document.querySelector(
    `.notifyx-container[data-position="${position}"]`
  ) as HTMLElement;
  
  if (existingContainer) {
    containerCache.set(position, existingContainer);
    return existingContainer;
  }
  
  // Create new container
  const container = createToastContainer(position);
  document.body.appendChild(container);
  containerCache.set(position, container);
  
  return container;
};