
SVG.Morphable = SVG.invent({
  create: function (stepper) {
    // FIXME: the default stepper does not know about easing
    this._stepper = stepper || new SVG.Ease('-')

    this._from = null
    this._to = null
    this._type = null
    this._context = null
    this.modifier = function(arr) { return arr }
    this._morphObj = null
  },

  extend: {

    from: function (val) {
      if(val == null)
        return this._from

      this._from = this._set(val)
      return this
    },

    to: function (val, modifier) {
      if(val == null)
        return this._to

      this._to = this._set(val)
      this.modifier = modifier || this.modifier
      return this
    },

    type: function (type) {
      // getter
      if (type == null)
        return this._type

      // setter
      this._type = type
      return this
    },

    _set: function (value) {

      if(!this._type)  {
        var type = typeof value

        if (type === 'number') {
          this.type(SVG.Number)

        } else if (type === 'string') {

          if (SVG.Color.isColor(value)) {
            this.type(SVG.Color)

          } else if (SVG.regex.delimiter.test(value)) {
            this.type(SVG.regex.pathLetters.test(value)
              ? SVG.PathArray
              : SVG.Array
            )

          } else if (SVG.regex.numberAndUnit.test(value)) {
            this.type(SVG.Number)

          } else {
            this.type(SVG.Morphable.NonMorphable)
          }

        } else if (SVG.MorphableTypes.indexOf(value.constructor) > -1) {
          this.type(value.constructor)

        } else if (Array.isArray(value)) {
          this.type(SVG.Array)

        } else if (type === 'object') {
          this.type(SVG.Morphable.ObjectBag)

        } else {
          this.type(SVG.Morphable.NonMorphable)
        }
      }

      var result = (new this._type(value)).toArray()
      this._morphObj = this._morphObj || new this._type()
      this._context = this._context
        || Array.apply(null, Array(result.length)).map(Object)
      return result
    },

    stepper: function (stepper) {
      if(stepper == null) return this._stepper
      this._stepper = stepper
      return this
    },

    done: function () {
      var complete = this._context
        .map(this._stepper.done)
        .reduce(function (last, curr) {
          return last && curr
        }, true)
      return complete
    },

    at: function (pos) {
      var _this = this

      // for(var i = 0, len = this._from.length; i < len; ++i) {
      //   arr.push(this.stepper(this._from[i], this._to[i]))
      // }

      return this._morphObj.fromArray(
        this.modifier(
          this._from.map(function (i, index) {
            return _this._stepper.step(i, _this._to[index], pos, _this._context[index], _this._context)
          })
        )
      )
    },

    valueOf: function () {
      return this._value
    }
  }
})

SVG.Morphable.NonMorphable = SVG.invent({
  create: function (val) {
    val = Array.isArray(val) ? val[0] : val
    this.value = val
  },

  extend: {
    valueOf: function () {
      return this.value
    },

    toArray: function () {
      return [this.value]
    }
  }
})

SVG.Morphable.TransformBag = SVG.invent({
  create: function (obj) {
    if(Array.isArray(obj)) {
      obj = {
        scaleX: obj[0],
        scaleY: obj[1],
        shear: obj[2],
        rotate: obj[3],
        translateX: obj[4],
        translateY: obj[5]
      }
    }
    this.value = new SVG.Matrix(obj)
  },

  extend: {
    valueOf: function () {
      return this.value
    },

    toArray: function (){
      var v = this.value.decompose()

      return [
        v.scaleX,
        v.scaleY,
        v.shear,
        v.rotate,
        v.translateX,
        v.translateY
      ]
    }
  }
})


SVG.Morphable.ObjectBag = SVG.invent({
  create: function (objOrArr) {
    this.values = []

    if(Array.isArray(objOrArr)) {
      this.values = objOrArr
      return
    }

    var keys = []

    for(var i in objOrArr) {
      keys.push(i)
    }

    for(var i = 0, len = keys.length; i < len; ++i) {
      this.values.push(keys[i])
      this.values.push(objOrArr[keys[i]])
    }
  },

  extend: {
    valueOf: function () {
      var obj = {}
      var arr = this.values

      for(var i = 0, len = arr.length; i < len; i+=2) {
        obj[arr[i]] = arr[i+1]
      }

      return obj
    },

    toArray: function (){
      return this.values
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
    return new SVG.Morphable()
      .type(this.constructor)
      .from(this.valueOf())
      .to(val, args)
  },
  fromArray: function (arr) {
    this.constructor.call(this, arr)
    return this
  }
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
///     val = new Morphable().to('#0ff').stepper(stepper)
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
