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
    this.player = new Player(this.gameScreen);
    this.obstacles = [];
    this.projectiles = [];
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
    const projectilesToKeep = this.projectiles.map((element) => element);

    /* this.obstacles.forEach((obstacle) => {
      obstacle.move();
      if (this.player.didCollide(obstacle)) {
        console.log("Orc and player collision");
        obstacle.element.remove();
        this.lives--;
        document.getElementById("lives").innerText = this.lives;
      } else if (obstacle.left < 0 - obstacle.width) {
        console.log("Orc got to the end");
        this.lives--;
        document.getElementById("lives").innerText = this.lives;
      } else {
        obstaclesToKeep.push(obstacle);
      }
      this.projectiles.forEach((projectile) => {
        projectile.move();
        if (projectile.didCollide(obstacle)) {
          console.log("Orc and arrow collision");
          this.score++;
          projectile.element.remove();
          obstacle.element.remove();
          this.scoreHTML.innerText = this.score;
        } else if (projectile.left > this.width) {
          console.log("Arrow left screen");
          projectile.element.remove();
        } else {
          projectilesToKeep.push(projectile);
        }
      });
    });
    this.projectiles = projectilesToKeep;
    this.obstacles = obstaclesToKeep; */
    for (let i = 0; i < this.obstacles.length; i += 1) {
      let obstacle = this.obstacles[i];
      obstacle.move();
      if (this.player.didCollide(obstacle)) {
        obstacle.element.remove();
        this.lives -= 1;
        document.getElementById("lives").innerText = this.lives;
        this.obstacles.splice(i, 1);
        i--;
      } else if (obstacle.left < 0 - obstacle.width) {
        obstacle.element.remove();
        this.lives -= 1;
        document.getElementById("lives").innerText = this.lives;
        this.obstacles.splice(i, 1);
        i--;
      }
      this.projectiles.forEach((projectile, index) => {
        projectile.move();
        if (projectile.didCollide(obstacle)) {
          obstacle.element.remove();
          projectile.element.remove();
          this.score += 1;
          this.scoreHTML.innerText = this.score;
          projectilesToKeep.splice(index, 1);
          this.obstacles.splice(i, 1);
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

  shoot() {
    this.player.shoot();
    this.projectiles.push(new Projectile(this.gameScreen, this.player));
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
