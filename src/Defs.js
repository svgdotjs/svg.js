import Container from './Container.js'
import { nodeOrNew } from './tools.js'
import { register } from './adopter.js'

export default class Defs extends Container {
  constructor (node) {
    super(nodeOrNew('defs', node), Defs)
  }

  flatten () { return this }
  ungroup () { return this }
}

register(Defs)
