import { nodeOrNew, register, wrapWithAttrCheck } from '../utils/adopter.js'
import { proportionalSize } from '../utils/utils.js'
import { registerMethods } from '../utils/methods.js'
import PathArray from '../types/PathArray.js'
import Shape from './Shape.js'
import baseFind from '../modules/core/selector.js'

export default class Path extends Shape {
  // Initialize node
  constructor (node) {
    super(nodeOrNew('path', node), node)
  }

  // Get array
  array () {
    return this._array || (this._array = new PathArray(this.attr('d')))
  }

  // Plot new path
  plot (d) {
    return (d == null) ? this.array()
      : this.clear().attr('d', typeof d === 'string' ? d : (this._array = new PathArray(d)))
  }

  // Clear array cache
  clear () {
    delete this._array
    return this
  }

  // Move by left top corner
  move (x, y) {
    return this.attr('d', this.array().move(x, y))
  }

  // Move by left top corner over x-axis
  x (x) {
    return x == null ? this.bbox().x : this.move(x, this.bbox().y)
  }

  // Move by left top corner over y-axis
  y (y) {
    return y == null ? this.bbox().y : this.move(this.bbox().x, y)
  }

  // Set element size to given width and height
  size (width, height) {
    var p = proportionalSize(this, width, height)
    return this.attr('d', this.array().size(p.width, p.height))
  }

  // Set width of element
  width (width) {
    return width == null ? this.bbox().width : this.size(width, this.bbox().height)
  }

  // Set height of element
  height (height) {
    return height == null ? this.bbox().height : this.size(this.bbox().width, height)
  }

  targets () {
    return baseFind('svg textpath [href*="' + this.id() + '"]')
  }
}

// Define morphable array
Path.prototype.MorphArray = PathArray

// Add parent method
registerMethods({
  Container: {
    // Create a wrapped path element
    path: wrapWithAttrCheck(function (d) {
      // make sure plot is called as a setter
      return this.put(new Path()).plot(d || new PathArray())
    })
  }
})

register(Path, 'Path')
