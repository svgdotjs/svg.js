import Container from './Container.js'
import {nodeOrNew} from './tools.js'

export default class Defs extends Container {
  constructor (node) {
    super(nodeOrNew('defs', node))
  }
}
