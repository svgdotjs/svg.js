import Base from './Base.js'
import {nodeOrNew, extend} from './tools.js'

export default class Rect extends Base {
  // Initialize node
  constructor (node) {
    super(nodeOrNew('rect', node), Rect)
  }
}

Rect.constructors = {
  Container: {
    // Create a rect element
    rect (width, height) {
      return this.put(new Rect()).size(width, height)
    }
  }
}
