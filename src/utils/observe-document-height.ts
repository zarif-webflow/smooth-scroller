/**
 * Observes changes in document height and calls the callback when changes occur
 * Uses ResizeObserver to detect height changes
 * @param {(newHeight: number) => void} callback - Function to call when height changes
 * @returns {() => void} - Function to stop observing
 */
export function observeDocumentHeight(callback: (newHeight: number) => void): () => void {
  let previousHeight: number = Math.max(
    document.documentElement.scrollHeight,
    document.body.scrollHeight
  );

  const observer: ResizeObserver = new ResizeObserver(() => {
    const currentHeight: number = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight
    );

    if (currentHeight !== previousHeight) {
      callback(currentHeight);
      previousHeight = currentHeight;
    }
  });

  // Observe both document element and body for maximum compatibility
  observer.observe(document.documentElement);
  observer.observe(document.body);

  // Return a cleanup function
  return (): void => observer.disconnect();
}

// Usage example:
const stopObserving: () => void = observeDocumentHeight((newHeight: number) => {
  console.log(`Document height changed to ${newHeight}px`);
});

// To stop observing:
// stopObserving();
