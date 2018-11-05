import Stop from './Stop.js'
import Container from './Container.js'
import * as gradiented from './gradiented.js'
import { nodeOrNew, extend } from './tools.js'
// import attr from './attr.js'
import { register } from './adopter.js'
import { registerMethods } from './methods.js'
import Box from './Box.js'
import { find } from './selector.js'

export default class Gradient extends Container {
  constructor (type) {
    super(
      nodeOrNew(type + 'Gradient', typeof type === 'string' ? null : type),
      Gradient
    )
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
    // return attr.call(this, a, b, c)
  }

  targets () {
    return find('svg [fill*="' + this.id() + '"]')
  }

  bbox () {
    return new Box()
  }
}

extend(Gradient, gradiented)

registerMethods({
  Container: {
    // Create gradient element in defs
    gradient (type, block) {
      return this.defs().gradient(type, block)
    }
  },
  // define gradient
  Defs: {
    gradient (type, block) {
      return this.put(new Gradient(type)).update(block)
    }
  }
})

register(Gradient)
