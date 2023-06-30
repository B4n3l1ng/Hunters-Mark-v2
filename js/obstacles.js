class Obstacle {
  constructor(gameScreen) {
    this.gameScreen = gameScreen;
    this.width = 100;
    this.height = 120;
    this.left = 1000 - this.width;
    this.top = Math.floor(Math.random() * (800 - this.height - 10));
    console.log(this.top);

    this.images = [
      "./assets/images/goblin final.png",
      "./assets/images/ogre final.png",
      "./assets/images/orc final.png",
    ];
    this.element = document.createElement("img");
    this.index = Math.floor(Math.random() * (this.images.length - 1 + 1));
    this.element.src = this.images[this.index];

    this.element.style.position = "absolute";
    this.element.style.left = `${this.left}px`;
    this.element.style.top = `${this.top}px`;
    this.element.style.width = `${this.width}px`;
    this.element.style.height = `${this.height}px`;
    this.gameScreen.appendChild(this.element);
  }

  move() {
    this.left -= 3;

    this.updatePosition();
  }

  updatePosition() {
    this.element.style.left = `${this.left}px`;
    this.element.style.top = `${this.top}px`;
  }
}
