import { preventBodyScroll } from '@zag-js/remove-scroll';
import Lenis from 'lenis';

const DEFAULT_LERP_VALUE = 0.1;
const DEFAULT_WHEEL_MULTIPLIER = 0.7;

const init = () => {
  const noSmoothScroll = document.body.dataset.noSmoothScroll !== undefined;

  if (noSmoothScroll) {
    console.debug('Smooth scroll was skipped because noSmoothScroll is set on the body');
    return;
  }

  const lerpValueParsed = Number.parseFloat(document.body.dataset.smoothScrollLerpValue || '');
  const lerp = Number.isNaN(lerpValueParsed) ? DEFAULT_LERP_VALUE : lerpValueParsed;

  const wheelMultiplierStr = Number.parseFloat(
    document.body.dataset.smoothScrollWheelMultiplier || ''
  );
  const wheelMultiplier = Number.isNaN(wheelMultiplierStr)
    ? DEFAULT_WHEEL_MULTIPLIER
    : wheelMultiplierStr;

  const activateLenis = () => {
    return new Lenis({
      lerp,
      wheelMultiplier,
      gestureOrientation: 'vertical',
    });
  };

  let lenis = activateLenis();

  function raf(time: number) {
    lenis?.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  const scrollTogglers = [...document.querySelectorAll(selectors.toggleScroll)] as HTMLElement[];
  const scrollStartTriggers = [
    ...document.querySelectorAll(selectors.startScroll),
  ] as HTMLElement[];
  const scrollStopTriggers = [...document.querySelectorAll(selectors.stopScroll)] as HTMLElement[];

  let resetScroll: (() => void) | undefined = undefined;

  for (let i = 0; i < scrollTogglers.length; i++) {
    const scrollToggleElement = scrollTogglers[i];

    scrollToggleElement.addEventListener('click', () => {
      if (scrollToggleElement.classList.contains('stop-scroll')) {
        resetScroll?.();
        lenis = activateLenis();
        scrollToggleElement.classList.remove('stop-scroll');
        return;
      }
      resetScroll = preventBodyScroll();
      lenis?.destroy();
      scrollToggleElement.classList.add('stop-scroll');
    });
  }

  for (const startTrigger of scrollStartTriggers) {
    startTrigger.addEventListener('click', () => {
      lenis = activateLenis();
      resetScroll?.();
    });
  }

  for (const stopTrigger of scrollStopTriggers) {
    stopTrigger.addEventListener('click', () => {
      lenis?.destroy();
      resetScroll = preventBodyScroll();
    });
  }
};

init();
