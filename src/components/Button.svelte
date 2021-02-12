<script>
  export let type = "button";
  export let text = "";
  export let big = false;
  export let full = false;
  export let dark = false;
</script>

<button
  type={type}
  class="precision-button"
  class:precision-button-big={big}
  class:precision-button-full={full}
  class:precision-button-dark={dark}
  on:click>
  {text}
</button>

<style>
  .precision-button {
    --button-color: var(--color-text-dark);
    --button-background: rgba(255, 255, 255, 0.65);
    --button-background-active: var(--color-text-light);
    --button-border: var(--color-highlight);
    --button-border-focus: var(--color-text-dark);
    padding: 0.4em 0.6em;
    border: solid 1px var(--button-border);
    border-radius: 4px;
    font: inherit;
    font-weight: 400;
    color: var(--button-color);
    background-color: var(--button-background);
  }
  .precision-button:active,
  .precision-button:hover,
  .precision-button:focus {
    border-color: var(--button-border-focus);
  }
  .precision-button:active {
    background-color: var(--button-background-active);
  }
  .precision-button-big {
    padding: 0.6em 0.8em;
    border-width: 2px;
    font-weight: 500;
  }
  .precision-button-big {
    width: 100%;
  }
  .precision-button-dark {
    --button-color: white;
    --button-background: rgba(0, 0, 0, 0.2);
    --button-background-active: rgba(0, 0, 0, 0.5);
    --button-border-focus: rgba(255, 255, 255, 0.5);
    --button-border: rgba(255, 255, 255, 0.25);
  }
</style>
