import { nodeOrNew, register, wrapWithAttrCheck } from '../utils/adopter.js'
import { proportionalSize } from '../utils/utils.js'
import { registerMethods } from '../utils/methods.js'
import Container from './Container.js'
import Matrix from '../types/Matrix.js'
import Point from '../types/Point.js'

export default class G extends Container {
  constructor (node) {
    super(nodeOrNew('g', node), node)
  }

  x (x, box = this.bbox()) {
    if (x == null) return box.x
    return this.move(x, box.y, box)
  }

  y (y, box = this.bbox()) {
    if (y == null) return box.y
    return this.move(box.x, y, box)
  }

  move (x = 0, y = 0, box = this.bbox()) {
    const dx = x - box.x
    const dy = y - box.y

    return this.dmove(dx, dy)
  }

  dx (dx) {
    return this.dmove(dx, 0)
  }

  dy (dy) {
    return this.dmove(0, dy)
  }

  dmove (dx, dy) {
    this.children().forEach((child, i) => {
      // Get the childs bbox
      const bbox = child.bbox()
      // Get childs matrix
      const m = new Matrix(child)
      // Translate childs matrix by amount and
      // transform it back into parents space
      const matrix = m.translate(dx, dy).transform(m.inverse())
      // Calculate new x and y from old box
      const p = new Point(bbox.x, bbox.y).transform(matrix)
      // Move element
      child.move(p.x, p.y)
    })

    return this
  }

  width (width, box = this.bbox()) {
    if (width == null) return box.width
    return this.size(width, box.height, box)
  }

  height (height, box = this.bbox()) {
    if (height == null) return box.height
    return this.size(box.width, height, box)
  }

  size (width, height, box = this.bbox()) {
    const p = proportionalSize(this, width, height, box)
    const scaleX = p.width / box.width
    const scaleY = p.height / box.height

    this.children().forEach((child, i) => {
      const o = new Point(box).transform(new Matrix(child).inverse())
      child.scale(scaleX, scaleY, o.x, o.y)
    })

    return this
  }
}

registerMethods({
  Container: {
    // Create a group element
    group: wrapWithAttrCheck(function () {
      return this.put(new G())
    })
  }
})

register(G, 'G')
