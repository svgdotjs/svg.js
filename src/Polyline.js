import Shape from './Shape.js'
import {nodeOrNew} from './tools.js'
import PointArray from './PointArray.js'

export default class Polyline extends Shape {
  // Initialize node
  constructor (node) {
    super(nodeOrNew('polyline', node))
  }
}

// Add parent method
addFactory (Parent, {
  // Create a wrapped polyline element
  polyline (p) {
    // make sure plot is called as a setter
    return this.put(new Polyline()).plot(p || new PointArray())
  }
})
