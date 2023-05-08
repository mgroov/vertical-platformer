class Player extends Sprite {
  constructor({
    position, //x,y
    collisionBlocks, //solid blocks
    platformCollisionBlocks, // jump through blocks
    imageSrc, //animation source
    frameRate, //animation frame rate
    scale = 0.5, //scaling factor
    animations, // list of all animations
  }) {
    super({ imageSrc, frameRate, scale }) //call sprite and pass the information
    this.position = position
    this.velocity = {
      x: 0,
      y: 1,
    }

    this.collisionBlocks = collisionBlocks
    this.platformCollisionBlocks = platformCollisionBlocks
    this.hitbox = {
      position: {
        x: this.position.x, //create hitbox for collision
        y: this.position.y,
      },
      width: 10,
      height: 10,
    }

    this.animations = animations
    this.lastDirection = 'right'

    for (let key in this.animations) {
      const image = new Image()
      image.src = this.animations[key].imageSrc //load all the images for animaations once

      this.animations[key].image = image
    }

    this.camerabox = {
      position: {
        x: this.position.x,
        y: this.position.y, //create camerabox
      },
      width: 200,
      height: 80,
    }
  }

  //helper function that switches animations and subsequent info
  switchSprite(key) {
    if (this.image === this.animations[key].image || !this.loaded) return

    this.currentFrame = 0
    this.image = this.animations[key].image
    this.frameBuffer = this.animations[key].frameBuffer
    this.frameRate = this.animations[key].frameRate
  }

  //update pos of camerabox
  updateCamerabox() {
    this.camerabox = {
      position: {
        x: this.position.x - 50,
        y: this.position.y,
      },
      width: 200,
      height: 80,
    }
  }

  //check for x axis collisions
  checkForHorizontalCanvasCollision() {
    if (
      this.hitbox.position.x + this.hitbox.width + this.velocity.x >= 576 ||
      this.hitbox.position.x + this.velocity.x <= 0
    ) {
      this.velocity.x = 0
    }
  }

  //helper function that determines if we should move camera box
  shouldPanCameraToTheLeft({ canvas, camera }) {
    const cameraboxRightSide = this.camerabox.position.x + this.camerabox.width
    const scaledDownCanvasWidth = canvas.width / 4

    if (cameraboxRightSide >= 576) return

    if (
      cameraboxRightSide >=
      scaledDownCanvasWidth + Math.abs(camera.position.x)
    ) {
      camera.position.x -= this.velocity.x
    }
  }

  //helper function that determines if we should move camera box to the right
  shouldPanCameraToTheRight({ canvas, camera }) {
    if (this.camerabox.position.x <= 0) return

    if (this.camerabox.position.x <= Math.abs(camera.position.x)) {
      camera.position.x -= this.velocity.x
    }
  }

  //helper function that determines if we should move camera box down
  shouldPanCameraDown({ canvas, camera }) {
    if (this.camerabox.position.y + this.velocity.y <= 0) return

    if (this.camerabox.position.y <= Math.abs(camera.position.y)) {
      camera.position.y -= this.velocity.y
    }
  }

  //helper function that determines if we should move camera box up
  shouldPanCameraUp({ canvas, camera }) {
    if (
      this.camerabox.position.y + this.camerabox.height + this.velocity.y >=
      432
    )
      return

    const scaledCanvasHeight = canvas.height / 4

    if (
      this.camerabox.position.y + this.camerabox.height >=
      Math.abs(camera.position.y) + scaledCanvasHeight
    ) {
      camera.position.y -= this.velocity.y
    }
  }

  //calls all the updates at once from animation loop
  update() {
    this.updateFrames()
    this.updateHitbox()

    this.updateCamerabox()
    // c.fillStyle = 'rgba(0, 0, 255, 0.2)'
    // c.fillRect(
    //   this.camerabox.position.x,
    //   this.camerabox.position.y,
    //   this.camerabox.width,
    //   this.camerabox.height
    // )

    // draws out the image
    // c.fillStyle = 'rgba(0, 255, 0, 0.2)'
    // c.fillRect(this.position.x, this.position.y, this.width, this.height)

    // c.fillStyle = 'rgba(255, 0, 0, 0.2)'
    // c.fillRect(
    //   this.hitbox.position.x,
    //   this.hitbox.position.y,
    //   this.hitbox.width,
    //   this.hitbox.height
    // )

    this.draw() //calls the sprite draw

    this.position.x += this.velocity.x //updates x we rely on gravity call to update y
    this.updateHitbox()
    this.checkForHorizontalCollisions() // we do this first because y collisions are almost always expected
    this.applyGravity()
    this.updateHitbox()
    this.checkForVerticalCollisions()
  }

  //uodate x and y of hitbox
  updateHitbox() {
    this.hitbox = {
      position: {
        x: this.position.x + 35,
        y: this.position.y + 26,
      },
      width: 14,
      height: 27,
    }
  }

  //helper function that checks horizontal collisions
  checkForHorizontalCollisions() {
    for (let i = 0; i < this.collisionBlocks.length; i++) {
      const collisionBlock = this.collisionBlocks[i] //loops and grabs collision blocks 1 by 1

      if (
        collision({
          object1: this.hitbox,
          object2: collisionBlock,
        })
      ) {
        if (this.velocity.x > 0) {
          this.velocity.x = 0

          const offset =
            this.hitbox.position.x - this.position.x + this.hitbox.width

          this.position.x = collisionBlock.position.x - offset - 0.01
          break
        }

        if (this.velocity.x < 0) {
          this.velocity.x = 0

          const offset = this.hitbox.position.x - this.position.x

          this.position.x =
            collisionBlock.position.x + collisionBlock.width - offset + 0.01
          break
        }
      }
    }
  }

  //applies gravity and updates y pos
  applyGravity() {
    this.velocity.y += gravity
    this.position.y += this.velocity.y
  }

  //helper function that checks y collisions
  checkForVerticalCollisions() {
    for (let i = 0; i < this.collisionBlocks.length; i++) {
      const collisionBlock = this.collisionBlocks[i]

      if (
        collision({
          object1: this.hitbox,
          object2: collisionBlock,
        })
      ) {
        if (this.velocity.y > 0) {
          this.velocity.y = 0

          const offset =
            this.hitbox.position.y - this.position.y + this.hitbox.height

          this.position.y = collisionBlock.position.y - offset - 0.01
          break
        }

        if (this.velocity.y < 0) {
          this.velocity.y = 0

          const offset = this.hitbox.position.y - this.position.y

          this.position.y =
            collisionBlock.position.y + collisionBlock.height - offset + 0.01
          break
        }
      }
    }

    // platform collision blocks
    for (let i = 0; i < this.platformCollisionBlocks.length; i++) {
      const platformCollisionBlock = this.platformCollisionBlocks[i]

      if (
        platformCollision({
          object1: this.hitbox,
          object2: platformCollisionBlock,
        })
      ) {
        if (this.velocity.y > 0) {
          this.velocity.y = 0

          const offset =
            this.hitbox.position.y - this.position.y + this.hitbox.height

          this.position.y = platformCollisionBlock.position.y - offset - 0.01
          break
        }
      }
    }
  }
}
