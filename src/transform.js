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
  },
})

SVG.extend(SVG.Element, {

  // Add transformations
  transform: function (o, cyOrRel) {
    // Get the bounding box of the element with no transformations applied
    var bbox = this.bbox()

    // Act as a getter if no object was passed
    if (o == null || typeof o === 'string') {
      var decomposed = new SVG.Matrix(this).decompose()
      return decomposed[o] || decomposed

    // Let the user pass in a matrix as well
    } else if (o.a != null) {
      // Construct a matrix from the first parameter
      var matrix = new SVG.Matrix(o)

      // If we have a relative matrix, we just apply the old matrix
      if (cyOrRel != null) {
        var oldMatrix = new SVG.Matrix(this)
        matrix = matrix.multiply(oldMatrix)
      }

      // Apply the matrix directly
      return this.attr('transform', matrix)

    // Allow the user to define the origin with a string
    } else if (typeof o.origin === 'string' ||
      (o.origin == null && o.ox == null && o.oy == null)
    ) {
      // Get the bounding box and string to use in our calculations
      var string = typeof o.origin === 'string'
        ? o.origin.toLowerCase().trim()
        : 'center' // We want the center by default
      var height = bbox.height
      var width = bbox.width
      var x = bbox.x
      var y = bbox.y

      // Set the bounds eg : "bottom-left", "Top right", "middle" etc...
      o.ox = string.includes('left') ? x
        : string.includes('right') ? x + width
        : x + width / 2
      o.oy = string.includes('top') ? y
        : string.includes('bottom') ? y + height
        : y + height / 2

      // Make sure we only pass ox and oy
      o.origin = null
    }

    // The user can pass a boolean, an SVG.Element or an SVG.Matrix or nothing
    var result = new SVG.Matrix(cyOrRel === true ? this : cyOrRel).transform(o)
    var matrixString = result.toString()

    // Apply the result directly to this matrix
    return this.attr('transform', matrixString)
  }
})

SVG.extend(SVG.FX, {
  transform: function (o, relative) {

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

// TODO: DESTROY
//       =======
//
//
// SVG.Transformation = SVG.invent({
//
//   create: function(source, inversed){
//
//     if(arguments.length > 1 && typeof inversed != 'boolean'){
//       return this.constructor.call(this, [].slice.call(arguments))
//     }
//
//     if(Array.isArray(source)){
//       for(var i = 0, len = this.arguments.length; i < len; ++i){
//         this[this.arguments[i]] = source[i]
//       }
//     } else if(typeof source == 'object'){
//       for(var i = 0, len = this.arguments.length; i < len; ++i){
//         this[this.arguments[i]] = source[this.arguments[i]]
//       }
//     }
//
//     this.inversed = false
//
//     if(inversed === true){
//       this.inversed = true
//     }
//
//   }
//
// , extend: {
//
//     arguments: []
//   , method: ''
//
//   , at: function(pos){
//
//       var params = []
//
//       for(var i = 0, len = this.arguments.length; i < len; ++i){
//         params.push(this[this.arguments[i]])
//       }
//
//       var m = this._undo || new SVG.Matrix()
//
//       m = new SVG.Matrix().morph(SVG.Matrix.prototype[this.method].apply(m, params)).at(pos)
//
//       return this.inversed ? m.inverse() : m
//
//     }
//
//   , undo: function(o){
//       for(var i = 0, len = this.arguments.length; i < len; ++i){
//         o[this.arguments[i]] = typeof this[this.arguments[i]] == 'undefined' ? 0 : o[this.arguments[i]]
//       }
//
//       // The method SVG.Matrix.extract which was used before calling this
//       // method to obtain a value for the parameter o doesn't return a cx and
//       // a cy so we use the ones that were provided to this object at its creation
//       o.cx = this.cx
//       o.cy = this.cy
//
//       this._undo = new SVG[capitalize(this.method)](o, true).at(1)
//
//       return this
//     }
//
//   }
//
// })
//
// SVG.Translate = SVG.invent({
//
//   parent: SVG.Matrix
// , inherit: SVG.Transformation
//
// , create: function(source, inversed){
//     this.constructor.apply(this, [].slice.call(arguments))
//   }
//
// , extend: {
//     arguments: ['transformedX', 'transformedY']
//   , method: 'translate'
//   }
//
// })
//
// SVG.Rotate = SVG.invent({
//
//   parent: SVG.Matrix
// , inherit: SVG.Transformation
//
// , create: function(source, inversed){
//     this.constructor.apply(this, [].slice.call(arguments))
//   }
//
// , extend: {
//     arguments: ['rotation', 'cx', 'cy']
//   , method: 'rotate'
//   , at: function(pos){
//       var m = new SVG.Matrix().rotate(new SVG.Number().morph(this.rotation - (this._undo ? this._undo.rotation : 0)).at(pos), this.cx, this.cy)
//       return this.inversed ? m.inverse() : m
//     }
//   , undo: function(o){
//       this._undo = o
//       return this
//     }
//   }
//
// })
//
// SVG.Scale = SVG.invent({
//
//   parent: SVG.Matrix
// , inherit: SVG.Transformation
//
// , create: function(source, inversed){
//     this.constructor.apply(this, [].slice.call(arguments))
//   }
//
// , extend: {
//     arguments: ['scaleX', 'scaleY', 'cx', 'cy']
//   , method: 'scale'
//   }
//
// })
//
// SVG.Skew = SVG.invent({
//
//   parent: SVG.Matrix
// , inherit: SVG.Transformation
//
// , create: function(source, inversed){
//     this.constructor.apply(this, [].slice.call(arguments))
//   }
//
// , extend: {
//     arguments: ['skewX', 'skewY', 'cx', 'cy']
//   , method: 'skew'
//   }
//
// })
