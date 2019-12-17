export const TARGET_SIZE = {
  MIN: 16,
  DEFAULT: 24,
  MAX: 64,
  STEP: 8
};

export const PLAYGROUND_SIZE = {
  MIN: 300,
  DEFAULT: 600,
  MAX: 800,
  STEP: 50
};

export const SPEED = {
  MIN: 500,
  DEFAULT: 1000,
  MAX: 2000,
  STEP: 100
};

export const PLAY_PHASES = {
  START: {
    next: "COUNTDOWN_3",
    durationRatio: 1,
    minDuration: 1000,
    countdown: 4,
    showTarget: false
  },
  COUNTDOWN_3: {
    next: "COUNTDOWN_2",
    durationRatio: 0.5,
    minDuration: 400,
    countdown: 3,
    showTarget: false
  },
  COUNTDOWN_2: {
    next: "COUNTDOWN_1",
    durationRatio: 0.5,
    minDuration: 400,
    countdown: 2,
    showTarget: false
  },
  COUNTDOWN_1: {
    next: "TURN",
    durationRatio: 0.5,
    minDuration: 400,
    countdown: 1,
    showTarget: false
  },
  TURN: {
    next: "COOLDOWN",
    durationRatio: 1,
    minDuration: 400,
    countdown: 0,
    showTarget: true
  },
  COOLDOWN: {
    next: "TURN",
    durationRatio: 0.5,
    minDuration: 400,
    countdown: 0,
    showTarget: true
  }
};

export const TURN_STATE = {
  START: "START",
  SUCCESS: "SUCCESS",
  MISSED: "MISSED"
};
