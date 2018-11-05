import { map } from './utils.js'
import { adopt } from './adopter.js'
import { registerMethods } from './methods.js'

export default function baseFind (query, parent) {
  return map((parent || document).querySelectorAll(query), function (node) {
    return adopt(node)
  })
}

// Scoped find method
export function find (query) {
  return baseFind(query, this.node)
}

registerMethods('Dom', { find })
