import { SCORE_EMOJI_MAP } from "./constants.js";

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

export function getScoreIcon(value = 0, instaDeath = false) {
  const roundedScore = clamp(0, value - (value % 5), 100);
  if (instaDeath && roundedScore > 10) {
    return "💣";
  } else if (roundedScore in SCORE_EMOJI_MAP) {
    return SCORE_EMOJI_MAP[roundedScore];
  }
  return "";
}
