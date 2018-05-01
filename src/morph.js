SVG.Morphable = SVG.invent({
  create: function (controller) {
    // FIXME: the default controller does not know about easing
    this._controller = controller || function (from, to, pos) {
      return from + (to - from) * pos
    }
  },

  extend: {

    from: function (val) {
      this._from = this._set(val)
      return this
    },

    to: function (val, modifier) {
      this._to = this._set(val)
      this.modifier = modifier || function(arr) { return arr }
      return this
    },

    type: function (type) {
      this._type = type

      // non standard morphing
      if(type instanceof SVG.Morphable.NonMorphable) {
        this._controller = function (from, to, pos) {
          return pos < 1 ? from : to
        }
      }
      return this
    },

    _set: function (value) {

      if(!this._type)  {
        if (typeof value == 'number') {
          this.type(SVG.Number)

        } else if (SVG.Color.isColor(value)) {
          this.type(SVG.Color)

        } else if (SVG.regex.delimiter.test(value)) {
          this.type(SVG.regex.pathLetters.test(value)
            ? SVG.PathArray
            : SVG.Array
          )

        } else if (SVG.regex.numberAndUnit.test(value)) {
          this.type(SVG.Number)

        } else if (value in SVG.MorphableTypes) {
          this.type(value.constructor)

        } else {
          this.type(SVG.Morphable.NonMorphable)
        }
      }

      return (new this._type(value)).toArray()
    },

    controller: function (controller) {
      this._controller = controller
    },

    at: function (pos) {

      var _this = this

      modifier = this.modifier || function(el) { return el }

      // for(var i = 0, len = this._from.length; i < len; ++i) {
      //   arr.push(this.controller(this._from[i], this._to[i]))
      // }

      return this._type.prototype.fromArray(modifier(this._from.map(function (i, index) {
        return _this._controller(i, _this._to[index], pos)
      })))
    },

    valueOf: function () {
      return this._value
    }
  }
})

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
    },

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
  }
})


SVG.Morphable.ObjectBag = SVG.invent({
  create: function (obj) {
    this.values = []
    this.keys = []

    for(var i in obj) {
      this.values.push(obj[i])
      this.keys.push(i)
    }
  },

  extend: {
    valueOf: function () {
      return this.values
    },

    toArray: function (){
      return this.values
    },

    fromArray: function (arr) {
      var obj = {}

      for(var i = 0, len = arr.length; i < len; ++i) {
        obj[this.keys[i]] = arr[i]
      }

      return obj
    }
  }
})

SVG.MorphableTypes = [
  SVG.Number,
  SVG.Color,
  SVG.Box,
  SVG.Matrix,
  SVG.Array,
  SVG.PointArray,
  SVG.PathArray,
  SVG.Morphable.NonMorphable,
  SVG.Morphable.TransformBag,
  SVG.Morphable.ObjectBag,
]

SVG.extend(SVG.MorphableTypes, {
  to: function (val, args) {
    return new SVG.Morphable().type(this.constructor).to(val, args)
  },
})


// animate().ease(function(pos) { return pos})
// function Ease (func) {
//   return function eased (fromOrCurr, to, pos) {
//     return fromOrCurr + func(pos) * (to - fromOrCurr) // normal easing
//   }
// }


///
/// el.animate()
///   .fill('#00f')
///   ---->> timeline.fill
///     val = new Morphable().to('#0ff').controller(controller)
///     func init() {
///       val.from(el.fill())
///     }
///     func run (pos) {
///       curr = val.at(pos)
///       el.fill(curr)
///     }
///     this.queue(init, run)




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





// C R x = D C x = A x
//
//     (C R inv(C)) C x
//
//
// C R = D C
// D = C R inv(C)


/*
absolute -> start at current - {affine params}
relative -> start at 0 always - {random stuff}
*/





/**
    INIT
     - save the current transformation

    ELEMENT TIMELINE (one timeline per el)
    - Reads the current transform and save it to the transformation stack
    - Runs all available runners, runners will:
      - Modify their transformation on the stack
      - Mark their transformation as complete
      - After each runner, we group the matrix (not for now)
    - After running the runners, we bundle all contiguous transformations into
      a single transformation


    - transformtionstack is like this: [RunnerB, Matrix, RunnerC]
      - skip merging for now (premature blabla)


el.loop({times: 5, swing: true, wait: [20, 50]})

el.opacity(0)
  .animate(300).opacity(1)
  .animate(300, true).scale(5).reverse()


for(var i = 0; i < 7; ++i)
  circle.clone()
    .scale(3).rotate(0)
    .loop({swing: false, wait: 500})
    .scale(1)
    .rotate(360)
    .delay(1000)
    .animate(500, 'swingOut')
    .scale(3)
}

fn () => {
  el.animate().stroke('dashoffset', 213).scale(1)
    .delay(1)
    .animate().scale(2)
    .after(fn)
}



When you start an element has a base matrix B - which starts as the identity

  If you modify the matrix, then we have:

    T U V W X B x
      . .   .

    runner.step()

    for all runners in stack:
      if(runner is done) repalce with matrix

    if(2 matrix next to eachother are done) {

    }

What if

/// RunnerA
el.animate()
  .transform({rotate: 30, scale: 2})
  .transform({rotate: 500}, true)

f| -----A-----
s|   --------B---------
t|           ---------C-------

**/
