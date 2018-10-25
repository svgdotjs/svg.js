import Container from './Container.js'
import {nodeOrNew} from './tools.js'

export default class Symbol extends Container {
  // Initialize node
  constructor (node) {
    super(nodeOrNew('symbol', node))
  }
}

addFactory(Container, {
  // create symbol
  symbol () {
    return this.put(new Symbol())
  }
})
