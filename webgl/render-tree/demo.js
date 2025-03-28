import {
  Size,
  Offset,
  RenderBox,
  BoxConstraint,
  SingleChildRenderBox,
  BlockRenderBox,
  randomColor,
} from './lib.js'

function main() {
  /**
   * @type HTMLCanvasElement
   */
  const canvas = document.getElementById('canvas')
  if (!canvas) {
    alert('canvas not found')
  }

  const rootContainer = new BoxConstraint(0, window.innerWidth, 0, 1000)
  canvas.width = rootContainer.maxWidth
  canvas.height = rootContainer.maxHeight
  canvas.style.width = rootContainer.maxWidth
  canvas.style.height = rootContainer.maxHeight

  const context = canvas.getContext('2d')

  const offset = new Offset(150, 100)
  const size = new Size(400, 800)
  const root = new BlockRenderBox(context, size)
  root.offset = offset
  root.setColor('green')

  const child1 = new SingleChildRenderBox(context, new Size(200, 300))
  child1.setColor('blue')

  const child2 = new SingleChildRenderBox(context, new Size(100, 400))
  child2.setColor('red')

  root.setChildren([child1, child2])

  const largeContainer = rootContainer

  const paintLoop = () => {
    paintOneFrame()
    requestAnimationFrame(paintLoop)
  }

  const paintOneFrame = () => {
    root.layout(largeContainer)

    // root.setColor(randomColor())
    // child1.setColor(randomColor())
    // child2.setColor(randomColor())
    root.paint()
  }

  const bindEvents = () => {
    window.addEventListener('keypress', (e) => {
      console.log('e: ', e)
      if (e.key === '+') {
        child1.setPreferredHeight(child1.preferredSize.height + 10)
      } else if (e.key === '-') {
        child1.setPreferredHeight(child1.preferredSize.height - 10)
      }
    })

    window.addEventListener('click', (e) => {
      const offset = new Offset(e.offsetX, e.offsetY)

      const box = root.hitTest(offset.subtract(root.offset))
      box.setPreferredHeight(box.preferredSize.height + 10)
      box.setColor(randomColor())
    })
  }
  bindEvents()

  paintLoop()
}

main()
