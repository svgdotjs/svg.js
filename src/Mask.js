import Container from './Container.js'
import { nodeOrNew } from './tools.js'
import find from './selector.js'
// import {remove} from  './Element.js'
import { register } from './adopter.js'
import { registerMethods } from './methods.js'

export default class Mask extends Container {
  // Initialize node
  constructor (node) {
    super(nodeOrNew('mask', node), Mask)
  }

  // Unmask all masked elements and remove itself
  remove () {
    // unmask all targets
    this.targets().forEach(function (el) {
      el.unmask()
    })

    // remove mask from parent
    return super.remove()
  }

  targets () {
    return find('svg [mask*="' + this.id() + '"]')
  }
}

registerMethods({
  Container: {
    mask () {
      return this.defs().put(new Mask())
    }
  },
  Element: {
    // Distribute mask to svg element
    maskWith (element) {
      // use given mask or create a new one
      var masker = element instanceof Mask
        ? element
        : this.parent().mask().add(element)

      // apply mask
      return this.attr('mask', 'url("#' + masker.id() + '")')
    },

    // Unmask element
    unmask () {
      return this.attr('mask', null)
    },

    masker () {
      return this.reference('mask')
    }
  }
})

register(Mask)
