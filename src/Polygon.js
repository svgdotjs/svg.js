import {proportionalSize} from './helpers.js'
import Shape from './Shape.js'
import {nodeOrNew} from './tools.js'
import * as pointed from './pointed.js'
import PointArray from './PointArray.js'

export default class Polygon extends Shape {
  // Initialize node
  constructor (node) {
    super(nodeOrNew('polygon', node))
  }
}

addFactory(Parent, {
  // Create a wrapped polygon element
  polygon (p) {
    // make sure plot is called as a setter
    return this.put(new Polygon()).plot(p || new PointArray())
  }
})


// // Add polygon-specific functions
// extend([Polyline, Polygon], {
//   // Get array
//   array: function () {
//     return this._array || (this._array = new PointArray(this.attr('points')))
//   },
//
//   // Plot new path
//   plot: function (p) {
//     return (p == null) ? this.array()
//       : this.clear().attr('points', typeof p === 'string' ? p
//       : (this._array = new PointArray(p)))
//   },
//
//   // Clear array cache
//   clear: function () {
//     delete this._array
//     return this
//   },
//
//   // Move by left top corner
//   move: function (x, y) {
//     return this.attr('points', this.array().move(x, y))
//   },
//
//   // Set element size to given width and height
//   size: function (width, height) {
//     let p = proportionalSize(this, width, height)
//     return this.attr('points', this.array().size(p.width, p.height))
//   }
// })
//
// extend([Polyline, Polygon], pointed)
