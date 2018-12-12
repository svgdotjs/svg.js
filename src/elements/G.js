import { nodeOrNew, register, wrapWithAttrCheck } from '../utils/adopter.js'
import { proportionalSize } from '../utils/utils.js'
import { registerMethods } from '../utils/methods.js'
import Container from './Container.js'
import SVGNumber from '../types/SVGNumber.js'

export default class G extends Container {
  constructor (node) {
    super(nodeOrNew('g', node), node)
  }

  x (x, box = this.bbox()) {
    if (x == null) return box.x

    this.children().dx(x - box.x)
    return this
  }

  y (y, box = this.bbox()) {
    if (y == null) return box.y

    this.children().dy(y - box.y)
    return this
  }

  move (x, y) {
    const box = this.bbox()
    return this.x(x, box).y(y, box)
  }

  dx (dx) {
    return this.children().dx(dx)
  }

  dy (dy) {
    return this.children().dy(dy)
  }

  width (width, box = this.bbox()) {
    if (width == null) return box.width

    const scale = width / box.width

    this.each(function () {
      const _width = this.width()
      const _x = this.x()

      this.width(_width * scale)
      this.x((_x - box.x) * scale + box.x)
    })

    return this
  }

  height (height, box = this.bbox()) {
    if (height == null) return box.height

    const scale = height / box.height

    this.each(function () {
      const _height = this.height()
      const _y = this.y()

      this.height(_height * scale)
      this.y((_y - box.y) * scale + box.y)
    })

    return this
  }

  size (width, height) {
    const box = this.bbox()
    const p = proportionalSize(this, width, height, box)

    return this
      .width(new SVGNumber(p.width), box)
      .height(new SVGNumber(p.height), box)
  }
}

registerMethods({
  Element: {
    // Create a group element
    group: wrapWithAttrCheck(function () {
      return this.put(new G())
    })
  }
})

register(G)
