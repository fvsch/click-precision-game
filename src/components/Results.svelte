<script>
  import { t } from "svelte-i18n";
  import { getScoreIcon } from "../helpers.js";
  import { send } from "../state/game.js";
  import { gameSpeed, instaDeath, playgroundSize, targetSize } from "../state/setup.js";
  import Button from "./Button.svelte";

  export let score = 0;
  export let turnsCount = 0;
  export let successCount = 0;
  export let misclickCount = 0;

  function goToSetup() {
    send("SHOW_SETUP");
  }

  let scoreIcon;
  $: scoreIcon = getScoreIcon(score, $instaDeath);
</script>

<div class="precision-results">
  <span class="precision-result-icon">{scoreIcon}</span>
  <h3 class="precision-result-title">
    <strong>{$t("results.score")} {score}</strong>
    {#if $instaDeath}<span>{$t("results.instadeath")}</span>{/if}
  </h3>

  <table class="precision-params">
    {#if $instaDeath}
      <tr>
        <th scope="row">{$t("results.success_count")}</th>
        <td>{successCount}</td>
      </tr>
    {:else}
      <tr>
        <th scope="row">{$t("results.success_count")}</th>
        <td>{successCount} / {turnsCount}</td>
      </tr>
      <tr>
        <th scope="row">{$t("results.misclick_count")}</th>
        <td>{misclickCount}</td>
      </tr>
    {/if}
    <tr>
      <th scope="row">{$t("results.target_size")}</th>
      <td>{$t("results.target_size_value", { values: [$targetSize] })}</td>
    </tr>
    <tr>
      <th scope="row">{$t("results.playground_size")}</th>
      <td>{$t("results.playground_size_value", { values: [$playgroundSize] })}</td>
    </tr>
    <tr>
      <th scope="row">{$t("results.game_speed")}</th>
      <td>{$t("results.game_speed_value", { values: [$gameSpeed] })}</td>
    </tr>
  </table>
  <p>
    <Button on:click={goToSetup} text={$t("results.restart")} />
  </p>
</div>

<style>
  .precision-results {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: var(--playground-size);
    padding: 40px 20px;
  }
  .precision-result-icon {
    display: block;
    font-size: 64px;
    line-height: 1;
    transform: translateY(-10px);
  }
  .precision-result-title {
    margin: 0 0 20px;
    font-size: 100%;
    color: var(--color-highlight);
    text-align: center;
  }
  .precision-result-title strong {
    font-size: 200%;
    letter-spacing: -0.02em;
  }
  .precision-result-title span {
    display: block;
    font-size: 75%;
    letter-spacing: 0.02em;
    text-transform: uppercase;
  }
  .precision-params {
    margin: 1em 0;
    border: none;
    border-collapse: collapse;
  }
  .precision-params th,
  .precision-params td {
    padding: 0.25em;
    font-weight: 500;
    border-bottom: dotted 1px rgba(0, 0, 0, 0.15);
  }
  .precision-params th {
    text-align: left;
    padding-right: 1.25em;
    color: var(--color-highlight);
  }
</style>
