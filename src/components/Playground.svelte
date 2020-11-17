<script>
  import { onMount, onDestroy } from "svelte";
  import { CLICK_POINTS, MAX_TURNS, TURN_SUCCESS } from "../constants.js";
  import { clamp } from "../helpers.js";
  import gameState, { send } from "../state/game.js";
  import { gamePhaseDurations, instaDeath, playgroundSize, targetSize } from "../state/setup.js";
  import Button from "./Button.svelte";

  let turnSuccess;
  let turnsCount = 0;
  let score = 0;
  let successCount = 0;
  let misclickCount = 0;
  let progressPercent = "";

  let timeout;

  let misclickPosition = { x: -100, y: -100 };
  let misclickStateClass = "";

  let targetPosition = { x: -100, y: -100 };
  let targetStateClass = "";

  $: {
    progressPercent = clamp(0, Math.round((turnsCount / MAX_TURNS) * 100), 100);
    targetStateClass = getTargetStateClass(turnSuccess, $instaDeath);
  }

  // Listen to state transitions.
  // This should give us a first state with `{ playing: "start" }` as its value.
  onMount(() => {
    gameState.onTransition(startPhase);
  });

  // Clean up listeners and timers
  onDestroy(() => {
    gameState.off(startPhase);
    clearTimeout(timeout);
  });

  /**
   * At the start of a game phase (countdown, turn or cooldown),
   * update the UI and schedule the next phase.
   */
  function startPhase(state) {
    const phaseKey = state.value.playing;
    if (!state.changed || !phaseKey || !(phaseKey in $gamePhaseDurations)) {
      return;
    }

    // Different events can lead to competing timeouts
    clearTimeout(timeout);

    // Event to send at the end of this phase
    let onPhaseEnd = () => send("NEXT");

    // Start new turns with a blank success state and new position
    if (phaseKey === "turn") {
      turnsCount += 1;
      turnSuccess = TURN_SUCCESS.PLAYING;
      targetPosition = getTargetPosition(targetPosition);
    }

    // In the cooldown phase, analyse the last turn
    if (phaseKey === "cooldown") {
      // Register the previous turn's failure or success
      if (turnSuccess === TURN_SUCCESS.SUCCESS) {
        successCount += 1;
      }
      // If not successful when cooldown starts, set the turnSuccess to
      // update the UI and make the target disappear
      if (turnSuccess === TURN_SUCCESS.PLAYING) {
        turnSuccess = TURN_SUCCESS.MISSED;
      }
      // Should we end the game at the end of the cooldown?
      // Normal mode: after MAX_TURNS
      // InstaDeath: if the previous turn was a failure
      if (
        (!$instaDeath && turnsCount >= MAX_TURNS) ||
        ($instaDeath && turnSuccess !== TURN_SUCCESS.SUCCESS)
      ) {
        onPhaseEnd = showResults;
      }
    }

    // Schedule next phase
    timeout = setTimeout(onPhaseEnd, $gamePhaseDurations[phaseKey]);
  }

  function showResults() {
    send({
      type: "SHOW_RESULTS",
      resultData: {
        score,
        turnsCount,
        successCount,
        misclickCount,
      },
    });
  }

  /**
   * In normal mode, players can click however many times they want,
   * but misclicks will dock their score.
   */
  function recordClick(onTarget) {
    // Conditions for success: on target, only counted once, and during the turn
    // (not during cooldown while the target is fading out).
    if (
      onTarget === true &&
      turnSuccess === TURN_SUCCESS.PLAYING &&
      $gameState.matches("playing.turn")
    ) {
      score += CLICK_POINTS.SUCCESS;
      turnSuccess = TURN_SUCCESS.SUCCESS;
    }

    // Count all misclicks, at any phase in the game.
    // Do not set the TURN_SUCCESS.MISSED state, since it’s final and will make
    // the target disappear. Instead, we want players to still be able to try.
    if (onTarget === false) {
      score = Math.max(0, score + CLICK_POINTS.MISSED);
      misclickCount += 1;
    }
  }

  /**
   * In instadeath mode, any click ends the turn.
   */
  function recordInstadeathClick(onTarget) {
    if (onTarget === true && turnSuccess === TURN_SUCCESS.PLAYING) {
      turnSuccess = TURN_SUCCESS.SUCCESS;
    } else {
      turnSuccess = TURN_SUCCESS.MISSED;
    }
    send("END_TURN");
  }

  function onSuccess(event) {
    event.preventDefault();
    event.stopPropagation();
    if ($instaDeath) {
      recordInstadeathClick(true);
    } else {
      recordClick(true);
    }
  }

  function onMisclick(event) {
    event.preventDefault();
    event.stopPropagation();
    displayMisclick(event.offsetX, event.offsetY);
    if ($instaDeath) {
      recordInstadeathClick(false);
    } else {
      recordClick(false);
    }
  }

  function getTargetStateClass(state, isInstaDeath) {
    switch (state) {
      case TURN_SUCCESS.SUCCESS:
        return "__success__";
      case TURN_SUCCESS.MISSED:
        return isInstaDeath ? "__fatal__" : "__missed__";
      case TURN_SUCCESS.PLAYING:
        return "__playing__";
      default:
        return "__hidden__";
    }
  }

  function displayMisclick(x, y) {
    const container = document.querySelector(".precision-container");
    container.classList.remove("__misclick__");
    misclickStateClass = "";
    misclickPosition = { x, y };
    requestAnimationFrame(() => {
      misclickStateClass = "__reveal__";
      container.classList.add("__misclick__");
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
    send("SHOW_SETUP");
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
    display: grid;
    align-content: center;
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
    line-height: 1.2;
    color: var(--color-highlight);
  }
  .precision-countdown > * {
    opacity: 0;
    grid-column: 1;
    grid-row: 1;
  }
  .precision-countdown span {
    font-size: 24px;
    animation: calc(var(--countdown-tick) * 2) ease-out forwards countdown-flash-in-out;
  }
  .precision-countdown strong {
    font-size: 60px;
    line-height: 1;
    animation: var(--countdown-tick) ease-out forwards countdown-flash-out;
  }
  .precision-countdown strong:nth-child(2) {
    animation-delay: calc(var(--countdown-tick) * 2);
  }
  .precision-countdown strong:nth-child(3) {
    animation-delay: calc(var(--countdown-tick) * 3);
  }
  .precision-countdown strong:nth-child(4) {
    animation-delay: calc(var(--countdown-tick) * 4);
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
  .precision-target.__hidden__0 {
    visibility: hidden;
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
  <span class="precision-toolbar-score"> <strong>Score&nbsp;: {score}</strong> </span>
  <span class="precision-toolbar-buttons">
    <Button dark on:click={restartGame} text="🔄 Recommencer" />
  </span>
  {#if !$instaDeath}<span class="precision-progress" style="width: {progressPercent}%" />{/if}
</header>

<div class="precision-playground">
  <div class="precision-target-wrapper" on:mousedown={onMisclick}>
    <button
      aria-hidden={String(!($gameState.matches('playing.turn') || $gameState.matches('playing.cooldown')))}
      aria-label="Cible"
      class="precision-target {targetStateClass}"
      style="--x: {targetPosition.x}px; --y: {targetPosition.y}px;"
      on:mousedown={onSuccess} />
  </div>
  {#if $gameState.matches('playing.countdown')}
    <p class="precision-countdown">
      <span>Clique le carré vert</span>
      <strong>3</strong>
      <strong>2</strong>
      <strong>1</strong>
    </p>
  {/if}
  <span
    class="precision-misclick {misclickStateClass}"
    style="--x: {misclickPosition.x}px; --y: {misclickPosition.y}px;" />
</div>
