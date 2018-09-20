/* global arrayToMatrix getOrigin */

SVG.extend(SVG.Element, {
  // Reset all transformations
  untransform: function () {
    return this.attr('transform', null)
  },

  // merge the whole transformation chain into one matrix and returns it
  matrixify: function () {
    var matrix = (this.attr('transform') || '')
      // split transformations
      .split(SVG.regex.transforms).slice(0, -1).map(function (str) {
        // generate key => value pairs
        var kv = str.trim().split('(')
        return [kv[0],
          kv[1].split(SVG.regex.delimiter)
            .map(function (str) { return parseFloat(str) })
        ]
      })
      .reverse()
      // merge every transformation into one matrix
      .reduce(function (matrix, transform) {
        if (transform[0] === 'matrix') {
          return matrix.lmultiply(arrayToMatrix(transform[1]))
        }
        return matrix[transform[0]].apply(matrix, transform[1])
      }, new SVG.Matrix())

    return matrix
  },

  // add an element to another parent without changing the visual representation on the screen
  toParent: function (parent) {
    if (this === parent) return this
    var ctm = this.screenCTM()
    var pCtm = parent.screenCTM().inverse()

    this.addTo(parent).untransform().transform(pCtm.multiply(ctm))

    return this
  },

  // same as above with parent equals root-svg
  toDoc: function () {
    return this.toParent(this.doc())
  }
})

SVG.extend(SVG.Element, {

  // Add transformations
  transform: function (o, relative) {
    // Act as a getter if no object was passed
    if (o == null || typeof o === 'string') {
      var decomposed = new SVG.Matrix(this).decompose()
      return decomposed[o] || decomposed
    }

    if (!isMatrixLike(o)) {
      // Set the origin according to the defined transform
      o = {...o, origin: getOrigin(o, this)}
    }

    // The user can pass a boolean, an SVG.Element or an SVG.Matrix or nothing
    var cleanRelative = relative === true ? this : (relative || false)
    var result = new SVG.Matrix(cleanRelative).transform(o)
    return this.attr('transform', result)
  }
})
