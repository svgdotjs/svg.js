import Base from './Base.js'
import {nodeOrNew} from './tools.js'
import attr from './attr.js'
import {register} from './adopter.js'
import {registerMethods} from './methods.js'

export default class Pattern extends Base {
  // Initialize node
  constructor (node) {
    super(nodeOrNew('pattern', node), Pattern)
  }

  // Return the fill id
  url () {
    return 'url(#' + this.id() + ')'
  }

  // Update pattern by rebuilding
  update (block) {
    // remove content
    this.clear()

    // invoke passed block
    if (typeof block === 'function') {
      block.call(this, this)
    }

    return this
  }

  // Alias string convertion to fill
  toString () {
    return this.url()
  }

  // custom attr to handle transform
  attr (a, b, c) {
    if (a === 'transform') a = 'patternTransform'
    return attr.call(this, a, b, c)
  }

  targets () {
    return find('svg [fill*="' + this.id() + '"]')
  }
}

registerMethods({
  Container: {
    // Create pattern element in defs
    pattern (width, height, block) {
      return this.defs().pattern(width, height, block)
    }
  },
  Defs: {
    pattern (width, height, block) {
      return this.put(new Pattern()).update(block).attr({
        x: 0,
        y: 0,
        width: width,
        height: height,
        patternUnits: 'userSpaceOnUse'
      })
    }
  }
})

register(Pattern)
