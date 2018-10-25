import Container from './Container.js'
import Parent from './Parent.js'

export default class G extends Container {
  constructor (node) {
    super(nodeorNew('group', node))
  }
}

addFactory(Parent, {
  // Create a group element
  group: function () {
    return this.put(new G())
  }
})
