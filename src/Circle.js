import SVGNumber from './SVGNumber.js'
import Parent from './Parent.js'
import {x, y, cx, cy, width, height, size} from './circled.js'

export default class Circle extends Shape {
  constructor (node) {
    super(nodeOrNew('circle', node))
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

extend(Circle, {x, y, cx, cy, width, height, size})

addFactory(Parent, {
  // Create circle element
  circle (size) {
    return this.put(new Circle())
      .radius(new SVGNumber(size).divide(2))
      .move(0, 0)
  }
})
