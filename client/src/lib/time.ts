/** Cooking times are chosen in 30-minute steps, up to 12 hours. */
export const TIME_STEP_MINUTES = 30;
export const TIME_OPTIONS = Array.from(
  { length: 24 },
  (_, i) => (i + 1) * TIME_STEP_MINUTES,
);

/** 30 → "30 min", 60 → "1 h", 90 → "1 h 30 min". */
export function formatMinutes(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (!hours) return `${rest} min`;
  return rest ? `${hours} h ${rest} min` : `${hours} h`;
}
