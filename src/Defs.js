import Base from './Base.js'
import {nodeOrNew} from './tools.js'

export default class Defs extends Base {
  constructor (node) {
    super(nodeOrNew('defs', node), Defs)
  }

  flatten () { return this }
  ungroup () { return this }
}
