class Game {
  constructor(isMuted, volume) {
    this.startScreen = document.getElementById("game-intro");
    this.gameContainer = document.getElementById("game-container");
    this.gameScreen = document.getElementById("game-screen");
    this.endScreenWin = document.getElementById("game-won");
    this.endScreenLose = document.getElementById("game-lost");
    this.stats = document.getElementById("stats");
    this.scoreHTML = document.getElementById("score");
    this.volume = volume;
    this.gameScreen.style.border = "5px solid black";
    this.gameScreen.style.display = "none";
    this.name = document.getElementById("nameInput").value;
    this.highScores = JSON.parse(localStorage.getItem("highScores"));
    this.isMuted = isMuted;
    this.height = 800;
    this.width = 900;
    this.gameSpeed = 3;
    this.obstacleInterval = 150;
    this.player = new Player(this.gameScreen);
    this.obstacles = [new Obstacle(this.gameScreen, this.gameSpeed)];
    this.projectiles = [];
    this.isGameOver = false;
    this.backgroundMusic = new Audio("./assets/audio/Background Music.mp3");
    this.backgroundMusic.volume = volume;
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
    this.dyingSound.volume = volume;
    this.gameFailMusic = new Audio("./assets/audio/fail sound.wav");
    this.gameFailMusic.volume = volume;
    this.successMusic = new Audio("./assets/audio/Game Over Screen.mp3");
    this.successMusic.volume = volume;

    this.volumeSlider = document.getElementById("volumeControlGameLabel");
  }

  start() {
    this.gameScreen.style.width = `${this.width}px`;
    this.gameScreen.style.height = `${this.height}px`;
    this.startScreen.style.display = "none";
    this.stats.style.display = "flex";
    this.gameScreen.style.display = "block";
    this.volumeSlider.style.display = "block";
    if (!this.isMuted) {
      this.backgroundMusic.play();
    }
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
      setTimeout(() => {
        this.animateId = requestAnimationFrame(() => this.gameLoop());
      }, 1000 / 90 /* FPS number*/);
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
      } else if (obstacle.left < 0) {
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
      for (let j = 0; j < this.projectiles.length; j += 1) {
        let projectile = this.projectiles[j];
        if (projectile.didCollide(obstacle)) {
          this.dyingSound.currentTime = 0;
          if (!this.isMuted) {
            this.dyingSound.play();
          }
          obstacle.element.remove();
          projectile.element.remove();
          this.score += 1;
          this.scoreHTML.innerText = this.score;
          this.obstacles.splice(i, 1);
          this.projectiles.splice(j, 1);
          if (this.score % 5 === 0 && this.score !== 0) {
            this.increaseLevel();
          }
          i--;
          j--;
        } else if (projectile.left >= this.width) {
          projectile.element.remove();
          this.projectiles.splice(j, 1);
          j--;
        }
      }
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
    if (!this.isMuted) {
      this.player.shoot();
    }
    this.projectiles.push(new Projectile(this.gameScreen, this.player));
  }

  artyRun() {
    let artyHowl = new Audio("./assets/audio/howl.wav");
    artyHowl.volume = this.volume;
    if (!this.isMuted) {
      artyHowl.play();
    }
    this.artyBlock.style.display = "block";
    this.artyRunning = true;
  }

  endGame() {
    cancelAnimationFrame(this.animateId);
    this.handleHighScore();
    this.highScores = JSON.parse(localStorage.getItem("highScores"));
    const scoreList = document.createElement("ol");
    this.highScores.forEach((score) => {
      const li = document.createElement("li");
      li.innerText = `${score.score} by ${score.name}`;
      scoreList.appendChild(li);
    });
    scoreList.classList.add("list");
    this.volumeSlider.style.display = "none";

    this.stats.style.display = "none";
    this.gameScreen.style.display = "none";
    if (this.score >= 20) {
      this.endScreenWin.style.display = "block";
      document.getElementById("scoreWon").innerText = this.score;
      document.getElementById("highScores").appendChild(scoreList);
      this.backgroundMusic.pause();
      if (!this.isMuted) {
        this.successMusic.play();
      }
    } else {
      this.endScreenLose.style.display = "block";
      document.getElementById("highScores").appendChild(scoreList);
      this.endScreenLose.appendChild(scoreList);
      this.backgroundMusic.pause();
      if (!this.isMuted) {
        this.gameFailMusic.play();
      }
    }
  }

  handleHighScore() {
    if (this.highScores) {
      const newScores = [
        ...this.highScores,
        { name: this.name, score: this.score },
      ];
      newScores.sort((a, b) => b.score - a.score);
      const newLocalScores = newScores.slice(0, 11);
      localStorage.setItem("highScores", JSON.stringify(newLocalScores));
      this.highScores = JSON.parse(localStorage.getItem("highScores"));
    } else {
      const newScore = [{ name: this.name, score: this.score }];
      localStorage.setItem("highScores", JSON.stringify(newScore));
    }
  }

  handleVolumeChange(newVolume) {
    this.volume = newVolume;
    this.backgroundMusic.volume = newVolume;
    this.successMusic.volume = newVolume;
    this.gameFailMusic.volume = newVolume;
    this.dyingSound.volume = newVolume;
  }
}
