import Base from './Base.js'
import {register} from './adopter.js'
import {registerMethods} from './methods.js'

export default class G extends Base {
  constructor (node) {
    super(nodeorNew('g', node), G)
  }
}

registerMethods({
  Element: {
    // Create a group element
    group: function () {
      return this.put(new G())
    }
  }
})

register(G)
