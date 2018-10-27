import Base from './Base.js'
import {nodeOrNew, extend} from './tools.js'
import PointArray from './PointArray.js'
import * as pointed from './pointed.js'
import * as poly from './poly.js'

export default class Polyline extends Base {
  // Initialize node
  constructor (node) {
    super(nodeOrNew('polyline', node), Polyline)
  }
}

Polyline.constructors = {
  Parent: {
    // Create a wrapped polygon element
    polyline (p) {
      // make sure plot is called as a setter
      return this.put(new Polyline()).plot(p || new PointArray())
    }
  }
}

extend(Polyline, pointed)
extend(Polyline, poly)
