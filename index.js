const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

const collisionMap = []
for (let i = 0; i < collisions.length; i += 70) {
    collisionMap.push(collisions.slice(i, i + 70))
}

class Boundary {
    static tile_width = 48
    static tile_height = 48
    constructor({position}) {
        this.position = position
        this.width = 48
        this.height = 48
    }

    draw() {
        context.fillStyle = 'red'
        context.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}

const offset = {
    x: -496,
    y: -640
}

const boundaries = [];
collisionMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 1025) {
            boundaries.push(
                new Boundary({
                    position: {
                        x: j * Boundary.tile_width + offset.x,
                        y: i * Boundary.tile_height + offset.y
                    }
                })
            )
        }
    })
})

const image = new Image()
const playerImage = new Image()
image.src = './images/LoneyTown.png'
playerImage.src = './images/playerDown.png'

class Sprite {
    constructor({position, velocity, image, frames={max: 1}}) {
        this.position = position
        this.image = image
        this.frames = frames
        this.image.onload = () => {
            this.width = this.image.width / this.frames.max
            this.height = this.image.height
        }
    }
    draw() {
        context.drawImage(
            this.image,
            0,
            0,
            this.image.width/this.frames.max,
            this.image.height,
            this.position.x,
            this.position.y,
            this.image.width/this.frames.max,
            this.image.height
        )
    }
}

const player = new Sprite({
    position: {
        x: canvas.width/2 - 192/4/2,
        y: canvas.height/2 - 68/2,
    },
    image: playerImage,
    frames: {
        max: 4
    }
})

const background = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: image
})

const keys = {
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    }
}

const movables = [background, ...boundaries]

function rectangularCollision({rect1, rect2}) {
    return (
        rect1.position.x + rect1.width >= rect2.position.x &&
        rect1.position.x <= rect2.position.x + rect2.width &&
        rect1.position.y <= rect2.position.y + rect2.height &&
        rect1.position.y + rect1.height >= rect2.position.y
    )
}

function animate() {
    window.requestAnimationFrame(animate)
    background.draw()
    boundaries.forEach(boundary => {
        boundary.draw()
        if (rectangularCollision({
            rect1: player,
            rect2: boundary
        })) {
            console.log('colliding')
        }
    })

    player.draw()

    if (keys.w.pressed && lastKey === 'w') {
        movables.forEach((movable) => {
            movable.position.y += 3
        })
    } else if (keys.s.pressed && lastKey === 's') {
        movables.forEach((movable) => {
            movable.position.y -= 3
        })
    } else if (keys.a.pressed && lastKey === 'a') {
        movables.forEach((movable) => {
            movable.position.x += 3
        })
    } else if (keys.d.pressed && lastKey === 'd') {
        movables.forEach((movable) => {
            movable.position.x -= 3
        })
    }
}
animate()

let lastKey = ''

window.addEventListener('keydown', (keyboardEvent) => {
    // console.log(keyboardEvent.key);
    switch (keyboardEvent.key) {
        case 'a':
            keys.a.pressed = true
            lastKey = 'a'
            break
        case 's':
            keys.s.pressed = true
            lastKey = 's'
            break
        case 'd':
            keys.d.pressed = true
            lastKey = 'd'
            break
        case 'w':
            keys.w.pressed = true
            lastKey = 'w'
            break
    }
})

window.addEventListener('keyup', (keyboardEvent) => {
    // console.log(keyboardEvent.key);
    switch (keyboardEvent.key) {
        case 'a':
            keys.a.pressed = false
            break
        case 's':
            keys.s.pressed = false
            break
        case 'd':
            keys.d.pressed = false
            break
        case 'w':
            keys.w.pressed = false
            break
    }
})
