import { extend } from '../utils/adopter.js'
import { subClassArray } from './ArrayPolyfill.js'

const List = subClassArray('List', Array, function (arr) {
  this.length = 0
  this.push(...arr)
})

export default List

extend(List, {
  each (cbOrName, ...args) {
    if (typeof cbOrName === 'function') {
      this.forEach((el) => { cbOrName.call(el, el) })
    } else {
      this.forEach((el) => {
        el[cbOrName](...args)
      })
    }

    return this
  },

  toArray () {
    return Array.prototype.concat.apply([], this)
  }
})

List.extend = function (methods) {
  methods = methods.reduce((obj, name) => {
    obj[name] = function (...attrs) {
      return this.each(name, ...attrs)
    }
    return obj
  }, {})

  extend(List, methods)
}
