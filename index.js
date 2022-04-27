const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

//context.fillStyle = '#525252'
context.fillRect(0, 0, canvas.width, canvas.height)

const image = new Image()
image.src = './images/LoneyTown.png'

image.onload = () => {
    context.drawImage(image, -450, -600)
}