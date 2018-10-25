import Parent from './Parent.js'
import * as circled from './circled.js'

export default class Ellipse extends Shape {
  constructor (node) {
    super(nodeOrNew('ellipse', node))
  }
}

extend(Ellipse, circled)

addFactory(Container, {
  // Create an ellipse
  ellipse: function (width, height) {
    return this.put(new Ellipse()).size(width, height).move(0, 0)
  }
})
