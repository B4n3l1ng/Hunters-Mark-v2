class Player {
  constructor(gameScreen) {
    this.gameScreen = gameScreen;
    this.width = 100;
    this.height = 120;
    this.top = 370;
    this.left = 65;
    this.directionY = 0;
    this.isShooting = false;
    this.shootingSound = new Audio("./assets/audio/Arrow Shot.wav");

    this.element = document.createElement("img");
    this.element.src = "./assets/images/player.png";
    this.element.style.position = "absolute";
    this.element.style.width = `${this.width}px`;
    this.element.style.height = `${this.height}px`;
    this.element.style.top = `${this.top}px`;
    this.element.style.left = `${this.left}px`;

    this.gameScreen.appendChild(this.element);
  }

  move() {
    this.top += this.directionY;
    if (this.top < 10) {
      this.top = 10;
    }
    if (this.top > this.gameScreen.offsetHeight - this.height - 10) {
      this.top = this.gameScreen.offsetHeight - this.height - 10;
    }
    this.updatePosition();
  }

  updatePosition() {
    this.element.style.top = `${this.top}px`;
  }

  shoot() {
    this.shootingSound.play();
  }
}
