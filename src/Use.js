import Base from './Base.js'
import {xlink} from './namespaces.js'

export default class Use extends Base {
  constructor (node) {
    super(nodeOrNew('use', node), Use)
  }

  // Use element as a reference
  element (element, file) {
    // Set lined element
    return this.attr('href', (file || '') + '#' + element, xlink)
  }
}

Use.constructors = {
  Container: {
    // Create a use element
    use: function (element, file) {
      return this.put(new Use()).element(element, file)
    }
  }
}
