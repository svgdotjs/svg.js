import Stop from './Stop.js'
import * as gradiented from './gradiented.js'
import {nodeOrNew, extend, addFactory} from './tools.js'

export default class Gradient extends Container {
  constructor (type) {
    super(nodeOrNew(type + 'Gradient', typeof type === 'string' ? null : type))
  }

  // Add a color stop
  stop (offset, color, opacity) {
    return this.put(new Stop()).update(offset, color, opacity)
  }

  // Update gradient
  update (block) {
    // remove all stops
    this.clear()

    // invoke passed block
    if (typeof block === 'function') {
      block.call(this, this)
    }

    return this
  }

  // Return the fill id
  url () {
    return 'url(#' + this.id() + ')'
  }

  // Alias string convertion to fill
  toString () {
    return this.url()
  }

  // custom attr to handle transform
  attr (a, b, c) {
    if (a === 'transform') a = 'gradientTransform'
    return super.attr(a, b, c)
  }
}

extend(Gradient, gradiented)

addFactory(Parent, {
  // Create gradient element in defs
  gradient (type, block) {
    return this.defs().gradient(type, block)
  }
})

// Base gradient generation
addFactory(Defs, {
  // define gradient
  gradient: function (type, block) {
    return this.put(new Gradient(type)).update(block)
  }
})
