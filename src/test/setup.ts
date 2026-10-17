import '@testing-library/jest-dom';

class MockIntersectionObserver {
  readonly root: Element | null = null;
  readonly rootMargin: string = '';
  readonly thresholds: ReadonlyArray<number> = [];
  readonly scrollMargin = 0;

  private callback: IntersectionObserverCallback;

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
  }

  observe(target: Element): void {
    this.callback(
      [
        {
          isIntersecting: true,
          target,
          boundingClientRect: {} as DOMRectReadOnly,
          intersectionRatio: 1,
          intersectionRect: {} as DOMRectReadOnly,
          rootBounds: null,
          time: Date.now(),
        } as IntersectionObserverEntry,
      ],
      this as unknown as IntersectionObserver
    );
  }

  unobserve(): void {}
  disconnect(): void {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

window.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;

let rafId = 0;
let rafCallCount = 0;

window.requestAnimationFrame = ((cb: FrameRequestCallback) => {
  const id = ++rafId;
  rafCallCount++;
  const fakeTime = rafCallCount * 100;
  queueMicrotask(() => cb(fakeTime));
  return id;
}) as typeof requestAnimationFrame;

window.cancelAnimationFrame = (() => {}) as typeof cancelAnimationFrame;

if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}
