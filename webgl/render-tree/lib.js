export class Size {
  constructor(width, height) {
    this.width = width
    this.height = height
  }
}

export function clamp(val, min, max) {
  if (val < min) {
    return min
  }
  if (val > max) {
    return max
  }
  return val
}

export class BoxConstraint {
  constructor(minWidth, maxWidth, minHeight, maxHeight) {
    this.minWidth = minWidth
    this.maxWidth = maxWidth
    this.minHeight = minHeight
    this.maxHeight = maxHeight
  }

  min() {
    return new Size(this.minWidth, this.minHeight)
  }

  max() {
    return new Size(this.maxWidth, this.maxHeight)
  }

  constrain(size) {
    return new Size(
      clamp(size.width, this.minWidth, this.maxWidth),
      clamp(size.height, this.minHeight, this.maxHeight)
    )
  }
}

export class Offset {
  constructor(dx, dy) {
    this.dx = dx
    this.dy = dy
  }

  clone() {
    return new Offset(this.dx, this.dy)
  }

  add(other) {
    return new Offset(this.dx + other.dx, this.dy + other.dy)
  }

  subtract(other) {
    return new Offset(this.dx - other.dx, this.dy - other.dy)
  }
}

export const OffsetOrigin = () => new Offset(0, 0)

export class BoxRect {
  constructor(offset, size) {
    this.offset = offset
    this.size = size
  }
}

export class RenderBox {
  /**
   * @param {CanvasRenderingContext2D} context
   */
  constructor(context, preferredSize) {
    this.context = context
    this.preferredSize = preferredSize
    this.offset = OffsetOrigin()
    this.color = 'green'
    this.size = new Size(0, 0)

    this.needsLayout = true
    // this.needsPaint = true
  }

  markNeedsLayout() {
    if (this.needsLayout) {
      return
    }
    this.needsLayout = true

    this.parent?.markNeedsLayout()
  }

  clearNeedsLayout() {
    this.needsLayout = false
  }

  hitTest(offset) {
    if (
      offset.dx >= 0 &&
      offset.dx < this.size.width &&
      offset.dy >= 0 &&
      offset.dy < this.size.height
    ) {
      return this
    }

    return null
  }

  //   markNeedsPaint() {
  //     this.needsPaint = true
  //   }

  //   clearNeedsPaint() {
  //     this.needsPaint = false
  //   }

  setPreferredHeight(height) {
    if (this.preferredSize.height === height) {
      return
    }
    this.markNeedsLayout()
    this.preferredSize.height = height
  }

  /**
   * @param {BoxConstraint} constraint
   */
  layout(constraint) {
    if (!this.needsLayout) {
      return
    }

    this.size = constraint.constrain(this.preferredSize)

    // console.log('box size: ', this.size)
    // this.markNeedsPaint()
    this.clearNeedsLayout()
  }

  setColor(color) {
    if (this.color === color) {
      return
    }
    this.color = color
    // this.markNeedsPaint()
  }

  paint() {
    // if (!this.needsPaint) {
    //   return
    // }

    const { offset, size } = this.boxRect()
    this.context.fillStyle = this.color
    this.context.fillRect(offset.dx, offset.dy, size.width, size.height)

    // this.clearNeedsPaint()
  }

  boxRect() {
    return new BoxRect(this.offset, this.size)
  }
}

export class SingleChildRenderBox extends RenderBox {
  constructor(context, preferredSize) {
    super(context, preferredSize)
  }

  setChild(child) {
    if (!child) {
      throw new Error('no child')
    }
    this.child = child
    child.parent = this
    // TODO: trigger layout
    this.markNeedsLayout()
  }

  hitTest(offset) {
    if (this.child) {
      const hit = this.child.hitTest(offset)
      if (hit) {
        return hit
      }
    }

    return super.hitTest(offset)
  }

  layout(constraint) {
    super.layout(constraint)
    if (this.child) {
      this.child.layout(constraint)
    }
  }

  boxRect() {
    const parentOffset = this.parent?.offset ?? OffsetOrigin()
    const offset = parentOffset.add(this.offset)
    return new BoxRect(offset, this.size)
  }

  paint() {
    super.paint()
    if (this.child) {
      this.child.paint()
    }
  }
}

export class BlockRenderBox extends RenderBox {
  constructor(context, preferredSize) {
    super(context, preferredSize)
  }

  setChildren(children) {
    this.children = children
    for (const child of children) {
      child.parent = this
    }
  }

  layout(constraint) {
    if (!this.needsLayout) {
      return
    }

    super.layout(constraint)
    const children = this.children || []

    let childConstraint = new BoxConstraint(
      0,
      this.size.width,
      0,
      this.size.height
    )
    let offset = OffsetOrigin()

    for (const child of children) {
      // click first and second child interchangeably,
      // TODO: trigger all children to relayout
      child.markNeedsLayout()
      child.layout(childConstraint)
      child.offset = offset.clone()
      offset.dy += child.size.height

      childConstraint.maxHeight = this.size.height - child.size.height
    }
  }

  hitTest(offset) {
    let childOffset = offset.clone()
    for (const child of this.children) {
      const hit = child.hitTest(childOffset)
      if (hit) {
        return hit
      }

      childOffset = childOffset.subtract(new Offset(0, child.size.height))
    }

    return super.hitTest(offset)
  }

  boxRect() {
    const parentOffset = this.parent?.offset ?? new Offset(0, 0)
    const offset = parentOffset.add(this.offset)
    return new BoxRect(offset, this.size)
  }

  paint() {
    // if (!this.needsPaint) {
    //   return
    // }

    super.paint()
    const children = this.children || []
    for (const child of children) {
      child.paint()
    }
  }
}

export function randomColor() {
  const red = Math.floor(Math.random() * 255)
  const blue = Math.floor(Math.random() * 255)
  const green = Math.floor(Math.random() * 255)

  return `rgb(${red}, ${blue}, ${green})`
}

function fitCanvasToWindow(devicePixelRatio) {
  let canvas = document.getElementById('display')
  let width = window.innerWidth
  let height = window.innerHeight
  canvas.width = width * devicePixelRatio
  canvas.height = height * devicePixelRatio
  canvas.style.width = width + 'px'
  canvas.style.height = height + 'px'
}
