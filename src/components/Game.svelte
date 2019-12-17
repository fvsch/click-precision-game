<script>
  import { screen, instaDeath, gameSpeed, playgroundSize, targetSize } from "../store.js";
  import Playground from "./Playground.svelte";
  import Results from "./Results.svelte";
  import Setup from "./Setup.svelte";

  let resultData = {};

  function startPlaying() {
    $screen = "playground";
  }
  function goToSetup() {
    $screen = "setup";
  }
  function goToResults(data) {
    $screen = "results";
    resultData = data;
  }
</script>

<style>
  .precision-container {
    --game-speed: 1500ms;
    --playground-size: 400px;
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

<section
  class="precision-container"
  class:precision-container-instadeath={$instaDeath}
  style={`
    --game-speed: ${$gameSpeed}ms;
    --playground-size: ${$playgroundSize}px;
    --target-size: ${$targetSize}px;`}>
  {#if $screen === 'setup'}
    <Setup startPlaying={startPlaying} />
  {:else if $screen === 'playground'}
    <Playground goToSetup={goToSetup} goToResults={goToResults} />
  {:else if $screen === 'results'}
    <Results goToSetup={goToSetup} {...resultData} />
  {/if}
</section>
