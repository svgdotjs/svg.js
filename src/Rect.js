import Shape from './Shape.js'
import { nodeOrNew } from './tools.js'
import { register } from './adopter.js'
import { registerMethods } from './methods.js'

export default class Rect extends Shape {
  // Initialize node
  constructor (node) {
    super(nodeOrNew('rect', node), Rect)
  }

  // FIXME: unify with circle
  // Radius x value
  rx (rx) {
    return this.attr('rx', rx)
  }

  // Radius y value
  ry (ry) {
    return this.attr('ry', ry)
  }
}

registerMethods({
  Container: {
    // Create a rect element
    rect (width, height) {
      return this.put(new Rect()).size(width, height)
    }
  }
})

register(Rect)
