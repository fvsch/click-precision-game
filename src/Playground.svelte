<script context="module">
  import { onMount, onDestroy } from "svelte";
  import { PLAY_PHASES, TURN_STATE } from "./constants.js";
  import { clamp, toPercentString } from "./helpers.js";
  import { gameSpeed, instaDeath, playgroundSize, targetSize } from "./store.js";
  import Button from "./Button.svelte";

  const MAX_TURNS = 20;
  const GOOD_CLICK_POINTS = 5;
  const BAD_CLICK_POINTS = -1;
</script>

<script>
  export let goToSetup = () => {};
  export let goToResults = () => {};

  let phaseKey;
  let turnState = TURN_STATE.START;
  let turns = 0;
  let score = 0;
  let successCount = 0;
  let misclickCount = 0;
  let progressPercent = "";

  let timeout;
  let countdown = 0;
  let showTarget = false;

  let misclickPosition = { x: 0, y: 0 };
  let misclickStateClass = "";

  let targetPosition = { x: 0, y: 0 };
  let targetStateClass = "";

  $: {
    progressPercent = clamp(0, Math.round((turns / MAX_TURNS) * 100), 100);
    targetStateClass = getTargetStateClass(turnState, $instaDeath);
  }

  onMount(() => {
    startPhase("START");
  });
  onDestroy(() => {
    pausePhase();
  });

  function pausePhase() {
    if (timeout) clearTimeout(timeout);
  }

  function startPhase(key) {
    pausePhase();
    phaseKey = key;
    const phase = PLAY_PHASES[key];
    if (!phase) {
      const validKeys = Object.keys(PLAY_PHASES).join(", ");
      throw new Error(`Unknown play phase ${key} (must be one of: ${validKeys}`);
    }

    if (key === "TURN") {
      if (
        (!$instaDeath && turns >= MAX_TURNS) ||
        ($instaDeath && turnState === TURN_STATE.MISSED)
      ) {
        showResults();
        return;
      }
      // Reset click state on turn start
      turns += 1;
      turnState = TURN_STATE.START;
      targetPosition = getTargetPosition(targetPosition);
    } else if (key === "COOLDOWN") {
      if (turnState === TURN_STATE.SUCCESS) {
        successCount += 1;
      } else if (turnState === TURN_STATE.START) {
        turnState = TURN_STATE.MISSED;
      }
    }
    // Update UI
    countdown = phase.countdown;
    showTarget = phase.showTarget;

    // Schedule next phase
    timeout = setTimeout(
      () => startPhase(phase.next),
      Math.max(phase.minDuration, phase.durationRatio * $gameSpeed)
    );
  }

  function showResults() {
    goToResults({
      score,
      turns,
      successCount,
      misclickCount
    });
  }

  function recordClick(success) {
    // Count all misclicks, at any phase in the game
    if (!success) {
      misclickCount += 1;
      if (score > 0 && !$instaDeath) score += BAD_CLICK_POINTS;
    }
    // Any click during a turn ends the turn early
    if (phaseKey === "TURN" && turnState === TURN_STATE.START) {
      if (success) {
        score += GOOD_CLICK_POINTS;
        turnState = TURN_STATE.SUCCESS;
      } else {
        turnState = TURN_STATE.MISSED;
      }
      startPhase("COOLDOWN");
    }
  }

  function onSuccess(event) {
    event.preventDefault();
    event.stopPropagation();
    recordClick(true);
  }

  function onMisclick(event) {
    event.preventDefault();
    event.stopPropagation();
    displayMisclick(event.offsetX, event.offsetY);
    recordClick(false);
  }

  function getTargetStateClass(state, isInstaDeath) {
    switch (state) {
      case TURN_STATE.SUCCESS:
        return "__success__";
      case TURN_STATE.MISSED:
        return isInstaDeath ? "__fatal__" : "__missed__";
      default:
        return "";
    }
  }

  function displayMisclick(x, y) {
    misclickStateClass = "";
    misclickPosition = { x, y };
    requestAnimationFrame(() => {
      misclickStateClass = "__reveal__";
    });
  }

  function getTargetPosition(oldPosition) {
    const maxLength = $playgroundSize - $targetSize;
    const minDiff = maxLength / 2;
    let i = 0;
    let newPosition;
    while (i < 20) {
      i++;
      newPosition = newTargetPosition(maxLength, 10);
      if (!oldPosition) {
        break;
      }
      const diffX = Math.max(oldPosition.x, newPosition.x) - Math.min(oldPosition.x, newPosition.x);
      const diffY = Math.max(oldPosition.y, newPosition.y) - Math.min(oldPosition.y, newPosition.y);
      if (diffX > minDiff || diffY > minDiff) {
        break;
      }
    }
    return newPosition;
  }

  function newTargetPosition(maxLength, padding = 0) {
    const max = maxLength + 1 - padding * 2;
    const x = Math.floor(Math.random() * max) + padding;
    const y = Math.floor(Math.random() * max) + padding;
    return { x, y };
  }

  function restartGame() {
    pausePhase();
    goToSetup();
  }
</script>

