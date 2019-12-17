import { derived, writable } from "svelte/store";

import { clamp } from "./helpers.js";
import { PLAYGROUND_SIZE, TARGET_SIZE, SPEED } from "./constants.js";

export const screen = writable("setup");
export const instaDeath = writable(false);

/** Use a derived store to clamp the playground size value in a single place */
export const playgroundSizeInput = writable(getPlaygroundStartSize());
export const playgroundSize = derived(playgroundSizeInput, ($val) => {
  if (typeof $val === "number" && !isNaN($val)) {
    return clamp(PLAYGROUND_SIZE.MIN, $val, PLAYGROUND_SIZE.MAX);
  }
  return PLAYGROUND_SIZE.DEFAULT;
});

function getPlaygroundStartSize() {
  if (typeof window === "object" && window.innerWidth) {
    const extra = Math.floor(window.innerWidth - 40) - PLAYGROUND_SIZE.MIN;
    if (!isNaN(extra) && extra > 0) {
      const validExtra = extra - (extra % PLAYGROUND_SIZE.STEP);
      return clamp(PLAYGROUND_SIZE.MIN, PLAYGROUND_SIZE.MIN + validExtra, PLAYGROUND_SIZE.DEFAULT);
    }
  }
  return PLAYGROUND_SIZE.DEFAULT;
}

/** Use a derived store to clamp the target size value in a single place */
export const targetSizeInput = writable(TARGET_SIZE.DEFAULT);
export const targetSize = derived(targetSizeInput, ($val) => {
  if (typeof $val === "number" && !isNaN($val)) {
    return clamp(TARGET_SIZE.MIN, $val, TARGET_SIZE.MAX);
  }
  return TARGET_SIZE.DEFAULT;
});

/** Use a derived store to clamp the speed value in a single place */
export const gameSpeedInput = writable(SPEED.DEFAULT);
export const gameSpeed = derived(gameSpeedInput, ($val) => {
  if (typeof $val === "number" && !isNaN($val)) {
    return clamp(SPEED.MIN, $val, SPEED.MAX);
  }
  return SPEED.DEFAULT;
});
