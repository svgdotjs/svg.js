
// Map function
export function map (array, block) {
  var i
  var il = array.length
  var result = []

  for (i = 0; i < il; i++) {
    result.push(block(array[i]))
  }

  return result
}

// Filter function
export function filter (array, block) {
  var i
  var il = array.length
  var result = []

  for (i = 0; i < il; i++) {
    if (block(array[i])) { result.push(array[i]) }
  }

  return result
}

// Degrees to radians
export function radians (d) {
  return d % 360 * Math.PI / 180
}

// Radians to degrees
export function degrees (r) {
  return r * 180 / Math.PI % 360
}

export function filterSVGElements (nodes) {
  return this.filter(nodes, function (el) { return el instanceof window.SVGElement })
}
