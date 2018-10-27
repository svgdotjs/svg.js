import Base from './Base.js'
import {nodeOrNew} from './tools.js'
// import find from './selector.js'
// import {remove} from  './Element.js'

export default class Mask extends Base {
  // Initialize node
  constructor (node) {
    super(nodeOrNew('mask', node))
  }

  // // Unmask all masked elements and remove itself
  // remove () {
  //   // unmask all targets
  //   this.targets().forEach(function (el) {
  //     el.unmask()
  //   })
  //
  //   // remove mask from parent
  //   return remove.call(this)
  // }
  //
  // targets () {
  //   return find('svg [mask*="' + this.id() + '"]')
  // }

}


Mask.constructors = {
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
}
