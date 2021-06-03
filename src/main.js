import { addMessages, getLocaleFromNavigator, init } from "svelte-i18n";
import EN_labels from "../locales/en.json";
import FR_labels from "../locales/fr.json";
import DemoPage from "./components/DemoPage.svelte";
import Game from "./components/Game.svelte";

addMessages("en", EN_labels);
addMessages("fr", FR_labels);

init({
  fallbackLocale: "en",
  initialLocale: getLocaleFromNavigator(),
});

const pageTarget = document.getElementById("click-precision-page");
const gameTarget = document.getElementById("click-precision-game");

if (pageTarget) {
  pageTarget.innerHTML = "";
  new DemoPage({ target: pageTarget });
} else if (gameTarget) {
  gameTarget.innerHTML = "";
  new Game({ target: gameTarget });
} else {
  console.warn("Could not find host element for click-precision-game");
}
