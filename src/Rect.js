import Shape from './Shape.js'
import {nodeOrNew} from './tools.js'

export default class Rect extends Shape {
  // Initialize node
  constructor (node) {
    super(nodeOrNew('rect', node))
  }
}

addFactory(Parent, {
  // Create a rect element
  rect (width, height) {
    return this.put(new Rect()).size(width, height)
  }
})
