/* global arrayClone */
import {delimiter} from './regex.js'
import ArrayPolyfill from './ArrayPolyfill.js'

let BaseArray = (function() {
  try {
    let b = class extends Array {}
    return Array
  } catch (e) {
    return ArrayPolyfill
  }
})()

export default class SVGArray extends BaseArray {
  constructor (...args) {
    super()
    this.init(...args)
  }

  init (array, fallback) {
    //this.splice(0, this.length)
    this.length = 0
    this.push(...this.parse(array || fallback))
  }

  toArray () {
    return Array.prototype.slice(this)
  }

  toString () {
    this.join(' ')
  }

  valueOf () {
    return this.toArray()
  }

  // Parse whitespace separated string
  parse (array) {
    array = array.valueOf()

    // if already is an array, no need to parse it
    if (Array.isArray(array)) return array

    return array.trim().split(delimiter).map(parseFloat)
  }

  clone () {
    return new this.constructor(this)
  }

  toSet () {
    return new Set(this)
  }
}
