import { nodeOrNew, register, wrapWithAttrCheck } from '../utils/adopter.js'
import { registerMethods } from '../utils/methods.js'
import Container from './Container.js'

export default class Marker extends Container {
  // Initialize node
  constructor (node, attrs = node) {
    super(nodeOrNew('marker', node), attrs)
  }

  // Set height of element
  height (heightValue) {
    return this.attr('markerHeight', heightValue)
  }

  orient (orientValue) {
    return this.attr('orient', orientValue)
  }

  // Set marker refX and refY
  ref (x, y) {
    return this.attr('refX', x).attr('refY', y)
  }

  // Return the fill id
  toString () {
    return 'url(#' + this.id() + ')'
  }

  // Update marker
  update (block) {
    // remove all content
    this.clear()

    // invoke passed block
    if (typeof block === 'function') {
      block.call(this, this)
    }

    return this
  }

  // Set width of element
  width (widthValue) {
    return this.attr('markerWidth', widthValue)
  }

}

registerMethods({
  Container: {
    marker (...args) {
      // Create marker element in defs
      return this.defs().marker(...args)
    }
  },
  Defs: {
    // Create marker
    marker: wrapWithAttrCheck(function (width, height, block) {
      // Set default viewbox to match the width and height, set ref to cx and cy and set orient to auto
      return this.put(new Marker())
        .size(width, height)
        .ref(width / 2, height / 2)
        .viewbox(0, 0, width, height)
        .attr('orient', 'auto')
        .update(block)
    })
  },
  marker: {
    // Create and attach markers
    marker (markerValue, width, height, block) {
      let attr = [ 'marker' ]

      // Build attribute name
      if (markerValue !== 'all') attr.push(markerValue)
      attr = attr.join('-')

      // Set marker attribute
      markerValue = arguments[1] instanceof Marker
        ? arguments[1]
        : this.defs().marker(width, height, block)

      return this.attr(attr, markerValue)
    }
  }
})

register(Marker, 'Marker')
