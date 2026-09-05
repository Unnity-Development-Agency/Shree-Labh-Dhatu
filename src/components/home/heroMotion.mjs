const TAU = Math.PI * 2;

export function wrapAngle(angle) {
  return ((angle + Math.PI) % TAU + TAU) % TAU - Math.PI;
}

export function frameDelta(time, previousTime) {
  if (previousTime === null) return 0;
  return Math.max(0, Math.min((time - previousTime) / 1000, 1 / 30));
}

// Always take the short way round, including reset after several full drags.
// The speed cap prevents a large input jump from becoming a fast catch-up spin.
export function approachAngle(current, target, delta) {
  const difference = wrapAngle(target - current);
  const eased = difference * (1 - Math.exp(-delta * 5));
  const maxStep = delta * 0.85;
  return wrapAngle(current + Math.max(-maxStep, Math.min(eased, maxStep)));
}
