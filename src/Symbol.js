import Base from './Base.js'
import {nodeOrNew} from './tools.js'
import {register} from './adopter.js'
import {registerMethods} from './methods.js'

export default class Symbol extends Base {
  // Initialize node
  constructor (node) {
    super(nodeOrNew('symbol', node), Symbol)
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
