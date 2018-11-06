import { extend, nodeOrNew, register } from '../utils/adopter.js'
import { registerMethods } from '../utils/methods.js'
import Shape from './Shape.js'
import * as circled from '../modules/core/circled.js'

export default class Ellipse extends Shape {
  constructor (node) {
    super(nodeOrNew('ellipse', node), Ellipse)
  }
}

extend(Ellipse, circled)

registerMethods('Container', {
  // Create an ellipse
  ellipse: function (width, height) {
    return this.put(new Ellipse()).size(width, height).move(0, 0)
  }
})

register(Ellipse)
