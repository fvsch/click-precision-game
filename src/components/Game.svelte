<script>
  import { locale } from "svelte-i18n";
  import gameState from "../state/game.js";
  import {
    gamePhaseDurations,
    gameSpeed,
    instaDeath,
    playgroundSize,
    targetSize,
  } from "../state/setup.js";
  import Playground from "./Playground.svelte";
  import Results from "./Results.svelte";
  import Setup from "./Setup.svelte";

  // The 'SHOW_RESULTS' event should have a 'resultData' object in its payload,
  // and we need to store that payload in this component's state to pass it down
  // to the Results component. Alternatively, we could use XState’s 'context'.
  let resultData = {};
  gameState.onTransition((state, event) => {
    if (state.changed && event.resultData) {
      resultData = event.resultData;
    }
  });
</script>

<section
  lang={$locale}
  class="precision-container"
  class:precision-container-instadeath={$instaDeath}
  style={`
    --game-speed: ${$gameSpeed}ms;
    --countdown-tick: ${Math.floor($gamePhaseDurations.countdown / 6)}ms;
    --playground-size: ${$playgroundSize}px;
    --target-size: ${$targetSize}px;`}>
  {#if $gameState.matches("setup")}
    <Setup />
  {:else if $gameState.matches("playing")}
    <Playground />
  {:else if $gameState.matches("results")}
    <Results {...resultData} />
  {/if}
</section>

<style>
  .precision-container {
    --game-speed: 1000ms;
    --playground-size: 600px;
    --target-size: 24px;
    --target-border: #428549;
    --target-background: #90c296;
    --color-highlight: hsl(265, 15%, 40%);
    --color-text-dark: #222;
    --color-text-light: white;
    --color-background-dark: hsl(265, 15%, 40%);
    --color-background-light: hsl(265, 20%, 92%);
    box-sizing: content-box;
    display: flex;
    flex-direction: column;
    border: solid 2px var(--color-highlight);
    border-radius: 4px;
    width: var(--playground-size);
    margin-left: auto;
    margin-right: auto;
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    font-size: 16px;
    font-variant-numeric: tabular-nums;
    line-height: 1.4;
    color: var(--color-text-dark);
    background-color: var(--color-background-light);
  }
  .precision-container-instadeath {
    --color-highlight: hsl(0, 100%, 36%);
    --color-text-dark: hsl(0, 100%, 24%);
    --color-text-light: white;
    --color-background-dark: hsl(0, 100%, 36%);
    --color-background-light: hsl(0, 20%, 92%);
  }
</style>
