import Shape from './Shape.js'
import {nodeOrNew, extend} from './tools.js'
import PointArray from './PointArray.js'
import * as pointed from './pointed.js'
import * as poly from './poly.js'
import {register} from './adopter.js'
import {registerMethods} from './methods.js'

export default class Polyline extends Shape {
  // Initialize node
  constructor (node) {
    super(nodeOrNew('polyline', node), Polyline)
  }
}

registerMethods({
  Container: {
    // Create a wrapped polygon element
    polyline (p) {
      // make sure plot is called as a setter
      return this.put(new Polyline()).plot(p || new PointArray())
    }
  }
})

extend(Polyline, pointed)
extend(Polyline, poly)
register(Polyline)
