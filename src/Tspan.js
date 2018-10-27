import Base from './Base.js'
import {nodeOrNew, extend} from './tools.js'
import * as textable from './textable.js'

export default class Tspan extends Base {
  // Initialize node
  constructor (node) {
    super(nodeOrNew('tspan', node), Tspan)
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

  // Create new line
  newLine () {
    // fetch text parent
    var t = this.parent(Text)

    // mark new line
    this.dom.newLined = true

    // apply new position
    return this.dy(t.dom.leading * t.attr('font-size')).attr('x', t.x())
  }
}

extend(Tspan, textable)
