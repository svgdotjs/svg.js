SVG.Morphable = SVG.invent{
  create: function (controller) {
    this.controller = controller || function (from, to, pos) {
      return pos < 1 ? from : to
    }
  },

  extend: {

    from: function (val) {
      this._from = this._set(val)
      return this
    }

    to: function (val, modifier) {
      this._to = this._set(val)
      this.modifier = modifier
      return this
    }

    type: function (type) {
      this._type = type
      return this
    }

    _set: function (value) {

      if(!this._type)  {
        if (SVG.Color.isColor(val)) {
          this._type = SVG.Color

        } else if (SVG.regex.delimiter.test(val)) {

          this._type = SVG.regex.pathLetters.test(val)
            ? SVG.PathArray
            : SVG.Array

        } else if (SVG.regex.numberAndUnit.test(val)) {
          this._type = SVG.Number

        } else if (value in SVG.MorphableTypes) {
          this._type = value.constructor

        // } else if (typeof value == 'object') {
        //   this._type = SVG.Morphable.TransformBag
        } else {
          this._type = SVG.Morphable.NonMorphable
        }
      }

      return (new this._type(value)).toArray()
    }

    controller: function (controller) {
      this._controller = controller
    }

    at: function (pos) {

      var _this = this

      // for(var i = 0, len = this._from.length; i < len; ++i) {
      //   arr.push(this.controller(this._from[i], this._to[i]))
      // }

      return this.type.fromArray(this.modifier(this._from.map(function (i, index) {
        return _this.controller(i, _this._to[i], pos)
      })))
    },

    valueOf: function () {
      return this._value
    }
  }
}

SVG.Morphable.NonMorphable = SVG.invent({
  create: function (val) {
    this.value = val
  },

  extend: {
    valueOf: function () {
      return this.value
    },

    toArray: function () {
      return [this.value]
    },

    fromArray: function (arr) {
      return new SVG.Morphable.NonMorphable(arr[0])
    }
  }
})

