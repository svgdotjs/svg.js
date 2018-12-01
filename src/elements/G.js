import { nodeOrNew, register, wrapWithAttrCheck } from '../utils/adopter.js'
import { registerMethods } from '../utils/methods.js'
import Container from './Container.js'

export default class G extends Container {
  constructor (node) {
    super(nodeOrNew('g', node), node)
  }

  x (x) {
    if (x == null) return this.transform()['x']
    return this.move(x, 0)
  }

  y (y) {
    if (y == null) return this.transform()['y']
    return this.move(0, y)
  }

  move (x, y) {
    return this.translate(x, y)
  }

  dx (dx) {
    return this.transform({ dx }, true)
  }

  dy (dy) {
    return this.transform({ dy }, true)
  }

  dmove (dx, dy) {
    return this.transform({ dx, dy }, true)
  }
}

registerMethods({
  Element: {
    // Create a group element
    group: wrapWithAttrCheck(function () {
      return this.put(new G())
    })
  }
})

register(G)
