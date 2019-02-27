import { nodeOrNew, register, wrapWithAttrCheck } from '../utils/adopter.js'
import { registerMethods } from '../utils/methods.js'
import Element from './Element.js'

export default class ForeignObject extends Element {
  constructor (node) {
    super(nodeOrNew('foreignObject', node), node)
  }
}

registerMethods({
  Container: {
    foreignObject: wrapWithAttrCheck(function (width, height) {
      return this.put(new ForeignObject()).size(width, height)
    })
  }
})

register(ForeignObject, 'ForeignObject')
