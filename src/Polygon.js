import Shape from './Shape.js'
import { nodeOrNew, extend } from './tools.js'
import * as pointed from './pointed.js'
import * as poly from './poly.js'
import PointArray from './PointArray.js'
import { register } from './adopter.js'
import { registerMethods } from './methods.js'

export default class Polygon extends Shape {
  // Initialize node
  constructor (node) {
    super(nodeOrNew('polygon', node), Polygon)
  }
}

registerMethods({
  Container: {
    // Create a wrapped polygon element
    polygon (p) {
      // make sure plot is called as a setter
      return this.put(new Polygon()).plot(p || new PointArray())
    }
  }
})

extend(Polygon, pointed)
extend(Polygon, poly)
register(Polygon)
