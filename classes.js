class Sprite {
    constructor({position, velocity, image, frames={max: 1, hold: 30}, sprites, animate=false, isEnemy=false}) {
        this.position = position
        this.image = image
        this.frames = {...frames, val: 0, elapsed: 0}
        this.image.onload = () => {
            this.width = this.image.width / this.frames.max
            this.height = this.image.height
        }
        this.animate = animate
        this.sprites = sprites
        this.opacity = 1
        this.health = 100
        this.isEnemy = isEnemy
    }
    draw() {
        context.save()
        context.globalAlpha = this.opacity
        context.drawImage(
            this.image,
            this.frames.val * this.width,
            0,
            this.image.width/this.frames.max,
            this.image.height,
            this.position.x,
            this.position.y,
            this.image.width/this.frames.max,
            this.image.height
        )
        if (this.animate) {
            if (this.frames.max > 1) {
                this.frames.elapsed++
            }
            if (this.frames.elapsed % this.frames.hold === 0) {
                if (this.frames.val < this.frames.max - 1) this.frames.val++
                else this.frames.val = 0
            }
        }
        context.restore()

    }

    attack({attack, recipient}) {
        const tl = gsap.timeline()
        this.health -= attack.damage
        let movementDistance_x = 20;
        let movementDistance_y = 10;
        let health_bar = '#enemy-health-bar'
        if (this.isEnemy) {
             movementDistance_x = -20;
             movementDistance_y = -10;
             health_bar = '#player-health-bar'
        }
        tl.to(this.position, {
            x: this.position.x - movementDistance_x,
            y: this.position.y + movementDistance_y,
        }).to(this.position, {
            x: this.position.x + movementDistance_x*2,
            y: this.position.y - movementDistance_y*2,
            duration: 0.1,
            onComplete: () => {
                // Enemy got hit:
                gsap.to(health_bar, {
                    width: this.health + '%',
                })
                gsap.to(recipient.position, {
                    x: recipient.position.x + 3*movementDistance_x/4,
                    y: recipient.position.y - movementDistance_y,
                    yoyo: true,
                    repeat: 3,
                    duration: 0.08,
                })
                gsap.to(recipient, {
                    opacity: 0,
                    repeat: 3,
                    yoyo: true,
                    duration: 0.08
                })
            }
        }).to(this.position, {
            x: this.position.x,
            y: this.position.y,
        })
    }
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
        context.fillStyle = 'rgba(255, 0, 0, 0.0)'
        context.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}