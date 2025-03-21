export const createToastContainer = (position: string): HTMLElement => {
  const container = document.createElement('div');
  container.className = 'notifyx-container';
  container.setAttribute('data-position', position);
  return container;
};

export const getContainer = (position: string): HTMLElement => {
  const existingContainer = document.querySelector(
    `.notifyx-container[data-position="${position}"]`
  ) as HTMLElement;
  
  if (existingContainer) return existingContainer;
  
  const container = createToastContainer(position);
  document.body.appendChild(container);
  return container;
};