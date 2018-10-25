import Container from './Container.js'
import Defs from './Defs.js'
import Line from './Line.js'
import Polyline from './Polyline.js'
import Polygon from './Polygon.js'
import Path from './Path.js'

export default class Marker extends Container {
  // Initialize node
  constructor (node) {
    super(nodeOrNew('marker', node))
  }

  // Set width of element
  width (width) {
    return this.attr('markerWidth', width)
  }

  // Set height of element
  height (height) {
    return this.attr('markerHeight', height)
  }

  // Set marker refX and refY
  ref (x, y) {
    return this.attr('refX', x).attr('refY', y)
  }

  // Update marker
  update (block) {
    // remove all content
    this.clear()

    // invoke passed block
    if (typeof block === 'function') { block.call(this, this) }

    return this
  }

  // Return the fill id
  toString () {
    return 'url(#' + this.id() + ')'
  }
}

addFactory(Container, {
  marker (width, height, block) {
    // Create marker element in defs
    return this.defs().marker(width, height, block)
  }
})

extend(Defs, {
  // Create marker
  marker (width, height, block) {
    // Set default viewbox to match the width and height, set ref to cx and cy and set orient to auto
    return this.put(new Marker())
      .size(width, height)
      .ref(width / 2, height / 2)
      .viewbox(0, 0, width, height)
      .attr('orient', 'auto')
      .update(block)
  }
})

extend([Line, Polyline, Polygon, Path], {
  // Create and attach markers
  marker (marker, width, height, block) {
    var attr = ['marker']

    // Build attribute name
    if (marker !== 'all') attr.push(marker)
    attr = attr.join('-')

    // Set marker attribute
    marker = arguments[1] instanceof Marker
      ? arguments[1]
      : this.doc().marker(width, height, block)

    return this.attr(attr, marker)
  }
})
