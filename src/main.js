import Game from "./Game.svelte";

const target = document.getElementById("click-precision-game");

if (target) {
  new Game({ target });
} else {
  console.warn("Could not find element with id 'click-precision-game'");
}
