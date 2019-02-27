import { nodeOrNew, register } from '../utils/adopter.js'
import Element from './Element.js'
import SVGNumber from '../types/SVGNumber.js'

export default class Stop extends Element {
  constructor (node) {
    super(nodeOrNew('stop', node), node)
  }

  // add color stops
  update (o) {
    if (typeof o === 'number' || o instanceof SVGNumber) {
      o = {
        offset: arguments[0],
        color: arguments[1],
        opacity: arguments[2]
      }
    }

    // set attributes
    if (o.opacity != null) this.attr('stop-opacity', o.opacity)
    if (o.color != null) this.attr('stop-color', o.color)
    if (o.offset != null) this.attr('offset', new SVGNumber(o.offset))

    return this
  }
}

register(Stop, 'Stop')
