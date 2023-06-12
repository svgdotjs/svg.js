/* globals describe, expect, it, jasmine */

import { Array as SVGArray, PointArray, PathArray } from '../../../src/main.js'

const { any } = jasmine

describe('SVGArray.js', () => {
  describe('()', () => {
    it('preallocates memory if only number is passed', () => {
      const arr = new SVGArray(1)
      expect(arr.length).toBe(1)
    })

    it('parses a matrix array correctly to string', () => {
      const array = new SVGArray([
        0.343, 0.669, 0.119, 0, 0, 0.249, -0.626, 0.13, 0, 0, 0.172, 0.334,
        0.111, 0, 0, 0.0, 0.0, 0.0, 1, -0
      ])

      expect(array + '').toBe(
        '0.343 0.669 0.119 0 0 0.249 -0.626 0.13 0 0 0.172 0.334 0.111 0 0 0 0 0 1 0'
      )
    })

    it('parses space separated string and converts it to array', () => {
      expect(new SVGArray('1 2 3 4').valueOf()).toEqual([1, 2, 3, 4])
    })

    it('parses comma separated string and converts it to array', () => {
      expect(new SVGArray('1,2,3,4').valueOf()).toEqual([1, 2, 3, 4])
    })
  })

  describe('reverse()', () => {
    it('reverses the array', () => {
      const array = new SVGArray([1, 2, 3, 4, 5]).reverse()
      expect(array.valueOf()).toEqual([5, 4, 3, 2, 1])
    })

    it('returns itself', () => {
      const array = new SVGArray()
      expect(array.reverse()).toBe(array)
    })
  })

  describe('clone()', () => {
    it('creates a shallow clone of the array', () => {
      const array = new SVGArray([1, 2, 3, 4, 5])
      const clone = array.clone()

      expect(array).toEqual(clone)
      expect(array).not.toBe(clone)
    })

    it('also works with PointArray (one depths clone)', () => {
      const array = new PointArray([
        [1, 2],
        [3, 4],
        [5, 6]
      ])
      const clone = array.clone()

      expect(array).toEqual(clone)
      expect(array).not.toBe(clone)

      for (let i = array.length; i--; ) {
        expect(array[i]).not.toBe(clone[i])
      }
    })

    it('also works with PathArray (one depths clone)', () => {
      const array = new PathArray([
        ['M', 1, 2],
        ['L', 3, 4],
        ['L', 5, 6]
      ])
      const clone = array.clone()

      expect(array).toEqual(clone)
      expect(array).not.toBe(clone)

      for (let i = array.length; i--; ) {
        expect(array[i]).not.toBe(clone[i])
      }
    })
  })

  describe('toSet()', () => {
    it('creates a Set from the Array', () => {
      const set = new SVGArray([1, 1, 2, 3]).toSet()
      expect(set).toEqual(any(Set))
      expect(set).toEqual(new Set([1, 2, 3]))
    })
  })
})
