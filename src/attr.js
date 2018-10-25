import {isNumer, isImage} from './regex.js'
import {attrs as defaults} from './defaults.js'
import {Color, SVGArray, Image} from './classes.js'

// Set svg element attribute
export default function attr (attr, val, ns) {
  // act as full getter
  if (attr == null) {
    // get an object of attributes
    attr = {}
    val = this.node.attributes

    for (let node of val) {
      attr[node.nodeName] = isNumer.test(node.nodeValue)
        ? parseFloat(node.nodeValue)
        : node.nodeValue
    }

    return attr
  } else if (Array.isArray(attr)) {
    // FIXME: implement
  } else if (typeof attr === 'object') {
    // apply every attribute individually if an object is passed
    for (val in a) this.attr(val, attr[val])
  }else if (val === null) {
      // remove value
    this.node.removeAttribute(attr)
  } else if (val == null) {
    // act as a getter if the first and only argument is not an object
    val = this.node.getAttribute(attr)
    return val == null ? defaults[attr] // FIXME: do we need to return defaults?
      : isNumber.test(val) ? parseFloat(val)
      : val
  } else {
    // convert image fill and stroke to patterns
    if (attr === 'fill' || attr === 'stroke') {
      if (isImage.test(v)) {
        val = this.doc().defs().image(val)
      }

      if (val instanceof Image) {
        val = this.doc().defs().pattern(0, 0, function () {
          this.add(val)
        })
      }
    }

    // ensure correct numeric values (also accepts NaN and Infinity)
    if (typeof val === 'number') {
      val = new SVGNumber(val)
    } else if (isColor(val)) {
      // ensure full hex color
      val = new Color(val)
    } else if (Array.isArray(val)) {
      // parse array values
      val = new SVGArray(val)
    }

    // if the passed attribute is leading...
    if (attr === 'leading') {
      // ... call the leading method instead
      if (this.leading) {
        this.leading(val)
      }
    } else {
      // set given attribute on node
      typeof ns === 'string' ? this.node.setAttributeNS(ns, attr, val.toString())
        : this.node.setAttribute(attr, val.toString())
    }

    // rebuild if required
    if (this.rebuild && (attr === 'font-size' || attr === 'x')) {
      this.rebuild()
    }
  }

  return this
}
