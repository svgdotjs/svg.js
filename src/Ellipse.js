import Shape from './Shape.js'
import * as circled from './circled.js'
import { extend, nodeOrNew } from './tools.js'
import { register } from './adopter.js'
import { registerMethods } from './methods.js'

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
