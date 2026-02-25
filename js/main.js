import { initMenu } from "./menu.js";
import { initGame } from "./game.js";

initGame();
document.getElementById("menu").style.display = "none";

// initMenu(() => {
//   initGame();
// });