SVG.Morphable.TransformBag = SVG.invent({
  create: function (val) {
    this.value = new Matrix(val).decompose()
  },

  extend: {
    valueOf: function () {
      return this.value
    },

    toArray: function (){
      var v = this.value

      return [
        v.scaleX,
        v.scaleY,
        v.shear,
        v.rotate,
        v.translateX,
        v.translateY
      ]
    }

    fromArray: function (arr) {
      return new SVG.Morphable.TransformBag({
        scaleX: arr[0],
        scaleY: arr[1],
        shear: arr[2],
        rotate: arr[3],
        translateX: arr[4],
        translateY: arr[5]
      })
  }
})

SVG.MorphableTypes = [SVG.Number, SVG.Color, SVG.Box, SVG.Matrix, SVG.Morphable.NonMorphable, SVG.Morphable.TransformBag]
SVG.extend(SVG.MorphableTypes, {
  to: (item, args) => {
    let a = new SVG.Morphable().type(this.constructor).to(item, args)
  },
})




// - Objects are just variable bags
// - morph rerutrns a morphable. No state on normal objects (like SVG.Color)
// - Objects can be represented as Array (with toArray())
// - Objects have an unmorph/fromarray function which converts it back to a normal object

// var b = new Color('#fff')
// b.morph('#000') === new Morph(b).to('#000')

// sweet = Color('#fff')
// dark = Color('#fef')
// sweet.to(dark, 'hsl')

// angle = Number(30)
// lastAngle = Number(300)
// angle.to(lastAngle, cyclic)

// mat1 = Matrix().transform({rotation: 30, scale: 0})
// mat2 = Matrix(30, 40, 50, 60, 10, 20)
// mat1.to(mat2)



/**
 ** absolute transformations
 **/

// M v -----|-----(D M v = I v)------|----->  T v
//
// 1. define the final state (T) and decompose it (once) t = [tx, ty, the, lam, sy, sx]
// 2. on every frame: pull the current state of all previous transforms (M - m can change)
//   and then write this as m = [tx0, ty0, the0, lam0, sy0, sx0]
// 3. Find the interpolated matrix I(pos) = m + pos * (t - m)
//   - Note I(0) = M
//   - Note I(1) = T
// 4. Now you get the delta matrix as a result: D = I * inv(M)




el.animate().trasform({rotate: 720, scale: 2}, true)

el.animate().scale(2).rotate(720)

el.animate().transform({origin: traslate, })

absolute -> start at current - {affine params}
relative -> start at 0 always - {random stuff}


 |> object.toArray()
 |> (_) => _.map(() => {})
 |> modifier
 |> fromArray

function transform(transforms, relative, affine) {
  affine = transforms.affine || affine
  relative = transforms.relative || relative

  // 1.  define the final state (T) and decompose it (once) t = [tx, ty, the, lam, sy, sx]
  var morpher = new SVG.Morphable.TransformBag().to(transforms)

  // make sure you have an identity matrix defined as default for relative transforms
  var morpher.from()
  var el = this.target()

  var initFn = relative ? function() {} : function() {
    // 2. on every frame: pull the current state of all previous transforms (M - m can change)
    morpher.from(el.transform())
  }

  this.queue(initFn, function (pos) {
    // 3. Find the interpolated matrix I(pos) = m + pos * (t - m)
    //   - Note I(0) = M
    //   - Note I(1) = T
    var matrix = morpher.at(pos)

    if(!relative) {
      // 4. Now you get the delta matrix as a result: D = I * inv(M)
      matrix = matrix.multiply(el.transform().inverse())
    }

    el.pushTransform(matrix)
  })
}


SVG.Morphable.TransformList = Object

  if(affine) {
    var morpher = new Matrix().to(transforms)
  }

  if(input is typeof plain object) {
    // deal with a ttransformList
    this.type = SVG.Morphable.TransformList
  }

  var morpher = new Morphable(modifier).to(transforms)

  this.queue(() => {
    morpher.from(this.transform())
  }, (pos) => {
    var matrix = morpher.at(pos)
    el.transform(matrix)
  })

el.transform({rotate: 720, sclae: 2, })

el.scale(2)
  .rotate(720)

from -> 300
to -> [295, 305]

from -> 358
to -> 1



from -> 300
to -> 30

function transform(transforms, affine) {

  if(relative) {

    var morpher = new Morphable().to(transforms, affine)
    this.queue(() => {}, (pos) => {
      var matrix = morpher.at(pos)
      el.transform(matrix)
    })

  } else {

    this.queue(() => {
      morpher
    }, (pos) => {
      var matrix = morpher.at(pos)
      el.transform(matrix)
    })

  }
}



// el.animate().rotate(480)
function rotate(val) { // Relative
  var morpher = new Morphable().from(0).to(val)
  this.queue(() => {}, (pos)=> {
    var rotation = morpher.at(pos)
    el.rotate(rotation)
  })
}
// morph = new Morphable(0).to(50, [0, 360]) -> in timeline
//
//
//
// on each frame
// el.rotate(morph.at(pos))


Morph.modifiers = {

  hsb:


}


new Color(#fff).to('#000', 'hsb')

at returns a matrix anyway

new Number()


el.animate().fill('#000', 'hsb')
function fill(val, colorspace) {
  var morpher = new Morphable().to(val, colorspace || 'rgb')

  this.queue((val) => {
    morpher.from(val)
  }, (pos)=> {
    var color = morpher.at(pos)
    el.fill(color)
  })
}

//
// Number.toArray() -> [3]
// Color.toArray() -> [red, green, blue]
//
//
//
//
//
//
//
//
//









new Color(30, 50, 40).toArray()




new PathArray([['M', 0, 3], ['L', 4, 5]]).morph(5, 3, 2, 8, 5)

controller = (s, e, p)=> {return s + (e-s) * p}

[['M', 0, 3], ['L', 4, 5], ['A', 120, 120, 1, 0]]


['1', '2', '3'] => parseFloat()


rect.anim()
  .color('blue')
  .anim()
  .color(new Color('red'))



a = new SVG.Color('#3f2').to('#5f4').at(0.3)


new Morphable('#3f2').to('#5f4').at(0.4)







/*
zoom(level, point) {
  let morpher = SVG.Number(level).controller(this.controller)
  this.queue(
    () => {morpher = morpher.from(element.zoom())},
    (pos) => {element.zoom(morpher.at(pos), point)}
  )
  return this
}
*/
