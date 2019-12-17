<script>
  import { gameSpeedInput, instaDeath, playgroundSizeInput, targetSizeInput } from "../store.js";
  import { PLAYGROUND_SIZE, TARGET_SIZE, SPEED } from "../constants.js";
  import Button from "./Button.svelte";

  export let startPlaying = () => {};

  function onSubmit(event) {
    event.preventDefault();
    startPlaying();
  }
</script>

<style>
  .precision-setup {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: var(--playground-size);
    padding: 20px;
  }
  .precision-title {
    margin: 0 0 0.5em;
    font-size: 135%;
    color: var(--color-highlight);
  }
  .precision-intro {
    max-width: 24em;
    margin: 0.5em 0;
    text-align: center;
  }
  .precision-target-demo {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100px;
    width: 100%;
    margin: 0;
  }
  .precision-target {
    flex: none;
    display: inline-block;
    box-sizing: border-box;
    width: var(--target-size);
    height: var(--target-size);
    margin: 0;
    padding: 0;
    border-radius: 2px;
    border: solid 2px var(--target-border);
    background-color: var(--target-background);
  }
  .precision-settings {
    margin: 0.25em -0.75em;
  }
  .precision-settings-row {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: center;
  }
  .precision-settings p {
    display: block;
    margin: 0;
    padding: 0.75em 0.75em;
  }
  .precision-settings label {
    display: block;
    padding-bottom: 0.25em;
  }
  .precision-settings input[type="number"] {
    width: 6em;
    margin: 0;
    padding: 0.5em 0.6em;
    border: solid 1px var(--color-highlight);
    border-radius: 2px;
    font: inherit;
    color: inherit;
    background-color: rgba(255, 255, 255, 0.65);
  }
  .precision-settings input[type="number"]:focus {
    border-color: var(--color-text-dark);
    background-color: white;
  }
  .precision-settings-instadeath {
    margin: 0.5em 0;
  }
  .precision-settings-instadeath label {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5em;
    text-transform: uppercase;
  }
  .precision-settings-instadeath input {
    flex: none;
    width: 20px;
    height: 20px;
    margin-right: 4px;
  }
</style>

<div class="precision-setup">
  <h3 class="precision-title">Petit jeu de précision…</h3>
  <p class="precision-intro">
    Material Design recommande des boutons de 24px minimum pour les interfaces à la souris. Est-ce
    que cela vous semble suffisant&nbsp;?
  </p>
  <p class="precision-target-demo"><span class="precision-target" /></p>
  <form class="precision-settings" on:submit={onSubmit}>
    <div class="precision-settings-row">
      <p>
        <label for="target-size">Cible (px)</label>
        <input
          bind:value={$targetSizeInput}
          type="number"
          id="target-size"
          step={TARGET_SIZE.STEP}
          min={TARGET_SIZE.MIN}
          max={TARGET_SIZE.MAX}
          title="Taille de la cible entre {TARGET_SIZE.MIN} et {TARGET_SIZE.MAX} pixels" />
      </p>
      <p>
        <label for="playground-size">Conteneur (px)</label>
        <input
          bind:value={$playgroundSizeInput}
          type="number"
          id="playground-size"
          step={PLAYGROUND_SIZE.STEP}
          min={PLAYGROUND_SIZE.MIN}
          max={PLAYGROUND_SIZE.MAX}
          title="Taille du conteneur entre {PLAYGROUND_SIZE.MIN} et {PLAYGROUND_SIZE.MAX} pixels" />
      </p>
      <p>
        <label for="game-speed">Vitesse (ms)</label>
        <input
          bind:value={$gameSpeedInput}
          type="number"
          id="game-speed"
          step={SPEED.STEP}
          min={SPEED.MIN}
          max={SPEED.MAX}
          title="Vitesse du jeu entre {SPEED.MIN}ms et {SPEED.MAX}ms" />
      </p>
    </div>
    <p class="precision-settings-instadeath">
      <label for="insta-death">
        <input type="checkbox" bind:checked={$instaDeath} id="insta-death" />
        <span>Mort subite 💣</span>
      </label>
    </p>
    <p class="precision-settings-submit">
      <Button type="submit" big full text="▶️ Commencer" />
    </p>
  </form>
</div>
