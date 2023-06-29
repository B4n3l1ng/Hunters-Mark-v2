window.addEventListener("load", () => {
  const startButton = document.getElementById("startBtn");
  const instructionsButton = document.getElementById("instructionsBtn");
  const instructions = document.getElementById("instructions");
  let game;

  function startGame() {
    game = new Game();
    game.start();
    document.addEventListener("keydown", (event) => {
      const key = event.key;
      const possibleKeys = ["ArrowUp", "ArrowDown", " "];
      if (possibleKeys.includes(key)) {
        switch (key) {
          case "ArrowDown":
            game.player.directionY = 4;
            break;
          case "ArrowUp":
            game.player.directionY = -4;
            break;
          case " ":
            game.player.isShooting = true;
        }
      }
    });
    document.addEventListener("keyup", (event) => {
      const key = event.key;
      const possibleKeys = ["ArrowUp", "ArrowDown", " "];
      if (possibleKeys.includes(key)) {
        switch (key) {
          case "ArrowDown":
          case "ArrowUp":
            game.player.directionY = 0;
            break;
          case " ":
            game.player.isShooting = false;
        }
      }
    });
  }

  function showInstructions() {
    instructions.style.display === "block"
      ? (instructions.style.display = "none")
      : (instructions.style.display = "block");
  }

  instructionsButton.addEventListener("click", () => {
    showInstructions();
  });

  startButton.addEventListener("click", () => {
    startGame();
  });
});
