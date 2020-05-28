import {
  extend,
  nodeOrNew,
  register,
  wrapWithAttrCheck
} from '../utils/adopter.js'
import { globals } from '../utils/window.js'
import { registerMethods } from '../utils/methods.js'
import SVGNumber from '../types/SVGNumber.js'
import Shape from './Shape.js'
import Text from './Text.js'
import * as textable from '../modules/core/textable.js'

export default class Tspan extends Shape {
  // Initialize node
  constructor (node, attrs = node) {
    super(nodeOrNew('tspan', node), attrs)
    this._build = false // disable build mode for adding multiple lines
  }

  // Set text content
  text (text) {
    if (text == null) return this.node.textContent + '\n'.repeat(this.dom.newLinesAfter || 0)

    if (typeof text === 'function') {
      this.clear().build(true)
      text.call(this, this)
      this.build(false)
    } else {
      this.plain(text)
    }

    return this
  }

  // Shortcut dx
  dx (dx) {
    return this.attr('dx', dx)
  }

  // Shortcut dy
  dy (dy) {
    return this.attr('dy', dy)
  }

  // Create new line
  newLine (count = 1) {
    // mark new line
    this.dom.newLinesAfter = count

    // fetch parent
    var text = this.parent()

    // early return in case we are not in a text element
    if (!(text instanceof Text)) {
      return this
    }

    var i = text.index(this)

    var fontSize = globals.window.getComputedStyle(this.node)
      .getPropertyValue('font-size')
    var dy = text.dom.leading * new SVGNumber(fontSize) * count

    // apply new position
    return this.dy(i ? dy : 0).attr('x', text.x())
  }
}

extend(Tspan, textable)

registerMethods({
  Tspan: {
    tspan: wrapWithAttrCheck(function (text = '') {
      var tspan = new Tspan()

      // clear if build mode is disabled
      if (!this._build) {
        this.clear()
      }

      // add new tspan
      return this.put(tspan).text(text)
    })
  },
  Text: {
    newLine: function (text = '') {
      return this.tspan(text).newLine()
    }
  }
})

register(Tspan, 'Tspan')
