import Shape from './Shape.js'
import {xlink} from './namespaces.js'
import {register} from './adopter.js'
import {registerMethods} from './methods.js'
import {nodeOrNew} from './tools.js'

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
