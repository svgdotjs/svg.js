import Base from './Base.js'
import {nodeOrNew} from './tools.js'

export default class Symbol extends Base {
  // Initialize node
  constructor (node) {
    super(nodeOrNew('symbol', node), Symbol)
  }
}

Symbol.constructors = {
  Container: {
    symbol () {
      return this.put(new Symbol())
    }
  }
}
