import {proportionalSize} from './helpers.js'
import Base from './Base.js'
import {nodeOrNew, extend} from './tools.js'
import * as pointed from './pointed.js'
import * as poly from './poly.js'
import PointArray from './PointArray.js'

export default class Polygon extends Base {
  // Initialize node
  constructor (node) {
    super(nodeOrNew('polygon', node), Polygon)
  }
}

Polygon.constructors = {
  Parent: {
    // Create a wrapped polygon element
    polygon (p) {
      // make sure plot is called as a setter
      return this.put(new Polygon()).plot(p || new PointArray())
    }
  }
}

extend(Polygon, pointed)
extend(Polygon, poly)
