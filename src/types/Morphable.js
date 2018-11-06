import { Ease } from '../animation/Controller.js'
import {
  delimiter,
  numberAndUnit,
  pathLetters
} from '../modules/core/regex.js'
import { extend } from '../utils/adopter.js'
import Color from './Color.js'
import PathArray from './PathArray.js'
import SVGArray from './SVGArray.js'
import SVGNumber from './SVGNumber.js'

export default class Morphable {
  constructor (stepper) {
    // FIXME: the default stepper does not know about easing
    this._stepper = stepper || new Ease('-')

    this._from = null
    this._to = null
    this._type = null
    this._context = null
    this._morphObj = null
  }

  from (val) {
    if (val == null) {
      return this._from
    }

    this._from = this._set(val)
    return this
  }

  to (val) {
    if (val == null) {
      return this._to
    }

    this._to = this._set(val)
    return this
  }

  type (type) {
    // getter
    if (type == null) {
      return this._type
    }

    // setter
    this._type = type
    return this
  }

  _set (value) {
    if (!this._type) {
      var type = typeof value

      if (type === 'number') {
        this.type(SVGNumber)
      } else if (type === 'string') {
        if (Color.isColor(value)) {
          this.type(Color)
        } else if (delimiter.test(value)) {
          this.type(pathLetters.test(value)
            ? PathArray
            : SVGArray
          )
        } else if (numberAndUnit.test(value)) {
          this.type(SVGNumber)
        } else {
          this.type(NonMorphable)
        }
      } else if (morphableTypes.indexOf(value.constructor) > -1) {
        this.type(value.constructor)
      } else if (Array.isArray(value)) {
        this.type(SVGArray)
      } else if (type === 'object') {
        this.type(ObjectBag)
      } else {
        this.type(NonMorphable)
      }
    }

    var result = (new this._type(value)).toArray()
    this._morphObj = this._morphObj || new this._type()
    this._context = this._context ||
      Array.apply(null, Array(result.length)).map(Object)
    return result
  }

  stepper (stepper) {
    if (stepper == null) return this._stepper
    this._stepper = stepper
    return this
  }

  done () {
    var complete = this._context
      .map(this._stepper.done)
      .reduce(function (last, curr) {
        return last && curr
      }, true)
    return complete
  }

  at (pos) {
    var _this = this

    return this._morphObj.fromArray(
      this._from.map(function (i, index) {
        return _this._stepper.step(i, _this._to[index], pos, _this._context[index], _this._context)
      })
    )
  }
}

export class NonMorphable {
  constructor (...args) {
    this.init(...args)
  }

  init (val) {
    val = Array.isArray(val) ? val[0] : val
    this.value = val
  }

  valueOf () {
    return this.value
  }

  toArray () {
    return [this.value]
  }
}

export class TransformBag {
  constructor (...args) {
    this.init(...args)
  }

  init (obj) {
    if (Array.isArray(obj)) {
      obj = {
        scaleX: obj[0],
        scaleY: obj[1],
        shear: obj[2],
        rotate: obj[3],
        translateX: obj[4],
        translateY: obj[5],
        originX: obj[6],
        originY: obj[7]
      }
    }

    Object.assign(this, TransformBag.defaults, obj)
  }

  toArray () {
    var v = this

    return [
      v.scaleX,
      v.scaleY,
      v.shear,
      v.rotate,
      v.translateX,
      v.translateY,
      v.originX,
      v.originY
    ]
  }
}

TransformBag.defaults = {
  scaleX: 1,
  scaleY: 1,
  shear: 0,
  rotate: 0,
  translateX: 0,
  translateY: 0,
  originX: 0,
  originY: 0
}

export class ObjectBag {
  constructor (...args) {
    this.init(...args)
  }

  init (objOrArr) {
    this.values = []

    if (Array.isArray(objOrArr)) {
      this.values = objOrArr
      return
    }

    var entries = Object.entries(objOrArr || {}).sort((a, b) => {
      return a[0] - b[0]
    })

    this.values = entries.reduce((last, curr) => last.concat(curr), [])
  }

  valueOf () {
    var obj = {}
    var arr = this.values

    for (var i = 0, len = arr.length; i < len; i += 2) {
      obj[arr[i]] = arr[i + 1]
    }

    return obj
  }

  toArray () {
    return this.values
  }
}

const morphableTypes = [
  NonMorphable,
  TransformBag,
  ObjectBag
]

export function registerMorphableType (type = []) {
  morphableTypes.push(...[].concat(type))
}

export function makeMorphable () {
  extend(morphableTypes, {
    to (val, args) {
      return new Morphable()
        .type(this.constructor)
        .from(this.valueOf())
        .to(val, args)
    },
    fromArray (arr) {
      this.init(arr)
      return this
    }
  })
}
