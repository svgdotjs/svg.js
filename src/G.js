import Base from './Base.js'

export default class G extends Base {
  constructor (node) {
    super(nodeorNew('g', node), G)
  }
}

G.constructors = {
  Element: {
    // Create a group element
    group: function () {
      return this.put(new G())
    }
  }
}
