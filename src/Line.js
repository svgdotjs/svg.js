import {proportionalSize} from './helpers.js'
import {nodeOrNew} from './tools.js'
import PointArray from './PointArray.js'
import Base from './Base.js'
import {register} from './adopter.js'
import {registerMethods} from './methods.js'

export default class Line extends Base {
  // Initialize node
  constructor (node) {
    super(nodeOrNew('line', node), Line)
  }

  // Get array
  array () {
    return new PointArray([
      [ this.attr('x1'), this.attr('y1') ],
      [ this.attr('x2'), this.attr('y2') ]
    ])
  }

  // Overwrite native plot() method
  plot (x1, y1, x2, y2) {
    if (x1 == null) {
      return this.array()
    } else if (typeof y1 !== 'undefined') {
      x1 = { x1: x1, y1: y1, x2: x2, y2: y2 }
    } else {
      x1 = new PointArray(x1).toLine()
    }

    return this.attr(x1)
  }

  // Move by left top corner
  move (x, y) {
    return this.attr(this.array().move(x, y).toLine())
  }

  // Set element size to given width and height
  size (width, height) {
    var p = proportionalSize(this, width, height)
    return this.attr(this.array().size(p.width, p.height).toLine())
  }

}

registerMethods({
  Container: {
    // Create a line element
    line (...args) {
      // make sure plot is called as a setter
      // x1 is not necessarily a number, it can also be an array, a string and a PointArray
      return Line.prototype.plot.apply(
        this.put(new Line())
      , args[0] != null ? args : [0, 0, 0, 0]
      )
    }
  }
})

register(Line)
