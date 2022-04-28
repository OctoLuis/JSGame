const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

context.fillStyle = '#525252'
context.fillRect(0, 0, canvas.width, canvas.height)

const image = new Image()
const playerImage = new Image()
image.src = './images/LoneyTown.png'
playerImage.src = './images/playerDown.png'

class Sprite {
    constructor({position, velocity, image}) {
        this.position = position
        this.image = image
    }
    draw() {
        context.drawImage(this.image, this.position.x, this.position.y)
    }
}

const background = new Sprite({
    position: {
        x: -496,
        y: -640
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

function animate() {
    window.requestAnimationFrame(animate)
    background.draw()
    context.drawImage(
        playerImage,
        0,
        0,
        playerImage.width/4,
        playerImage.height,
        canvas.width/2 - (playerImage.width/4)/2,
        canvas.height/2 - playerImage.height/2,
        playerImage.width/4, playerImage.height
    )
    if (keys.w.pressed && lastKey === 'w') background.position.y += 3

    else if (keys.s.pressed && lastKey === 's') background.position.y -= 3

    else if (keys.a.pressed && lastKey === 'a') background.position.x += 3

    else if (keys.d.pressed && lastKey === 'd') background.position.x -= 3
}
animate()

let lastKey = ''

window.addEventListener('keydown', (keyboardEvent) => {
    console.log(keyboardEvent.key);
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
    console.log(keyboardEvent.key);
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
