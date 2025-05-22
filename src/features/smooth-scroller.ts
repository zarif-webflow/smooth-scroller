import { monitorElementVisibility } from '@/utils/monitor-element-visibility';
import { preventBodyScroll } from '@zag-js/remove-scroll';
import Lenis from 'lenis';

const DEFAULT_LERP_VALUE = 0.1;
const DEFAULT_WHEEL_MULTIPLIER = 0.7;

const selectors = {
  enableTrigger: '[data-smooth-scroll-element=enable-trigger]',
  disableTrigger: '[data-smooth-scroll-element=disable-trigger]',
  toggleTrigger: '[data-smooth-scroll-element=toggle-trigger]',
};

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

  const scrollDisablersIfInView = Array.from(
    document.querySelectorAll<HTMLElement>('[data-smooth-scroll-element=disable-when-in-view]')
  );

  const activateLenis = () => {
    return new Lenis({
      lerp,
      wheelMultiplier,
      gestureOrientation: 'vertical',
    });
  };

  let lenis = activateLenis();
  let isLenisActive = true;

  function raf(time: number) {
    lenis?.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  const scrollTogglers = Array.from(
    document.querySelectorAll<HTMLElement>(selectors.toggleTrigger)
  );
  const scrollStartTriggers = Array.from(
    document.querySelectorAll<HTMLElement>(selectors.enableTrigger)
  );
  const scrollStopTriggers = Array.from(
    document.querySelectorAll<HTMLElement>(selectors.disableTrigger)
  );

  let resetScroll: (() => void) | undefined = undefined;

  const enableScrolling = () => {
    lenis = activateLenis();
    resetScroll?.();
    isLenisActive = true;
  };

  const disableScrolling = () => {
    lenis?.destroy();
    resetScroll = preventBodyScroll();
    isLenisActive = false;
  };

  for (const scrollToggleElement of scrollTogglers) {
    scrollToggleElement.addEventListener('click', () => {
      if (isLenisActive) {
        disableScrolling();
      } else {
        enableScrolling();
      }
    });
  }

  for (const startTrigger of scrollStartTriggers) {
    startTrigger.addEventListener('click', () => {
      enableScrolling();
    });
  }

  for (const stopTrigger of scrollStopTriggers) {
    stopTrigger.addEventListener('click', () => {
      disableScrolling();
    });
  }

  for (const targetElement of scrollDisablersIfInView) {
    monitorElementVisibility(targetElement, (isVisible) => {
      if (isVisible) {
        disableScrolling();
      } else {
        enableScrolling();
      }
    });
  }
};

init();
