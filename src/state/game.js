import { interpret, Machine } from "xstate";

const gameMachine = Machine({
  id: "game",
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
      initial: "countdown",
      states: {
        countdown: {
          on: { NEXT: "turn" },
        },
        turn: {
          on: { NEXT: "cooldown", END_TURN: "cooldown" },
        },
        cooldown: {
          on: { NEXT: "turn" },
        },
      },
    },
    results: {
      on: {
        SHOW_SETUP: "setup",
      },
    },
  },
});

const gameService = interpret(gameMachine, {
  devTools: process.env.NODE_ENV !== "production",
});
gameService.start();

export default gameService;

export const send = gameService.send;
export const state = gameService.state;
