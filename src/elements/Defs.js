import { nodeOrNew, register } from '../utils/adopter.js'
import Container from './Container.js'

export default class Defs extends Container {
  constructor (node) {
    super(nodeOrNew('defs', node), Defs)
  }

  flatten () { return this }
  ungroup () { return this }
}

register(Defs)
