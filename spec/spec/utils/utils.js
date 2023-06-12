/* globals describe, expect, it, beforeEach, jasmine */

import {
  map,
  filter,
  radians,
  degrees,
  camelCase,
  unCamelCase,
  capitalize,
  proportionalSize,
  getOrigin
} from '../../../src/utils/utils.js'

const { any } = jasmine

describe('utils.js', function () {
  describe('map()', function () {
    var arr1
    var arr2

    beforeEach(function () {
      arr1 = [1, 2, 3, 4]
      arr2 = map(arr1, function (el) {
        return el * 2
      })
    })

    it('returns a new array', function () {
      expect(arr2).toEqual(any(Array))
      expect(arr2).not.toBe(arr1)
    })

    it('executes a function on every element and returns the result in a new array', function () {
      expect(arr2).toEqual([2, 4, 6, 8])
    })
  })

  describe('filter()', function () {
    var arr1
    var arr2

    beforeEach(function () {
      arr1 = [1, 2, 3, 4]
      arr2 = filter(arr1, function (el) {
        return el % 2 === 0
      })
    })

    it('returns a new array', function () {
      expect(arr2).toEqual(any(Array))
      expect(arr2).not.toBe(arr1)
    })

    it('filters elements by function', function () {
      expect(arr2).toEqual([2, 4])
    })
  })

  describe('radians()', function () {
    it('converts degrees to radians', function () {
      expect(radians(270)).toBe(1.5 * Math.PI)
      expect(radians(90)).toBe(Math.PI / 2)
    })

    it('caps at 360 degrees', function () {
      expect(radians(360)).toBe(0)
      expect(radians(360 + 180)).toBe(Math.PI)
    })
  })

  describe('degrees()', function () {
    it('converts radians to degrees', function () {
      expect(degrees(1.5 * Math.PI)).toBe(270)
      expect(degrees(Math.PI / 2)).toBe(90)
    })

    it('caps at 2 PI', function () {
      expect(degrees(2 * Math.PI)).toBe(0)
      expect(degrees(3 * Math.PI)).toBe(180)
    })
  })

  describe('camelCase()', function () {
    it('converts dash-case and PascalCase to camelCase', function () {
      var dash1 = 'dash-1'
      var dashTwo = 'dash-two'
      var camelOne = 'camelOne'
      var pascalOne = 'PascalOne'
      var mixOne = 'mix-One'

      expect(camelCase(dash1)).toBe('dash1')
      expect(camelCase(dashTwo)).toBe('dashTwo')
      expect(camelCase(camelOne)).toBe('camelone')
      expect(camelCase(pascalOne)).toBe('pascalone')
      expect(camelCase(mixOne)).toBe('mixOne')
    })
  })

  describe('unCamelCase()', function () {
    it('converts camelCase to dash-case', function () {
      var dash1 = 'dash-1'
      var dashTwo = 'dash-two'
      var camelOne = 'camelOne'
      var pascalOne = 'PascalOne'

      expect(unCamelCase(dash1)).toBe('dash-1')
      expect(unCamelCase(dashTwo)).toBe('dash-two')
      expect(unCamelCase(camelOne)).toBe('camel-one')
      expect(unCamelCase(pascalOne)).toBe('-pascal-one')
    })
  })

  describe('capitalize()', function () {
    it('capitalizes the first letter', function () {
      var dash1 = 'dash-1'
      var dashTwo = 'dash-two'
      var camelOne = 'camelOne'
      var pascalOne = 'PascalOne'

      expect(capitalize(dash1)).toBe('Dash-1')
      expect(capitalize(dashTwo)).toBe('Dash-two')
      expect(capitalize(camelOne)).toBe('CamelOne')
      expect(capitalize(pascalOne)).toBe('PascalOne')
    })
  })

  describe('proportionalSize()', function () {
    var box = { width: 150, height: 100 }
    var el = { bbox: () => ({ width: 200, height: 100 }) }

    it('calculates height proportionally', function () {
      expect(proportionalSize(el, 400, null)).toEqual({
        width: 400,
        height: 200
      })
    })

    it('calculates width proportionally', function () {
      expect(proportionalSize(el, null, 200)).toEqual({
        width: 400,
        height: 200
      })
    })

    it('prefers passed box over element', function () {
      expect(proportionalSize(el, 300, null, box)).toEqual({
        width: 300,
        height: 200
      })
      expect(proportionalSize(el, null, 200, box)).toEqual({
        width: 300,
        height: 200
      })
    })
  })

  describe('getOrigin()', function () {
    var el = { bbox: () => ({ width: 200, height: 100, x: 300, y: 400 }) }

    it('gets the origin from [ox, oy]', function () {
      var origin = { origin: [10, 20] }
      expect(getOrigin(origin, el)).toEqual([10, 20])
    })

    it('gets the origin from [ox, oy] as strings', function () {
      var origin = { origin: ['center', 'top'] }
      expect(getOrigin(origin, el)).toEqual([400, 400])
    })

    it('gets the origin from {x, y}', function () {
      var origin = { origin: { x: 10, y: 20 } }
      expect(getOrigin(origin, el)).toEqual([10, 20])
    })

    it('gets the origin from {ox, oy}', function () {
      var origin = { ox: 10, oy: 20 }
      expect(getOrigin(origin, el)).toEqual([10, 20])
    })

    it('gets the origin from {ox, oy} as strings', function () {
      var origin = { ox: 'center', oy: 'top' }
      expect(getOrigin(origin, el)).toEqual([400, 400])
    })

    it('gets the origin from {originX, originY}', function () {
      var origin = { originX: 10, originY: 20 }
      expect(getOrigin(origin, el)).toEqual([10, 20])
    })

    it('gets the origin from {originX, originY} as strings', function () {
      var origin = { originX: 'center', originY: 'top' }
      expect(getOrigin(origin, el)).toEqual([400, 400])
    })

    it('gets the origin from string', function () {
      var origin = { origin: 'center top' }
      expect(getOrigin(origin, el)).toEqual([400, 400])
    })

    it('gets the origin from number', function () {
      var origin = { origin: 5 }
      expect(getOrigin(origin, el)).toEqual([5, 5])
    })
  })
})