<style>
  /* Toolbar */
  .precision-toolbar {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    font-size: 14px;
    min-height: 44px;
    padding: 4px;
    font-size: 16px;
    color: var(--color-text-light);
    background-color: var(--color-background-dark);
  }
  .precision-toolbar-score {
    flex-grow: 1;
    padding: 4px 12px;
  }
  .precision-toolbar-buttons {
    padding: 4px 6px;
    text-align: right;
  }
  .precision-progress {
    position: absolute;
    bottom: 0;
    left: 0;
    max-width: 100%;
    height: 6px;
    background-color: rgba(0, 0, 0, 0.6);
    transition: width calc(var(--game-speed) * 0.5) cubic-bezier(0.22, 0.61, 0.36, 1);
  }

  /* Play area */
  .precision-playground {
    position: relative;
    min-height: var(--playground-size);
    box-sizing: content-box;
    -webkit-user-select: none;
    user-select: none;
  }

  /* Countdown text */
  .precision-countdown {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    margin: 0;
    padding: 20px;
    text-align: center;
    font-weight: bold;
    text-shadow: 0.05em 0.05em white;
    font-size: 24px;
    line-height: 1;
    color: var(--color-highlight);
  }
  .precision-countdown span {
    animation: calc(var(--game-speed) * 1) ease-out forwards countdown-flash-in-out;
  }
  .precision-countdown strong {
    font-size: 60px;
    animation: calc(var(--game-speed) * 0.5) ease-out forwards countdown-flash-out;
  }
  @media (min-width: 500px) {
    .precision-countdown span {
      font-size: 44px;
    }
    .precision-countdown strong {
      font-size: 96px;
    }
  }

  /* Clickable target */
  .precision-target-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
  }
  .precision-target {
    position: absolute;
    box-sizing: border-box;
    top: var(--y);
    left: var(--x);
    width: var(--target-size);
    height: var(--target-size);
    margin: 0;
    padding: 0;
    border-radius: 2px;
    border: solid 2px var(--target-border);
    background-color: var(--target-background);
  }
  .precision-target[aria-hidden="true"] {
    display: none;
  }
  .precision-target.__success__ {
    background-color: lime;
    box-shadow: 0 0 10px lime;
    animation: 350ms ease-out forwards success-flash-out;
  }
  .precision-target.__missed__ {
    pointer-events: none;
    background-color: hsl(0, 0%, 75%);
    border-color: transparent;
    border-radius: 15%;
    animation: 250ms ease-out forwards missed-flash-out;
  }
  .precision-target.__fatal__ {
    pointer-events: none;
    background-color: red;
    border-color: transparent;
    animation: calc(var(--game-speed) * 0.5) ease-out forwards missed-explode;
  }

  /* Flashing indicator for misclicks */
  .precision-misclick {
    will-change: transform;
    position: absolute;
    box-sizing: border-box;
    top: calc(var(--y) - 16px);
    left: calc(var(--x) - 16px);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background-color: red;
    border-radius: 50%;
    pointer-events: none;
    opacity: 0;
  }
  .precision-misclick.__reveal__ {
    animation: 250ms ease-out forwards misclick-flash-out;
  }
  .precision-misclick::before {
    content: "";
    display: block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: white;
  }

  @keyframes success-flash-out {
    0% {
      opacity: 1;
      pointer-events: all;
    }
    79% {
      pointer-events: all;
    }
    80% {
      pointer-events: none;
    }
    100% {
      transform: scale(1.5);
      opacity: 0;
      pointer-events: none;
    }
  }
  @keyframes missed-flash-out {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      transform: scale(0.25) rotate(0.4turn);
    }
  }
  @keyframes missed-explode {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      transform: scale(12) rotate(2turn);
    }
  }
  @keyframes misclick-flash-out {
    from {
      opacity: 1;
      transform: scale(1);
    }
    to {
      transform: scale(2);
      opacity: 0;
    }
  }
  @keyframes countdown-flash-in-out {
    0% {
      opacity: 0;
      transform: scale(0.7);
    }
    50% {
      opacity: 1;
    }
    75% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      transform: scale(1);
    }
  }
  @keyframes countdown-flash-out {
    from {
      opacity: 1;
      transform: scale(1);
    }
    to {
      opacity: 0;
      transform: scale(2);
    }
  }
</style>

<header class="precision-toolbar">
  <span class="precision-toolbar-score">
    <strong>Score&nbsp;: {score}</strong>
  </span>
  <span class="precision-toolbar-buttons">
    <Button dark on:click={restartGame} text="🔄 Recommencer" />
  </span>
  {#if !$instaDeath}
    <span class="precision-progress" style="width: {progressPercent}%" />
  {/if}
</header>

<div class="precision-playground">
  <div class="precision-target-wrapper" on:mousedown={onMisclick}>
    <button
      aria-hidden={String(!showTarget)}
      aria-label="Cible"
      class="precision-target {targetStateClass}"
      style="--x: {targetPosition.x}px; --y: {targetPosition.y}px;"
      on:mousedown={onSuccess} />
  </div>
  {#if countdown}
    <p class="precision-countdown">
      {#if countdown === 4}
        <span>Clique le carré vert</span>
      {:else if countdown === 3}
        <strong>3</strong>
      {:else if countdown === 2}
        <strong>2</strong>
      {:else if countdown === 1}
        <strong>1</strong>
      {/if}
    </p>
  {/if}
  <span
    class="precision-misclick {misclickStateClass}"
    style="--x: {misclickPosition.x}px; --y: {misclickPosition.y}px;" />
</div>
