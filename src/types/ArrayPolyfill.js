/* eslint no-new-func: "off" */
export const subClassArray = (function () {
  try {
    // try es6 subclassing
    return Function('name', 'baseClass', '_constructor', [
      'baseClass = baseClass || Array',
      'return {',
      '  [name]: class extends baseClass {',
      '    constructor (...args) {',
      '      super(...args)',
      '      _constructor && _constructor.apply(this, args)',
      '    }',
      '  }',
      '}[name]'
    ].join('\n'))
  } catch (e) {
    // Use es5 approach
    return (name, baseClass = Array, _constructor) => {
      const Arr = function () {
        baseClass.apply(this, arguments)
        _constructor && _constructor.apply(this, arguments)
      }

      Arr.prototype = Object.create(baseClass.prototype)
      Arr.prototype.constructor = Arr

      Arr.prototype.map = function (fn) {
        const arr = new Arr()
        arr.push.apply(arr, Array.prototype.map.call(this, fn))
        return arr
      }

      return Arr
    }
  }
})()
