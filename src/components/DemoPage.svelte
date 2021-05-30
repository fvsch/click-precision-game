<script>
  import { locale, t } from "svelte-i18n";
  import gameState from "../state/game.js";
  import Game from "./Game.svelte";
  locale.subscribe((newLocale) => {
    document.documentElement.setAttribute("lang", newLocale);
  });
</script>

<svelte:head>
  <title>{$t("page.title")}</title>
</svelte:head>

<Game />

{#if $gameState.matches("playing") === false}
  <footer lang={$locale}>
    <p>
      {$t("page.repo_info")}
      <a href="https://github.com/fvsch/click-precision-game">fvsch/click-precision-game</a>
    </p>
  </footer>
{/if}
