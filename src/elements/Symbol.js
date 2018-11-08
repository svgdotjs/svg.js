import { nodeOrNew, register } from '../utils/adopter.js'
import { registerMethods } from '../utils/methods.js'
import Container from './Container.js'

export default class Symbol extends Container {
  // Initialize node
  constructor (node) {
    super(nodeOrNew('symbol', node), node)
  }
}

registerMethods({
  Container: {
    symbol () {
      return this.put(new Symbol())
    }
  }
})

register(Symbol)
