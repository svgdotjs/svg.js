import {Shape, Container} from './classes.js'
import {xlink} from './namespaces.js'

export default class Use extends Shape {
  constructor (node) {
    super(nodeOrNew('use', node))
  }

  // Use element as a reference
  element (element, file) {
    // Set lined element
    return this.attr('href', (file || '') + '#' + element, xlink)
  }
}

addFactory(Container, {
  // Create a use element
  use: function (element, file) {
    return this.put(new Use()).element(element, file)
  }
})
