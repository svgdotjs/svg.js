SVG.Point = SVG.invent({
  // Initialize
  create: function(x,y) {
    var i, source, base = {x:0, y:0}

    // ensure source as object
    source = Array.isArray(x) ?
      {x:x[0], y:x[1]} :
    typeof x === 'object' ?
      {x:x.x, y:x.y} :
    x != null ?
      {x:x, y:(y != null ? y : x)} : base // If y has no value, then x is used has its value
                                          // This allow element-wise operations to be passed a single number
    // merge source
    this.x = source.x
    this.y = source.y
  }

  // Add methods
, extend: {
    // Clone point
    clone: function() {
      return new SVG.Point(this)
    }
    // Morph one point into another
  , morph: function(x, y) {
      // store new destination
      this.destination = new SVG.Point(x, y)

      return this
    }
    // Get morphed point at a given position
  , at: function(pos) {
      // make sure a destination is defined
      if (!this.destination) return this

      // calculate morphed matrix at a given position
      var point = new SVG.Point({
        x: this.x + (this.destination.x - this.x) * pos
      , y: this.y + (this.destination.y - this.y) * pos
      })

      return point
    }
    // Convert to native SVGPoint
  , native: function() {
      // create new point
      var point = SVG.parser.native.createSVGPoint()

      // update with current values
      point.x = this.x
      point.y = this.y

      return point
    }
    // transform point with matrix
  , transform: function(matrix) {
      return new SVG.Point(this.native().matrixTransform(matrix.native()))
    }
    // return an array of the x and y coordinates
  , toArray: function() {
      return [this.x, this.y]
    }
    // perform an element-wise addition with the passed point or number
  , plus: function(x, y) {
      var point = new SVG.Point(x, y)
      return new SVG.Point(this.x + point.x, this.y + point.y)
    }
    // perform an element-wise subtraction with the passed point or number
  , minus: function(x, y) {
      var point = new SVG.Point(x, y)
      return new SVG.Point(this.x - point.x, this.y - point.y)
    }
    // perform an element-wise multiplication with the passed point or number
  , times: function(x, y) {
      var point = new SVG.Point(x, y)
      return new SVG.Point(this.x * point.x, this.y * point.y)
    }
    // perform an element-wise division with the passed point or number
  , divide: function(x, y) {
      var point = new SVG.Point(x, y)
      return new SVG.Point(this.x / point.x, this.y / point.y)
    }
    // calculate the Euclidean norm
  , norm: function() {
      return Math.sqrt(this.x*this.x + this.y*this.y)
    }
    // calculate the distance to the passed point
  , distance: function(x, y) {
      return this.minus(x, y).norm()
    }
  }

})

SVG.extend(SVG.Element, {

  // Get point
  point: function(x, y) {
    return new SVG.Point(x,y).transform(this.screenCTM().inverse());
  }

})
