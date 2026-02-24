export function initMenu(onStartGame) {
  const playButton = document.getElementById("playButton");
  playButton.addEventListener("click", () => {
    document.getElementById("menu").style.display = "none";
    onStartGame();
  });
}
