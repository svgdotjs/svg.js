import { extend, nodeOrNew, register } from '../utils/adopter.js'
import { registerMethods } from '../utils/methods.js'
import { rx, ry } from '../modules/core/circled.js'
import Shape from './Shape.js'

export default class Rect extends Shape {
  // Initialize node
  constructor (node) {
    super(nodeOrNew('rect', node), node)
  }
}

extend(Rect, { rx, ry })

registerMethods({
  Container: {
    // Create a rect element
    rect (width, height) {
      return this.put(new Rect()).size(width, height)
    }
  }
})

register(Rect)
