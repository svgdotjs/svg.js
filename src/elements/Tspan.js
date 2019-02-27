import {
  extend,
  nodeOrNew,
  register,
  wrapWithAttrCheck
} from '../utils/adopter.js'
import { globals } from '../utils/window.js'
import { registerMethods } from '../utils/methods.js'
import SVGNumber from '../types/SVGNumber.js'
import Text from './Text.js'
import * as textable from '../modules/core/textable.js'

export default class Tspan extends Text {
  // Initialize node
  constructor (node) {
    super(nodeOrNew('tspan', node), node)
  }

  // Set text content
  text (text) {
    if (text == null) return this.node.textContent + (this.dom.newLined ? '\n' : '')

    typeof text === 'function' ? text.call(this, this) : this.plain(text)

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

  x (x) {
    return this.attr('x', x)
  }

  y (y) {
    return this.attr('x', y)
  }

  move (x, y) {
    return this.x(x).y(y)
  }

  // Create new line
  newLine () {
    // fetch text parent
    var t = this.parent(Text)

    // mark new line
    this.dom.newLined = true

    var fontSize = globals.window.getComputedStyle(this.node)
      .getPropertyValue('font-size')
    var dy = t.dom.leading * new SVGNumber(fontSize)

    // apply new position
    return this.dy(dy).attr('x', t.x())
  }
}

extend(Tspan, textable)

registerMethods({
  Tspan: {
    tspan: wrapWithAttrCheck(function (text) {
      var tspan = new Tspan()

      // clear if build mode is disabled
      if (!this._build) {
        this.clear()
      }

      // add new tspan
      this.node.appendChild(tspan.node)

      return tspan.text(text)
    })
  }
})

register(Tspan, 'Tspan')
