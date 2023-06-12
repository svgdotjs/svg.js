/* globals describe, expect, it */

import { PointArray, Matrix, Point } from '../../../src/main.js'

describe('PointArray.js', () => {
  const squareString = '0,0 1,0 1,1 0,1'

  describe('()', () => {
    it('parses a string to a point array', () => {
      var array = new PointArray('0,1 -.05,7.95 1000.0001,-200.222')
      expect(array.valueOf()).toEqual([
        [0, 1],
        [-0.05, 7.95],
        [1000.0001, -200.222]
      ])
    })

    it('parses a points array correctly to string', () => {
      var array = new PointArray([
        [0, 0.15],
        [-100, -3.141592654],
        [50, 100]
      ])
      expect(array + '').toBe('0,0.15 -100,-3.141592654 50,100')
    })

    it('parses a flat array of x/y coordinates to a point array', () => {
      var array = new PointArray([1, 4, 5, 68, 12, 24])
      expect(array.valueOf()).toEqual([
        [1, 4],
        [5, 68],
        [12, 24]
      ])
    })

    it('parses points with space delimitered x/y coordinates', () => {
      var array = new PointArray(
        '221.08 191.79 0.46 191.79 0.46 63.92 63.8 0.46 284.46 0.46 284.46 128.37 221.08 191.79'
      )
      expect(array + '').toBe(
        '221.08,191.79 0.46,191.79 0.46,63.92 63.8,0.46 284.46,0.46 284.46,128.37 221.08,191.79'
      )
    })

    it('parses points with comma delimitered x/y coordinates', () => {
      var array = new PointArray(
        '221.08,191.79,0.46,191.79,0.46,63.92,63.8,0.46,284.46,0.46,284.46,128.37,221.08,191.79'
      )
      expect(array + '').toBe(
        '221.08,191.79 0.46,191.79 0.46,63.92 63.8,0.46 284.46,0.46 284.46,128.37 221.08,191.79'
      )
    })

    it('parses points with comma and space delimitered x/y coordinates', () => {
      var array = new PointArray(
        '221.08, 191.79, 0.46, 191.79, 0.46, 63.92, 63.8, 0.46, 284.46, 0.46, 284.46, 128.37, 221.08, 191.79'
      )
      expect(array + '').toBe(
        '221.08,191.79 0.46,191.79 0.46,63.92 63.8,0.46 284.46,0.46 284.46,128.37 221.08,191.79'
      )
    })

    it('parses points with space and comma delimitered x/y coordinates', () => {
      var array = new PointArray(
        '221.08 ,191.79 ,0.46 ,191.79 ,0.46 ,63.92 ,63.8 ,0.46 ,284.46 ,0.46 ,284.46 ,128.37 ,221.08 ,191.79'
      )
      expect(array + '').toBe(
        '221.08,191.79 0.46,191.79 0.46,63.92 63.8,0.46 284.46,0.46 284.46,128.37 221.08,191.79'
      )
    })

    it('parses points with redundant spaces at the end', () => {
      var array = new PointArray(
        '2176.6,1708.8 2176.4,1755.8 2245.8,1801.5 2297,1787.8  '
      )
      expect(array + '').toBe(
        '2176.6,1708.8 2176.4,1755.8 2245.8,1801.5 2297,1787.8'
      )
    })

    it('parses points with space delimitered x/y coordinates - even with leading or trailing space', () => {
      var array = new PointArray('  1 2 3 4  ')
      expect(array + '').toBe('1,2 3,4')
    })

    it('parses odd number of points with space delimitered x/y coordinates and silently remove the odd point', () => {
      // this  is according to spec: https://svgwg.org/svg2-draft/shapes.html#DataTypePoints
      var array = new PointArray('1 2 3')
      expect(array + '').toBe('1,2')
    })

    it('parses odd number of points in a flat array of x/y coordinates and silently remove the odd point', () => {
      // this  is according to spec: https://svgwg.org/svg2-draft/shapes.html#DataTypePoints
      var array = new PointArray([1, 2, 3])
      expect(array.valueOf()).toEqual([[1, 2]])
    })
  })

  describe('move()', () => {
    it('moves the whole array by the passed value', () => {
      const arr = new PointArray([1, 2, 3, 4]).move(10, 10)
      expect(arr.toArray()).toEqual([10, 10, 12, 12])
    })

    it('does nothing if values not numbers', () => {
      const arr = new PointArray([1, 2, 3, 4]).move()
      expect(arr.toArray()).toEqual([1, 2, 3, 4])
    })
  })

  describe('size()', () => {
    it('correctly sizes the points over the whole area', () => {
      var array = new PointArray([10, 10, 20, 20, 30, 30])
      expect(array.size(60, 60).valueOf()).toEqual([
        [10, 10],
        [40, 40],
        [70, 70]
      ])
    })

    it('let coordinates untouched when width/height is zero', () => {
      var array = new PointArray([10, 10, 10, 20, 10, 30])
      expect(array.size(60, 60).valueOf()).toEqual([
        [10, 10],
        [10, 40],
        [10, 70]
      ])

      array = new PointArray([10, 10, 20, 10, 30, 10])
      expect(array.size(60, 60).valueOf()).toEqual([
        [10, 10],
        [40, 10],
        [70, 10]
      ])
    })
  })

  describe('toString()', () => {
    it('converts to comma sepereated list', () => {
      const square = new PointArray(squareString)
      expect(square.toString()).toEqual(squareString)
    })
  })

  describe('toLine', () => {
    it('returns an object which can be passed to a line as point attributes', () => {
      const arr = new PointArray([1, 2, 3, 4])
      expect(arr.toLine()).toEqual({ x1: 1, y1: 2, x2: 3, y2: 4 })
    })
  })

  describe('transform()', () => {
    it('translates correctly', () => {
      const square = new PointArray(squareString)
      const translation = new Matrix({ translate: [2, 1] })
      const newSquare = square.transform(translation)
      expect(newSquare.toString()).toEqual('2,1 3,1 3,2 2,2')
    })

    it('transforms like Point', () => {
      const square = new PointArray(squareString)
      const matrix = new Matrix(1, 2, 3, 4, 5, 6)
      const newSquare = square.transform(matrix)
      for (let i = 0; i < square.length; i++) {
        const squarePoint = new Point(square[i])
        const newSquarePoint = new Point(newSquare[i])
        expect(squarePoint.transform(matrix)).toEqual(newSquarePoint)
      }
    })

    it('works with transform object instead of matrix', () => {
      const square = new PointArray(squareString)
      const newSquare = square.transform({ translate: [2, 1] })
      expect(newSquare.toString()).toEqual('2,1 3,1 3,2 2,2')
    })
  })
})
