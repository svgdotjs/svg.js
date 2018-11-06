import { nodeOrNew, register } from '../utils/adopter.js'
import { registerMethods } from '../utils/methods.js'
import { xlink } from '../modules/core/namespaces.js'
import Shape from './Shape.js'

export default class Use extends Shape {
  constructor (node) {
    super(nodeOrNew('use', node), Use)
  }

  // Use element as a reference
  element (element, file) {
    // Set lined element
    return this.attr('href', (file || '') + '#' + element, xlink)
  }
}

registerMethods({
  Container: {
    // Create a use element
    use: function (element, file) {
      return this.put(new Use()).element(element, file)
    }
  }
})

register(Use)
