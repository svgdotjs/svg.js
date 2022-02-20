import { attrs as defaults } from './defaults.js'
import { isNumber } from './regex.js'
import Color from '../../types/Color.js'
import SVGArray from '../../types/SVGArray.js'
import SVGNumber from '../../types/SVGNumber.js'

const hooks = []
export function registerAttrHook (fn) {
  hooks.push(fn)
}

// Set svg element attribute
export default function attr (attrValue, val, ns) {
  // act as full getter
  if (attrValue == null) {
    // get an object of attributes
    attrValue = {}
    val = this.node.attributes

    for (const node of val) {
      attrValue[node.nodeName] = isNumber.test(node.nodeValue)
        ? parseFloat(node.nodeValue)
        : node.nodeValue
    }

    return attrValue
  } else if (attrValue instanceof Array) {
    // loop through array and get all values
    return attrValue.reduce((last, curr) => {
      last[curr] = this.attr(curr)
      return last
    }, {})
  } else if (typeof attrValue === 'object' && attrValue.constructor === Object) {
    // apply every attribute individually if an object is passed
    for (val in attrValue) this.attr(val, attrValue[val])
  } else if (val === null) {
    // remove value
    this.node.removeAttribute(attrValue)
  } else if (val == null) {
    // act as a getter if the first and only argument is not an object
    val = this.node.getAttribute(attrValue)
    return val == null
      ? defaults[attrValue]
      : isNumber.test(val)
        ? parseFloat(val)
        : val
  } else {
    // Loop through hooks and execute them to convert value
    val = hooks.reduce((_val, hook) => {
      return hook(attrValue, _val, this)
    }, val)

    // ensure correct numeric values (also accepts NaN and Infinity)
    if (typeof val === 'number') {
      val = new SVGNumber(val)
    } else if (Color.isColor(val)) {
      // ensure full hex color
      val = new Color(val)
    } else if (val.constructor === Array) {
      // Check for plain arrays and parse array values
      val = new SVGArray(val)
    }

    // if the passed attribute is leading...
    if (attrValue === 'leading') {
      // ... call the leading method instead
      if (this.leading) {
        this.leading(val)
      }
    } else {
      // set given attribute on node
      typeof ns === 'string'
        ? this.node.setAttributeNS(ns, attrValue, val.toString())
        : this.node.setAttribute(attrValue, val.toString())
    }

    // rebuild if required
    if (this.rebuild && (attrValue === 'font-size' || attrValue === 'x')) {
      this.rebuild()
    }
  }

  return this
}
