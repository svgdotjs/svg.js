import Parent from './Parent.js'
import {nodeOrNew, extend} from './tools.js'
import * as textable from './textable.js'
import {register} from './adopter.js'
import {registerMethods} from './methods.js'
import Text from './Text.js'

export default class Tspan extends Parent {
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

registerMethods({
  Tspan: {
    tspan (text) {
      var tspan = new Tspan()

      // clear if build mode is disabled
      if (!this._build) {
        this.clear()
      }

      // add new tspan
      this.node.appendChild(tspan.node)

      return tspan.text(text)
    }
  }
})

register(Tspan)
