const canvas = document.querySelector('canvas') //grab refrences to canvas
const c = canvas.getContext('2d')

canvas.width = 1024 //size of gamescreen
canvas.height = 576

const scaledCanvas = {
  width: canvas.width / 4, //scaled gamescreen for sprite drawing
  height: canvas.height / 4,
}

const floorCollisions2D = []
for (let i = 0; i < floorCollisions.length; i += 36) {
  floorCollisions2D.push(floorCollisions.slice(i, i + 36)) //loop through collisions made in map
}

const collisionBlocks = []
floorCollisions2D.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol === 202) {
      collisionBlocks.push(
        new CollisionBlock({ //create collision objects for each in map
          position: {
            x: x * 16,
            y: y * 16,
          },
        })
      )
    }
  })
})

const platformCollisions2D = []
for (let i = 0; i < platformCollisions.length; i += 36) {
  platformCollisions2D.push(platformCollisions.slice(i, i + 36)) //create slices
}

const platformCollisionBlocks = []
platformCollisions2D.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol === 202) {
      platformCollisionBlocks.push( //platform handler
        new CollisionBlock({
          position: {
            x: x * 16,
            y: y * 16,
          },
          height: 4,
        })
      )
    }
  })
})

const gravity = 0.1 //set gravity constant

const player = new Player({
  position: {
    x: 100,
    y: 300,
  },
  collisionBlocks,
  platformCollisionBlocks,
  imageSrc: './img/warrior/Idle.png', //load and set animations with their params
  frameRate: 8,
  animations: {
    Idle: {
      imageSrc: './img/warrior/Idle.png',
      frameRate: 8,
      frameBuffer: 3,
    },
    Run: {
      imageSrc: './img/warrior/Run.png',
      frameRate: 8,
      frameBuffer: 5,
    },
    Jump: {
      imageSrc: './img/warrior/Jump.png',
      frameRate: 2,
      frameBuffer: 3,
    },
    Fall: {
      imageSrc: './img/warrior/Fall.png',
      frameRate: 2,
      frameBuffer: 3,
    },
    FallLeft: {
      imageSrc: './img/warrior/FallLeft.png',
      frameRate: 2,
      frameBuffer: 3,
    },
    RunLeft: {
      imageSrc: './img/warrior/RunLeft.png',
      frameRate: 8,
      frameBuffer: 5,
    },
    IdleLeft: {
      imageSrc: './img/warrior/IdleLeft.png',
      frameRate: 8,
      frameBuffer: 3,
    },
    JumpLeft: {
      imageSrc: './img/warrior/JumpLeft.png',
      frameRate: 2,
      frameBuffer: 3,
    },
  },
})

const keys = {
  left: {
    pressed: false, //set keys that we need to check
  },
  right: {
    pressed: false,
  },
}

const background = new Sprite({ //load background sprite
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: './img/background.png',
})

const backgroundImageHeight = 432 //set scaled background height

const camera = {
  position: {
    x: 0,
    y: -backgroundImageHeight + scaledCanvas.height, //set camera on scene
  },
}

function animate() {
  window.requestAnimationFrame(animate) //game loop
  c.fillStyle = 'white'
  c.fillRect(0, 0, canvas.width, canvas.height) //clear canvas for each loop

  c.save()
  c.scale(4, 4)
  c.translate(camera.position.x, camera.position.y) //scale canvas then move to camera pos
  background.update()
  // collisionBlocks.forEach((collisionBlock) => {
  //   collisionBlock.update()
  // })

  // platformCollisionBlocks.forEach((block) => {
  //   block.update()
  // })

  player.checkForHorizontalCanvasCollision()
  player.update()

  player.velocity.x = 0
  if (keys.right.pressed) {
    player.switchSprite('Run') //change animation set previous key checks
    player.velocity.x = 2
    player.lastDirection = 'right'
    player.shouldPanCameraToTheLeft({ canvas, camera })
  } else if (keys.left.pressed) {
    player.switchSprite('RunLeft')
    player.velocity.x = -2
    player.lastDirection = 'left'
    player.shouldPanCameraToTheRight({ canvas, camera })
  } else if (player.velocity.y === 0) {
    if (player.lastDirection === 'right') player.switchSprite('Idle')
    else player.switchSprite('IdleLeft')
  }//of if idle chack

  if (player.velocity.y < 0) { // if jumping
    player.shouldPanCameraDown({ camera, canvas })
    if (player.lastDirection === 'right') player.switchSprite('Jump')
    else player.switchSprite('JumpLeft')
  } else if (player.velocity.y > 0) {//if falling
    player.shouldPanCameraUp({ camera, canvas })
    if (player.lastDirection === 'right') player.switchSprite('Fall') //animation checks
    else player.switchSprite('FallLeft')
  }

  c.restore() //restored non-scaled context
}

animate()

//key listener events
window.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'ArrowLeft'://left arrow = left
      keys.left.pressed = true
      break
    case 'ArrowRight': // right arrow = right
      keys.right.pressed = true
      break
    case ' '://spacebar == jump
      if(player.velocity.y === 0){ //prevents spam flying
        player.velocity.y = -4
      }
      break
  }
})

window.addEventListener('keyup', (event) => {
  switch (event.key) { //if keyup dont add vel
    case 'ArrowLeft':
      keys.left.pressed = false
      break
    case 'ArrowRight':
      keys.right.pressed = false
      break
  }
})
