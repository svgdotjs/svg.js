/* global arrayToMatrix */

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

    // Set the origin according to the defined transform
    o.origin = getOrigin (o, this)

    // The user can pass a boolean, an SVG.Element or an SVG.Matrix or nothing
    var cleanRelative = relative === true ? this : (relative || false)
    var result = new SVG.Matrix(cleanRelative).transform(o)
    return this.attr('transform', result)
  }
})

SVG.extend(SVG.Timeline, {
  transform: function (o, relative, affine) {

  //   // get target in case of the fx module, otherwise reference this
  //   var target = this.target()
  //     , matrix, bbox
  //
  //   // act as a getter
  //   if (typeof o !== 'object') {
  //     // get current matrix
  //     matrix = new SVG.Matrix(target).extract()
  //
  //     return typeof o === 'string' ? matrix[o] : matrix
  //   }
  //
  //   // ensure relative flag
  //   relative = !!relative || !!o.relative
  //
  //   // act on matrix
  //   if (o.a != null) {
  //     matrix = new SVG.Matrix(o)
  //
  //   // act on rotation
  //   } else if (o.rotation != null) {
  //     // ensure centre point
  //     ensureCentre(o, target)
  //
  //     // apply transformation
  //     matrix = new SVG.Rotate(o.rotation, o.cx, o.cy)
  //
  //   // act on scale
  //   } else if (o.scale != null || o.scaleX != null || o.scaleY != null) {
  //     // ensure centre point
  //     ensureCentre(o, target)
  //
  //     // ensure scale values on both axes
  //     o.scaleX = o.scale != null ? o.scale : o.scaleX != null ? o.scaleX : 1
  //     o.scaleY = o.scale != null ? o.scale : o.scaleY != null ? o.scaleY : 1
  //
  //     matrix = new SVG.Scale(o.scaleX, o.scaleY, o.cx, o.cy)
  //
  //   // act on skew
  //   } else if (o.skewX != null || o.skewY != null) {
  //     // ensure centre point
  //     ensureCentre(o, target)
  //
  //     // ensure skew values on both axes
  //     o.skewX = o.skewX != null ? o.skewX : 0
  //     o.skewY = o.skewY != null ? o.skewY : 0
  //
  //     matrix = new SVG.Skew(o.skewX, o.skewY, o.cx, o.cy)
  //
  //   // act on flip
  //   } else if (o.flip) {
  //     if(o.flip == 'x' || o.flip == 'y') {
  //       o.offset = o.offset == null ? target.bbox()['c' + o.flip] : o.offset
  //     } else {
  //       if(o.offset == null) {
  //         bbox = target.bbox()
  //         o.flip = bbox.cx
  //         o.offset = bbox.cy
  //       } else {
  //         o.flip = o.offset
  //       }
  //     }
  //
  //     matrix = new SVG.Matrix().flip(o.flip, o.offset)
  //
  //   // act on translate
  //   } else if (o.x != null || o.y != null) {
  //     matrix = new SVG.Translate(o.x, o.y)
  //   }
  //
  //   if(!matrix) return this
  //
  //   matrix.relative = relative
  //
  //   this.last().transforms.push(matrix)
  //
  //   return this._callStart()
  // }
  //     // ensure scale values on both axes
  //     o.scaleX = o.scale != null ? o.scale : o.scaleX != null ? o.scaleX : 1
  //     o.scaleY = o.scale != null ? o.scale : o.scaleY != null ? o.scaleY : 1
  //
  //     matrix = new SVG.Scale(o.scaleX, o.scaleY, o.cx, o.cy)
  //
  //   // act on skew
  //   } else if (o.skewX != null || o.skewY != null) {
  //     // ensure centre point
  //     ensureCentre(o, target)
  //
  //     // ensure skew values on both axes
  //     o.skewX = o.skewX != null ? o.skewX : 0
  //     o.skewY = o.skewY != null ? o.skewY : 0
  //
  //     matrix = new SVG.Skew(o.skewX, o.skewY, o.cx, o.cy)
  //
  //   // act on flip
  //   } else if (o.flip) {
  //     if (o.flip === 'x' || o.flip === 'y') {
  //       o.offset = o.offset == null ? target.bbox()['c' + o.flip] : o.offset
  //     } else {
  //       if (o.offset == null) {
  //         bbox = target.bbox()
  //         o.flip = bbox.cx
  //         o.offset = bbox.cy
  //       } else {
  //         o.flip = o.offset
  //       }
  //     }
  //
  //     matrix = new SVG.Matrix().flip(o.flip, o.offset)
  //
  //   // act on translate
  //   } else if (o.x != null || o.y != null) {
  //     matrix = new SVG.Translate(o.x, o.y)
  //   }
  //
  //   if (!matrix) return this
  //
  //   matrix.relative = relative
  //
  //   this.last().transforms.push(matrix)
  //
  //   return this._callStart()
  }
})
