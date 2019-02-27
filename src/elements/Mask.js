import { nodeOrNew, register, wrapWithAttrCheck } from '../utils/adopter.js'
import { registerMethods } from '../utils/methods.js'
import Container from './Container.js'
import baseFind from '../modules/core/selector.js'

export default class Mask extends Container {
  // Initialize node
  constructor (node) {
    super(nodeOrNew('mask', node), node)
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
    return baseFind('svg [mask*="' + this.id() + '"]')
  }
}

registerMethods({
  Container: {
    mask: wrapWithAttrCheck(function () {
      return this.defs().put(new Mask())
    })
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

register(Mask, 'Mask')
