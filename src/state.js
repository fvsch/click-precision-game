import { interpret, Machine } from "xstate";

const screenMachine = Machine({
  id: "screen",
  initial: "setup",
  states: {
    setup: {
      on: {
        START_PLAYING: "playing",
      },
    },
    playing: {
      on: {
        SHOW_RESULTS: "results",
        SHOW_SETUP: "setup",
      },
    },
    results: {
      on: {
        SHOW_SETUP: "setup",
      },
    },
  },
});

const screenService = interpret(screenMachine);
screenService.start();

export const screen = screenService;
