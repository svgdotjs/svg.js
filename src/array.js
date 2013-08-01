// Module for array conversion
SVG.Array = function(array, fallback) {
  array = (array || []).valueOf()

  /* if array is empty and fallback is provided, use fallback */
  if (array.length == 0 && fallback)
    array = fallback.valueOf()

  /* parse array */
  this.value = this.parse(array)
}

SVG.extend(SVG.Array, {
  // Make array morphable
  morph: function(array) {
    this.destination = this.parse(array)

    /* normalize length of arrays */
    if (this.value.length != this.destination.length) {
      var lastValue       = this.value[this.value.length - 1]
        , lastDestination = this.destination[this.destination.length - 1]

      while(this.value.length > this.destination.length)
        this.destination.push(lastDestination)
      while(this.value.length < this.destination.length)
        this.value.push(lastValue)
    }

    return this
  }
  // Clean up any duplicate points
, settle: function() {
    var i, seen = []

    /* find all unique values */
    for (i = this.value.length - 1; i >= 0; i--)
      if (seen.indexOf(this.value[i]) == -1)
        seen.push(this.value[i])

    /* set new value */
    return this.value = seen
  }
  // Get morphed array at given position
, at: function(pos) {
    /* make sure a destination is defined */
    if (!this.destination) return this

    /* generate morphed array */
    for (var i = 0, il = this.value.length, array = []; i < il; i++)
      array.push(this.value[i] + (this.destination[i] - this.value[i]) * pos)

    return new SVG.Array(array)
  }
  // Convert array to string
, toString: function() {
    return this.value.join(' ')
  }
  // Real value
, valueOf: function() {
    return this.value
  }
  // Parse whitespace separated string
, parse: function(array) {
    array = array.valueOf()

    /* if already is an array, no need to parse it */
    if (Array.isArray(array)) return array

    return this.split(array)
  }
  // Strip unnecessary whitespace
, split: function(string) {
    return string.replace(/\s+/g, ' ').replace(/^\s+|\s+$/g,'').split(' ') 
  }

})

// Poly points array
SVG.PointArray = function() {
  this.constructor.apply(this, arguments)
}

// Inherit from SVG.Array
SVG.PointArray.prototype = new SVG.Array

SVG.extend(SVG.PointArray, {
  // Convert array to string
  toString: function() {
    /* convert to a poly point string */
    for (var i = 0, il = this.value.length, array = []; i < il; i++)
      array.push(this.value[i].join(','))

    return array.join(' ')
  }
  // Get morphed array at given position
, at: function(pos) {
    /* make sure a destination is defined */
    if (!this.destination) return this

    /* generate morphed point string */
    for (var i = 0, il = this.value.length, array = []; i < il; i++)
      array.push([
        this.value[i][0] + (this.destination[i][0] - this.value[i][0]) * pos
      , this.value[i][1] + (this.destination[i][1] - this.value[i][1]) * pos
      ])

    return new SVG.PointArray(array)
  }
  // Parse point string
, parse: function(array) {
    array = array.valueOf()

    /* if already is an array, no need to parse it */
    if (Array.isArray(array)) return array

    /* split points */
    array = this.split(array)

    /* parse points */
    for (var i = 0, il = array.length, p, points = []; i < il; i++) {
      p = array[i].split(',')
      points.push([parseFloat(p[0]), parseFloat(p[1])])
    }

    return points
  }
  // Move point string
, move: function(x, y) {
    var box = this.bbox()

    /* get relative offset */
    x -= box.x
    y -= box.y

    /* move every point */
    for (var i = this.value.length - 1; i >= 0; i--)
      this.value[i] = [this.value[i][0] + x, this.value[i][1] + y]

    return this
  }
  // Resize poly string
, size: function(width, height) {
    var i, box = this.bbox()

    /* recalculate position of all points according to new size */
    for (i = this.value.length - 1; i >= 0; i--) {
      this.value[i][0] = ((this.value[i][0] - box.x) * width)  / box.width  + box.x
      this.value[i][1] = ((this.value[i][1] - box.y) * height) / box.height + box.x
    }

    return this
  }
  // Get bounding box of points
, bbox: function() {
    if (this.value.length == 0)
      return { x: 0, y: 0, width: 0, height: 0 }

    var i
    , x = this.value[0][0]
    , y = this.value[0][1]
    , box = { x: x, y: y }
    
    /* find position */
    for (i = this.value.length - 1; i >= 0; i--) {
      if (this.value[i][0] < box.x)
        box.x = this.value[i][0]
      if (this.value[i][1] < box.y)
        box.y = this.value[i][1]
      if (this.value[i][0] > x)
        x = this.value[i][0]
      if (this.value[i][1] > y)
        y = this.value[i][1]
    }

    /* calculate size */
    box.width  = x - box.x
    box.height = y - box.y

    return box
  }

})















