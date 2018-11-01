import Base from './Base.js'
import {nodeOrNew, extend} from './tools.js'
import {register} from './adopter.js'
import {registerMethods} from './methods.js'

export default class Rect extends Base {
  // Initialize node
  constructor (node) {
    super(nodeOrNew('rect', node), Rect)
  }
}

registerMethods({
  Container: {
    // Create a rect element
    rect (width, height) {
      return this.put(new Rect()).size(width, height)
    }
  }
})

register(Rect)
