class Game {
  constructor() {
    this.startScreen = document.getElementById("game-intro");
    this.gameContainer = document.getElementById("game-container");
    this.gameScreen = document.getElementById("game-screen");
    this.endScreenWin = document.getElementById("game-won");
    this.endScreenLose = document.getElementById("game-lost");
    this.stats = document.getElementById("stats");
    this.scoreHTML = document.getElementById("score");
    this.gameScreen.style.border = "5px solid black";
    this.height = 800;
    this.width = 900;
    this.gameSpeed = 3;
    this.obstacleInterval = 150;
    this.player = new Player(this.gameScreen);
    this.obstacles = [new Obstacle(this.gameScreen, this.gameSpeed)];
    this.projectiles = [];
    this.isGameOver = false;
    this.backgroundMusic = new Audio("./assets/audio/Background Music.mp3");
    this.backgroundMusic.volume = 0.1;
    this.animateId;
    this.lives = 3;
    this.score = 0;
    this.artyUses = 1;
    this.artyRunning = false;
    this.artyBlock = document.createElement("div");
    this.artyBlock.style.position = "absolute";
    this.artyBlock.width = 150;
    this.artyBlock.style.width = `${this.artyBlock.width}px`;
    this.artyBlock.style.height = "800px";
    this.artyBlock.style.top = `0px`;
    this.artyBlock.left = 0;
    this.artyBlock.style.left = `${this.artyBlock.left}px`;
    this.artyBlock.style.display = "none";

    for (let i = 0; i < 8; i++) {
      new Arty(this.artyBlock, 100 * i);
    }
    this.gameScreen.appendChild(this.artyBlock);

    this.dyingSound = new Audio("./assets/audio/Dying.wav");
    this.dyingSound.volume = 0.5;
    this.gameFailMusic = new Audio("./assets/audio/fail sound.wav");
    this.gameFailMusic.volume = 0.5;
    this.successMusic = new Audio("./assets/audio/Game Over Screen.mp3");
    this.successMusic.volume = 0.5;
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
    if (this.animateId % this.obstacleInterval === 0) {
      this.obstacles.push(new Obstacle(this.gameScreen, this.gameSpeed));
    }
    if (this.lives === 0) {
      this.isGameOver = true;
      this.endGame();
    } else {
      this.animateId = requestAnimationFrame(() => this.gameLoop());
    }
  }

  update() {
    this.player.move();
    if (this.artyRunning) {
      this.artyBlock.left += 3;
      this.artyBlock.style.left = `${this.artyBlock.left}px`;
      if (this.artyBlock.left + this.artyBlock.width >= this.width) {
        this.artyBlock.remove();
        this.artyRunning = false;
      }
    }
    const projectilesToKeep = this.projectiles.map((element) => element);
    this.projectiles.forEach((projectile) => projectile.move());
    for (let i = 0; i < this.obstacles.length; i += 1) {
      let obstacle = this.obstacles[i];
      obstacle.move();
      if (this.player.didCollide(obstacle)) {
        obstacle.element.remove();
        this.lives -= 1;
        document.getElementById("lives").innerText = this.lives;
        this.obstacles.splice(i, 1);
        i--;
      } else if (obstacle.left < 0 /* - obstacle.width */) {
        obstacle.element.remove();
        this.lives -= 1;
        document.getElementById("lives").innerText = this.lives;
        this.obstacles.splice(i, 1);
        i--;
      } else if (this.artyRunning) {
        let artyRect = this.artyBlock.getBoundingClientRect();
        let obstacleRect = obstacle.element.getBoundingClientRect();
        if (
          artyRect.left < obstacleRect.right &&
          artyRect.right > obstacleRect.left
        ) {
          obstacle.element.remove();
          this.score += 1;
          document.getElementById("score").innerText = this.score;
          this.obstacles.splice(i, 1);
          i--;
        }
      }
      this.projectiles.forEach((projectile, index) => {
        if (projectile.didCollide(obstacle)) {
          this.dyingSound.currentTime = 0;
          this.dyingSound.play();
          obstacle.element.remove();
          projectile.element.remove();
          this.score += 1;
          this.scoreHTML.innerText = this.score;
          projectilesToKeep.splice(index, 1);
          this.obstacles.splice(i, 1);
          if (this.score % 5 === 0 && this.score !== 0) {
            this.increaseLevel();
          }
          i--;
        } else if (projectile.left >= this.width) {
          projectile.element.remove();
          projectilesToKeep.splice(index, 1);
        }
      });
      this.projectiles = projectilesToKeep;
    }
    if (this.lives <= 0) {
      this.isGameOver = true;
    }
  }

  increaseLevel() {
    this.gameSpeed += 1;
    this.obstacleInterval -= 20;
    this.obstacles.forEach((obstacle) => {
      obstacle.setSpeed(this.gameSpeed);
    });
  }

  shoot() {
    this.player.shoot();
    this.projectiles.push(new Projectile(this.gameScreen, this.player));
  }

  artyRun() {
    let artyHowl = new Audio("./assets/audio/howl.wav");
    artyHowl.volume = 0.3;
    artyHowl.play();
    this.artyBlock.style.display = "block";
    this.artyRunning = true;
  }

  endGame() {
    cancelAnimationFrame(this.animateId);
    if (this.score >= 3) {
      this.stats.style.display = "none";
      this.gameScreen.style.display = "none";
      this.endScreenWin.style.display = "block";
      document.getElementById("scoreWon").innerText = this.score;
      this.backgroundMusic.pause();
      this.successMusic.play();
    } else {
      this.stats.style.display = "none";
      this.gameScreen.style.display = "none";
      this.endScreenLose.style.display = "block";
      document.getElementById("scoreLost").innerText = this.score;
      this.backgroundMusic.pause();
      this.gameFailMusic.play();
    }
  }
}
