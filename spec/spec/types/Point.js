/* globals describe, expect, it, beforeEach */

import { Point } from '../../../src/main.js'

describe('Point.js', () => {
  var point

  describe('initialization', () => {

    describe('without a source', () => {

      beforeEach(() => {
        point = new Point()
      })

      it('creates a new point with default values', () => {
        expect(point.x).toBe(0)
        expect(point.y).toBe(0)
      })

    })

    describe('with x and y given', () => {
      it('creates a point with given values', () => {
        var point = new Point(2, 4)

        expect(point.x).toBe(2)
        expect(point.y).toBe(4)
      })
    })

    describe('with only x given', () => {
      it('sets the y value to 0', () => {
        var point = new Point(7)

        expect(point.x).toBe(7)
        expect(point.y).toBe(0)
      })
    })

    describe('with array given', () => {
      it('creates a point from array', () => {
        var point = new Point([ 2, 4 ])

        expect(point.x).toBe(2)
        expect(point.y).toBe(4)
      })
    })

    describe('with object given', () => {
      it('creates a point from object', () => {
        var point = new Point({ x: 2, y: 4 })

        expect(point.x).toBe(2)
        expect(point.y).toBe(4)
      })
    })

    describe('with Point given', () => {
      it('creates a point from Point', () => {
        var point = new Point(new Point(2, 4))

        expect(point.x).toBe(2)
        expect(point.y).toBe(4)
      })
    })
  })

  describe('clone()', () => {
    it('returns cloned point', () => {
      var point1 = new Point(1, 1)
      var point2 = point1.clone()

      expect(point1).toEqual(point2)
      expect(point1).not.toBe(point2)
    })
  })
})
