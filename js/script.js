window.addEventListener("load", () => {
  const startButton = document.getElementById("startBtn");
  const instructionsButton = document.getElementById("instructionsBtn");
  const instructions = document.getElementById("instructions");
  const restartButtons = document.querySelectorAll(".restartBtn");
  let game;
  let shootOnce = false;

  function startGame() {
    game = new Game();
    game.start();
    document.addEventListener("keydown", (event) => {
      const key = event.key;
      const possibleKeys = ["ArrowUp", "ArrowDown", " ", "v"];
      if (possibleKeys.includes(key)) {
        switch (key) {
          case "ArrowDown":
            game.player.directionY = 4;
            break;
          case "ArrowUp":
            game.player.directionY = -4;
            break;
          case " ":
            if (!game.isGameOver) {
              if (!shootOnce) {
                game.shoot();
                shootOnce = true;
              }
            }
            break;
          case "v":
            if (!game.isGameOver) {
              if (game.artyUses !== 0) {
                game.artyRun();
              }
            }
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
            shootOnce = false;
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
  restartButtons.forEach((button) => {
    button.addEventListener("click", () => {
      location.reload();
    });
  });
});
