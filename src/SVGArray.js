/* global arrayClone */
import {delimiter} from './regex.js'
import {subClassArray} from './ArrayPolyfill.js'
import {extend} from './tools.js'

const SVGArray = subClassArray('SVGArray', Array, function (...args) {
  this.init(...args)
})

export default SVGArray

extend(SVGArray, {
  init (...args) {
    //this.splice(0, this.length)
    this.length = 0
    this.push(...this.parse(...args))
  },

  toArray () {
    // const ret = []
    // ret.push(...this)
    // return ret
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
    // return this.toArray()
  },

  // Parse whitespace separated string
  parse (array = []) {
    //array = array.valueOf()

    // If already is an array, no need to parse it
    if (array instanceof Array) return array

    return array.trim().split(delimiter).map(parseFloat)
  },

  clone () {
    return new this.constructor(this)
  },

  toSet () {
    return new Set(this)
  },
})

// export default class SVGArray extends BaseArray {
//   constructor (...args) {
//     super()
//     this.init(...args)
//   }
//
//   init (array, fallback = []) {
//     //this.splice(0, this.length)
//     this.length = 0
//     this.push(...this.parse(array || fallback))
//   }
//
//   toArray () {
//     return [].concat(this)
//   }
//
//   toString () {
//     return this.join(' ')
//   }
//
//   valueOf () {
//     return this.toArray()
//   }
//
//   // Parse whitespace separated string
//   parse (array) {
//     array = array.valueOf()
//
//     // if already is an array, no need to parse it
//     if (Array.isArray(array)) return array
//
//     return array.trim().split(delimiter).map(parseFloat)
//   }
//
//   clone () {
//     return new this.constructor(this)
//   }
//
//   toSet () {
//     return new Set(this)
//   }
// }
