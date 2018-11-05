import { delimiter } from './regex.js'
import { subClassArray } from './ArrayPolyfill.js'
import { extend } from './tools.js'

const SVGArray = subClassArray('SVGArray', Array, function (...args) {
  this.init(...args)
})

export default SVGArray

extend(SVGArray, {
  init (...args) {
    this.length = 0
    this.push(...this.parse(...args))
  },

  toArray () {
    return Array.prototype.concat.apply([], this)
  },

  toString () {
    return this.join(' ')
  },

  // Flattens the array if needed
  valueOf () {
    const ret = []
    ret.push(...this)
    return ret
  },

  // Parse whitespace separated string
  parse (array = []) {
    // If already is an array, no need to parse it
    if (array instanceof Array) return array

    return array.trim().split(delimiter).map(parseFloat)
  },

  clone () {
    return new this.constructor(this)
  },

  toSet () {
    return new Set(this)
  }
})
