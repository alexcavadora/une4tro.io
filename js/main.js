import { initMenu } from "./menu.js";
import { initGame } from "./game.js";

initMenu(() => {
  initGame();
});
