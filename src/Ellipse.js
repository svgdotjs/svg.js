import Base from './Base.js'
import * as circled from './circled.js'
import {extend} from './tools.js'

export default class Ellipse extends Base {
  constructor (node) {
    super(nodeOrNew('ellipse', node), Ellipse)
  }
}

extend(Ellipse, circled)

// addFactory(Container, {
//   // Create an ellipse
//   ellipse: function (width, height) {
//     return this.put(new Ellipse()).size(width, height).move(0, 0)
//   }
// })
