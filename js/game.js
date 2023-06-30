class Game {
  constructor() {
    this.startScreen = document.getElementById("game-intro");
    this.gameContainer = document.getElementById("game-container");
    this.gameScreen = document.getElementById("game-screen");
    this.endScreenWin = document.getElementById("game-won");
    this.endScreenLose = document.getElementById("game-lost");
    this.stats = document.getElementById("stats");
    this.gameScreen.style.border = "5px solid black";
    this.height = 800;
    this.width = 900;
    this.player = new Player(this.gameScreen);
    this.obstacles = [];
    this.isGameOver = false;
    this.backgroundMusic = new Audio("./assets/audio/Background Music.mp3");
    this.backgroundMusic.volume = 0.1;
    this.animateId;
    this.lives = 3;
    this.score = 0;
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
    if (this.animateId % 150 === 0) {
      this.obstacles.push(new Obstacle(this.gameScreen));
    }
    if (this.isGameOver) {
      this.endGame();
    } else {
      this.animateId = requestAnimationFrame(() => this.gameLoop());
    }
  }

  update() {
    this.player.move();
    const obstaclesToKeep = [];
    this.obstacles.forEach((obstacle) => {
      obstacle.move();
      if (this.player.didCollide(obstacle)) {
        obstacle.element.remove();
        this.lives--;
        document.getElementById("lives").innerText = this.lives;
      } else if (obstacle.left < 0 - obstacle.width) {
        this.score--;
        document.getElementById("lives").innerText = this.lives;
      } else {
        obstaclesToKeep.push(obstacle);
      }
    });
    this.obstacles = obstaclesToKeep;
    if (this.lives <= 0) {
      this.isGameOver = true;
    }
    if (this.player.isShooting) {
      this.player.shoot();
    }
  }

  endGame() {
    cancelAnimationFrame(this.animateId);
    if (this.score >= 3) {
      this.stats.style.display = "none";
      this.gameScreen.style.display = "none";
      this.endScreenWin.style.display = "block";
      document.getElementById("scoreWon").innerText = this.score;
    } else {
      this.stats.style.display = "none";
      this.gameScreen.style.display = "none";
      this.endScreenLose.style.display = "block";
      document.getElementById("scoreLost").innerText = this.score;
    }
  }
}
