import { registerMethods } from './methods.js'

// export const name = 'Memory'
//
// export function setup (node) {
//   this._memory = {}
// }

// Remember arbitrary data
export function remember (k, v) {
  // remember every item in an object individually
  if (typeof arguments[0] === 'object') {
    for (var key in k) {
      this.remember(key, k[key])
    }
  } else if (arguments.length === 1) {
    // retrieve memory
    return this.memory()[k]
  } else {
    // store memory
    this.memory()[k] = v
  }

  return this
}

// Erase a given memory
export function forget () {
  if (arguments.length === 0) {
    this._memory = {}
  } else {
    for (var i = arguments.length - 1; i >= 0; i--) {
      delete this.memory()[arguments[i]]
    }
  }
  return this
}

// return local memory object
export function memory () {
  return (this._memory = this._memory || {})
}

registerMethods('Dom', { remember, forget, memory })
// registerConstructor('Memory', setup)
