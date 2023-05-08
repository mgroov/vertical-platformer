class CollisionBlock {
  constructor({ position, height = 16 }) { // collision block class generated off of map
    this.position = position
    this.width = 16
    this.height = height
  }

  draw() {
    c.fillStyle = 'rgba(255, 0, 0, 0.5)'
    c.fillRect(this.position.x, this.position.y, this.width, this.height)
  }

  update() {
    this.draw()
  }
}
