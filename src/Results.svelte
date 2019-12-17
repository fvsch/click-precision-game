<script context="module">
  import { clamp } from "./helpers.js";
  import { gameSpeed, instaDeath, playgroundSize, targetSize } from "./store.js";
  import Button from "./Button.svelte";

  const SCORE_EMOJI_MAP = {
    0: "👻",
    5: "🤕",
    10: "😭",
    15: "😭",
    20: "😫",
    25: "😫",
    30: "😞",
    35: "😑",
    40: "😑",
    45: "😔",
    50: "😔",
    55: "🤔",
    60: "🤔",
    65: "🙂",
    70: "🙂",
    75: "😊",
    80: "😊",
    85: "😄",
    90: "😘",
    95: "🤩",
    100: "🎯"
  };
</script>

<script>
  export let goToSetup = () => {};
  export let score = 0;
  export let turns = 0;
  export let successCount = 0;
  export let misclickCount = 0;

  function getIcon() {
    const _score = clamp(0, score - (score % 5), 100);
    if ($instaDeath && _score > 10) {
      return "💣";
    } else if (_score in SCORE_EMOJI_MAP) {
      return SCORE_EMOJI_MAP[_score];
    }
    return "";
  }
</script>

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

<div class="precision-results">
  <span class="precision-result-icon">{getIcon()}</span>
  <h3 class="precision-result-title">
    <strong>Score&nbsp;: {score}</strong>
    {#if $instaDeath}
      <span>Mort subite</span>
    {/if}
  </h3>

  <table class="precision-params">
    {#if !$instaDeath}
      <tr>
        <th scope="row">Cibles touchées</th>
        <td>{successCount} / {turns}</td>
      </tr>
      <tr>
        <th scope="row">Clics à côté</th>
        <td>{misclickCount}</td>
      </tr>
    {/if}
    <tr>
      <th scope="row">Cible</th>
      <td>{$targetSize}&nbsp;px</td>
    </tr>
    <tr>
      <th scope="row">Conteneur</th>
      <td>{$playgroundSize}&nbsp;px</td>
    </tr>
    <tr>
      <th scope="row">Vitesse</th>
      <td>{$gameSpeed}&nbsp;ms</td>
    </tr>
  </table>
  <p>
    <Button on:click={goToSetup} text="🔄 Recommencer" />
  </p>
</div>
