import Shape from './Shape.js'
import { nodeOrNew, extend } from './tools.js'
import { x, y, cx, cy, width, height, size } from './circled.js'
import SVGNumber from './SVGNumber.js'
import { register } from './adopter.js'
import { registerMethods } from './methods.js'

export default class Circle extends Shape {
  constructor (node) {
    super(nodeOrNew('circle', node), Circle)
  }

  radius (r) {
    return this.attr('r', r)
  }

  // Radius x value
  rx (rx) {
    return this.attr('r', rx)
  }

  // Alias radius x value
  ry (ry) {
    return this.rx(ry)
  }
}

extend(Circle, { x, y, cx, cy, width, height, size })

registerMethods({
  Element: {
    // Create circle element
    circle (size) {
      return this.put(new Circle())
        .radius(new SVGNumber(size).divide(2))
        .move(0, 0)
    }
  }
})

register(Circle)
