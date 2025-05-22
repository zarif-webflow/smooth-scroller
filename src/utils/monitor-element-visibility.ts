/**
 * Monitors an element for visibility changes and calls the callback when changes occur
 * @param element The element to monitor
 * @param callback Function called with the current visibility state
 * @returns Cleanup function to stop monitoring
 */
function monitorElementVisibility(
  element: HTMLElement,
  callback: (isVisible: boolean) => void
): () => void {
  // Initial visibility check
  let isVisible = isElementVisible(element);
  callback(isVisible);

  // Set up mutation observer for style/class changes
  const mutationObserver = new MutationObserver(() => {
    const newVisibility = isElementVisible(element);
    if (newVisibility !== isVisible) {
      isVisible = newVisibility;
      callback(isVisible);
    }
  });

  mutationObserver.observe(element, {
    attributes: true,
    attributeFilter: ['style', 'class'],
    attributeOldValue: true,
  });

  // Return cleanup function
  return () => {
    mutationObserver.disconnect();
  };
}

/**
 * Checks if an element is visible based on CSS properties
 * @param element Element to check visibility
 * @returns true if the element is visible
 */
function isElementVisible(element: HTMLElement): boolean {
  const style = window.getComputedStyle(element);
  return style.display !== 'none' && style.visibility !== 'hidden' && parseFloat(style.opacity) > 0;
}

export { monitorElementVisibility, isElementVisible };
