class Game {
  constructor() {
    this.startScreen = document.getElementById("game-intro");
    this.gameContainer = document.getElementById("game-container");
    this.gameScreen = document.getElementById("game-screen");
    this.stats = document.getElementById("stats");
    this.gameScreen.style.border = "5px solid black";
    this.height = 800;
    this.width = 900;
    this.player = new Player(this.gameScreen);
    this.obstacles = [new Obstacle(this.gameScreen)];
    this.isGameOver = false;
    this.backgroundMusic = new Audio("./assets/audio/Background Music.mp3");
    this.backgroundMusic.volume = 0.1;
    this.animateId;
  }

  start() {
    this.gameScreen.style.width = `${this.width}px`;
    this.gameScreen.style.height = `${this.height}px`;

    this.startScreen.style.display = "none";
    this.stats.style.display = "flex";
    this.gameScreen.style.display = "block";
    this.backgroundMusic.play();
    this.gameLoop();
  }

  gameLoop() {
    this.update();
    if (this.isGameOver) {
      this.endGame();
    } else {
      this.animateId = requestAnimationFrame(() => this.gameLoop());
    }
  }

  update() {
    this.player.move();
    this.obstacles.forEach((obstacle) => {
      obstacle.move();
    });
    if (this.player.isShooting) {
      this.player.shoot();
    }
  }
}
