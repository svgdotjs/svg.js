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
    if (block(array[i])) {
      result.push(array[i])
    }
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

// Convert dash-separated-string to camelCase
export function camelCase (s) {
  return s.toLowerCase().replace(/-(.)/g, function (m, g) {
    return g.toUpperCase()
  })
}

// Convert camel cased string to string seperated
export function unCamelCase (s) {
  return s.replace(/([A-Z])/g, function (m, g) {
    return '-' + g.toLowerCase()
  })
}

// Capitalize first letter of a string
export function capitalize (s) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

// Calculate proportional width and height values when necessary
export function proportionalSize (element, width, height, box) {
  if (width == null || height == null) {
    box = box || element.bbox()

    if (width == null) {
      width = box.width / box.height * height
    } else if (height == null) {
      height = box.height / box.width * width
    }
  }

  return {
    width: width,
    height: height
  }
}

export function getOrigin (o, element) {
  // Allow origin or around as the names
  const origin = o.origin // o.around == null ? o.origin : o.around
  let ox, oy

  // Allow the user to pass a string to rotate around a given point
  if (typeof origin === 'string' || origin == null) {
    // Get the bounding box of the element with no transformations applied
    const string = (origin || 'center').toLowerCase().trim()
    const { height, width, x, y } = element.bbox()

    // Calculate the transformed x and y coordinates
    const bx = string.includes('left') ? x
      : string.includes('right') ? x + width
      : x + width / 2
    const by = string.includes('top') ? y
      : string.includes('bottom') ? y + height
      : y + height / 2

    // Set the bounds eg : "bottom-left", "Top right", "middle" etc...
    ox = o.ox != null ? o.ox : bx
    oy = o.oy != null ? o.oy : by
  } else {
    ox = origin[0]
    oy = origin[1]
  }

  // Return the origin as it is if it wasn't a string
  return [ ox, oy ]
}
