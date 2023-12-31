window.addEventListener("load", () => {
  const restartButtons = document.querySelectorAll(".restartBtn");
  const muteBtn = document.querySelector("#muteBtn");
  const muteText = document.querySelector(".muteText");
  const volumeSlide = document.querySelector("#volumeControl");
  const volumeSlideGameScreen = document.getElementById("volumeControlGame");
  const nameForm = document.getElementById("nameForm");
  const volumeSettings = JSON.parse(localStorage.getItem("volumeLevel"));
  if (volumeSettings) {
    volumeSlide.value = volumeSettings * 100;
  }
  let isMuted = false;
  let game;
  let shootOnce = false;

  function startGame() {
    let volume = volumeSlide.value / 100;
    volumeSlideGameScreen.value = volumeSlide.value;
    localStorage.setItem("volumeLevel", JSON.stringify(volume));
    game = new Game(isMuted, volume);
    game.start();
    document.addEventListener("keydown", (event) => {
      const key = event.key;
      const possibleKeys = ["ArrowUp", "ArrowDown", " ", "v"];
      if (possibleKeys.includes(key)) {
        switch (key) {
          case "ArrowDown":
            game.player.directionY = 4;
            game.player.element.src = "./assets/images/Player Running.gif";
            break;
          case "ArrowUp":
            game.player.directionY = -4;
            game.player.element.src = "./assets/images/Player Running.gif";
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
            game.player.element.src = "./assets/images/Player Idle.gif";
            break;
          case " ":
            shootOnce = false;
        }
      }
    });
  }

  restartButtons.forEach((button) => {
    button.addEventListener("click", () => {
      location.reload();
    });
  });
  muteBtn.addEventListener("click", () => {
    isMuted = !isMuted;
    if (isMuted) {
      muteText.innerText = "off";
    } else if (!isMuted) {
      muteText.innerText = "on";
    }
  });
  volumeSlideGameScreen.addEventListener("change", (event) => {
    game.handleVolumeChange(parseInt(event.target.value) / 100);
  });
  nameForm.addEventListener("submit", (event) => {
    event.preventDefault();
    startGame();
  });
});
