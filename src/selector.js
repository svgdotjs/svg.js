import {idFromReference} from './helpers.js'
import {map} from './utils.js'
import {adopt} from './tools.js'

// // Method for getting an element by id
// SVG.get = function (id) {
//   var node = document.getElementById(idFromReference(id) || id)
//   return SVG.adopt(node)
// }
//
// // Select elements by query string
// SVG.select = function (query, parent) {
//   return SVG.utils.map((parent || document).querySelectorAll(query), function (node) {
//     return SVG.adopt(node)
//   })
// }
//
// SVG.$$ = function (query, parent) {
//   return SVG.utils.map((parent || document).querySelectorAll(query), function (node) {
//     return SVG.adopt(node)
//   })
// }
//
// SVG.$ = function (query, parent) {
//   return SVG.adopt((parent || document).querySelector(query))
// }

export default function find (query, parent) {
  return utils.map((parent || document).querySelectorAll(query), function (node) {
    return adopt(node)
  })
}

export let mixings = {
  // Scoped select method
  select: function (query) {
    return find(query, this.node)
  }
}

// extend(SVG.Parent, {
//   // Scoped select method
//   select: function (query) {
//     return SVG.select(query, this.node)
//   }
// })
