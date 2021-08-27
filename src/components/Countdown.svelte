<script>
  import { t } from "svelte-i18n";
</script>

<p class="precision-countdown">
  <span>{$t("playground.countdown_intro")}</span>
  <strong>3</strong>
  <strong>2</strong>
  <strong>1</strong>
</p>

<style>
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
