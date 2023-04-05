import './style.css'
import unsplashImages from './unsplash.json'
import {Fireworks} from 'fireworks-js'

type RotationDirection = 'left' | 'right'

const fireworksContainer = document.querySelector<HTMLDivElement>('#fireworks')!
const fireworks = new Fireworks(fireworksContainer, { /* options */})

async function digestMessage(length: number, imageId: string) {
  const date = new Date().toISOString().substring(0, 10)
  const data = new TextEncoder().encode(date + imageId);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = new Uint8Array(hashBuffer);
  return hashArray.map((b) => Math.floor(b % 3) + 1).slice(0, length);
}

let finished = false;
const image = unsplashImages[new Date().getHours()]
const width = Number.parseInt(window.getComputedStyle(document.documentElement).getPropertyValue("--width"))
const height = Number.parseInt(window.getComputedStyle(document.documentElement).getPropertyValue("--height"))
let rotations = new Uint8Array()

setupImages(document.querySelector<HTMLDivElement>('#images')!)

function setupImages(container: HTMLDivElement) {
  let rotationDirection: RotationDirection = 'right';

  digestMessage(width * height, image.id).then(r => {
    rotations = r;
    for (let i = 0; i < width * height; i++) {
      const column = (i % width);
      const row = Math.floor(i / width);

      const tile = document.createElement('div')
      tile.className = 'tile'
      tile.style.backgroundImage = `url(${image.url})`
      tile.style.backgroundPosition = `calc(${-column} * var(--tile-size)) calc(${-row} * var(--tile-size))`
      tile.style.transform = `rotate(calc(${rotations[i]} *90deg))`
      tile.addEventListener('click', () => {
        rotationDirection === 'left' ? rotateLeft(i) : rotateRight(i)
        tile.style.transform = `rotate(calc(${rotations[i]} *90deg))`
        checkWin()
      })
      container.appendChild(tile)
    }
  })
}

function rotateRight(index: number) {
  if (!finished) {
    rotations[index]++
  }
}

function rotateLeft(index: number) {
  if (!finished) {
    rotations[index]--
  }
}

function checkWin() {
  if (!finished && rotations.every(r => r % 4 === 0)) {
    finished = true;
    fireworksContainer.style.zIndex = '1000'
    fireworks.start()
    setTimeout(function () {
      fireworks.waitStop(true).then(() => {
        fireworksContainer.style.zIndex = '-1'
      })
    }, 2000)
  }
}