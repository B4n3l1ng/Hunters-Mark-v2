class Arty {
  constructor(block, top) {
    this.artyImg = document.createElement("img");
    this.artyImg.src = "./assets/images/wolf final.png";
    this.artyImg.style.height = "100px";
    this.artyImg.style.width = "150px";
    this.artyImg.style.position = "absolute";
    this.artyImg.style.left = "0px";
    this.artyImg.style.top = `${top}px`;
    this.artyBlock = block;
    this.artyBlock.appendChild(this.artyImg);
  }
}
