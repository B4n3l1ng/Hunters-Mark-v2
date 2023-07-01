class Projectile {
  constructor(gameScreen, player) {
    this.player = player;
    this.gameScreen = gameScreen;
    this.width = 25;
    this.height = 15;
    this.top = this.player.top + this.player.height / 2;
    this.left = this.player.left + this.player.width;
    this.speed = 3;

    this.element = document.createElement("img");
    this.element.src = "./assets/images/arrow final.png";
    this.element.style.position = "absolute";
    this.element.style.width = `${this.width}px`;
    this.element.style.height = `${this.height}px`;
    this.element.style.top = `${this.top}px`;
    this.element.style.left = `${this.left}px`;

    this.gameScreen.appendChild(this.element);
  }
}
