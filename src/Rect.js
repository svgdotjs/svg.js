import Base from './Base.js'
import {nodeOrNew, extend} from './tools.js'
import * as EventTarget from './EventTarget.js'
import * as Element from './Element.js'
import * as Parent from './Parent.js'

export default class Rect extends Base {
  // Initialize node
  constructor (node) {
    super(nodeOrNew('rect', node), Rect)
  }
}

extend(Rect, [EventTarget, Element, Parent])

Rect.constructors = {
  Container: {
    // Create a rect element
    rect (width, height) {
      return this.put(new Rect()).size(width, height)
    }
  }
}
