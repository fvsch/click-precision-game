export function clamp(min, value, max) {
  if (typeof value !== "number" || isNaN(value)) {
    return min;
  }
  return Math.max(min, Math.min(max, value));
}

export function toPercentString(value, total, placeholder = "…") {
  const result = Math.round((value / total) * 100);
  if (typeof result === "number" && !isNaN(result)) {
    return result + "\u2009%";
  }
  return placeholder;
}
