class Sprite {
  constructor({ //this class handles the drawing and animation frameworks
    position,
    imageSrc,
    frameRate = 1,
    frameBuffer = 3,
    scale = 1,
  }) {
    this.position = position
    this.scale = scale
    this.loaded = false
    this.image = new Image()
    this.image.onload = () => { //wait for image to load to handle assignments
      this.width = (this.image.width / this.frameRate) * this.scale
      this.height = this.image.height * this.scale
      this.loaded = true
    }
    this.image.src = imageSrc
    this.frameRate = frameRate
    this.currentFrame = 0
    this.frameBuffer = frameBuffer
    this.elapsedFrames = 0
  }

  draw() {
    if (!this.image) return //if image is not loaded return

    const cropbox = {
      position: {
        x: this.currentFrame * (this.image.width / this.frameRate), //where to crop on the spritesheet
        y: 0,
      },
      width: this.image.width / this.frameRate,
      height: this.image.height,
    }

    c.drawImage(
      this.image,
      cropbox.position.x,
      cropbox.position.y,
      cropbox.width,
      cropbox.height,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    ) //calling canvas draw with all the required info
  }

  update() {
    this.draw()
    this.updateFrames()
  }

  //helper function that manages how fast we move in the sprite sheets
  updateFrames() {
    this.elapsedFrames++

    if (this.elapsedFrames % this.frameBuffer === 0) {
      if (this.currentFrame < this.frameRate - 1) this.currentFrame++
      else this.currentFrame = 0
    }
  }
}
