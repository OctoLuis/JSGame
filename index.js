const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

const collisionMap = []
for (let i = 0; i < collisions.length; i += 70) {
    collisionMap.push(collisions.slice(i, i + 70))
}

const battleFieldMap = []
for (let i = 0; i < battleFieldData.length; i += 70) {
    battleFieldMap.push(battleFieldData.slice(i, i + 70))
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

const battleField = []
battleFieldMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 1025) {
            battleField.push(
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
const playerImageDown = new Image()
const playerImageUp = new Image()
const playerImageLeft = new Image()
const playerImageRight = new Image()
const foregroundImage = new Image()
image.src = './images/LoneyTown.png'
playerImageDown.src = './images/playerDown.png'
playerImageUp.src = './images/playerUp.png'
playerImageLeft.src = './images/playerLeft.png'
playerImageRight.src = './images/playerRight.png'
foregroundImage.src='./images/LoneyTownForeground.png'

const player = new Sprite({
    position: {
        x: canvas.width/2 - 192/4/2,
        y: canvas.height/2 - 68/2,
    },
    image: playerImageDown,
    frames: {
        max: 4,
        hold: 10
    },
    sprites: {
        up: playerImageUp,
        down: playerImageDown,
        left: playerImageLeft,
        right: playerImageRight
    }
})

const background = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: image
})

const foreground = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: foregroundImage
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

const movables = [background, foreground, ...boundaries, ...battleField]

function rectangularCollision({rect1, rect2}) {
    return (
        rect1.position.x + rect1.width - 6 >= rect2.position.x &&
        rect1.position.x + 6 <= rect2.position.x + rect2.width &&
        rect1.position.y <= rect2.position.y + rect2.height/3 - 16 &&
        rect1.position.y + rect1.height >= rect2.position.y
    )
}

const battle = {
    initiated: false
}

// // Temporary:
// document.querySelector('#ui').style.display = 'none';

function animate() {
    const animeID = window.requestAnimationFrame(animate)
    // console.log(animeID)
    background.draw()
    boundaries.forEach(boundary => {
        boundary.draw()
    })
    battleField.forEach(field => {
        field.draw()
    })
    player.draw()
    foreground.draw()

    let moving = true
    player.animate = false

    if (battle.initiated) return

    // Activate Battle:
    if (keys.w.pressed||keys.a.pressed||keys.d.pressed||keys.s.pressed) {
        for (let i = 0; i < battleField.length; i++) {
            const field = battleField[i]
            const overlappingArea =
                ((Math.min(player.position.x + player.width, field.position.x + field.width)
                    - Math.max(player.position.x, field.position.x)) *
                (Math.min(player.position.y + player.height, field.position.y + field.height)
                    - Math.max(player.position.y, field.position.y)))
            if (rectangularCollision({rect1: player, rect2: field})
                && overlappingArea > (player.width*player.height)/3
                && Math.random() < 0.008
             ) {
                console.log('Activate Battle')

                // De-activate current animation loop
                window.cancelAnimationFrame(animeID)

                battle.initiated = true
                gsap.to('#overlapping-div', {
                    opacity: 1,
                    repeat: 3,
                    yoyo: true, // For smooth repeating animation
                    duration: 0.28,
                    onComplete() {
                        gsap.to('#overlapping-div', {
                            opacity: 1,
                            duration: 0.28,
                            onComplete() {
                                // Activate a new animation loop
                                animateBattle()
                                gsap.to('#overlapping-div', {
                                    opacity: 0,
                                    duration: 0.28
                                })
                            }
                        })
                    }
                })
                break
            }
        }
    }

    if (keys.w.pressed && lastKey === 'w') {
        player.animate = true
        player.image = player.sprites.up
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (rectangularCollision({
                rect1: player,
                rect2: {
                    ...boundary,
                    position: {
                        x: boundary.position.x,
                        y: boundary.position.y + 3
                    }
                }
            })) {
                moving = false
                console.log('colliding')
                break
            }
        }
        if (moving) {
            movables.forEach((movable) => {
                movable.position.y += 3
            })
        }
    } else if (keys.s.pressed && lastKey === 's') {
        player.animate = true
        player.image = player.sprites.down
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (rectangularCollision({
                rect1: player,
                rect2: {
                    ...boundary,
                    position: {
                        x: boundary.position.x,
                        y: boundary.position.y - 3
                    }
                }
            })) {
                moving = false
                console.log('colliding')
                break
            }
        }
        if (moving) {
            movables.forEach((movable) => {
                movable.position.y -= 3
            })
        }
    } else if (keys.a.pressed && lastKey === 'a') {
        player.animate = true
        player.image = player.sprites.left
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (rectangularCollision({
                rect1: player,
                rect2: {
                    ...boundary,
                    position: {
                        x: boundary.position.x + 3,
                        y: boundary.position.y
                    }
                }
            })) {
                moving = false
                console.log('colliding')
                break
            }
        }
        if (moving) {
            movables.forEach((movable) => {
                movable.position.x += 3
            })
        }
    } else if (keys.d.pressed && lastKey === 'd') {
        player.animate = true
        player.image = player.sprites.right
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (rectangularCollision({
                rect1: player,
                rect2: {
                    ...boundary,
                    position: {
                        x: boundary.position.x - 3,
                        y: boundary.position.y
                    }
                }
            })) {
                moving = false
                console.log('colliding')
                break
            }
        }
        if (moving) {
            movables.forEach((movable) => {
                movable.position.x -= 3
            })
        }
    }
}
// Start animating:
// animate()

const battleBG = new Image()
battleBG.src = './images/battleBackground.png'
const battleBGSprite = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    image: battleBG
})

const draggleImage = new Image()
draggleImage.src = "./images/draggleSprite.png"
const embyImage = new Image()
embyImage.src = "./images/embySprite.png"

const draggle = new Sprite({
    position: {
        x: 800,
        y: 100
    },
    image: draggleImage,
    frames: {
        max: 4,
        hold: 30
    },
    animate: true,
    isEnemy: true,
})

const emby = new Sprite({
    position: {
        x: 280,
        y: 325
    },
    image: embyImage,
    frames: {
        max: 4,
        hold: 30
    },
    animate: true,
    isEnemy: false,
})

function animateBattle() {
    window.requestAnimationFrame(animateBattle)
    // console.log('battling animation')
    battleBGSprite.draw()
    draggle.draw()
    emby.draw()
}
animateBattle()

document.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', () => {
        // console.log('clicked')
        emby.attack({
            attack: {
                name: 'Tackle',
                damage: 10,
                type: 'Normal'
            },
            recipient: draggle
        })
    })
})

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
