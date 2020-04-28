/* globals describe, expect, it */

import { PointArray, Matrix, Point } from '../../../src/main.js'

describe('PointArray', () => {
  const squareString = '0,0 1,0 1,1 0,1'
  const square = new PointArray(squareString)

  describe('toString()', () => {
    it('round trips with string', () => {
      expect(square.toString()).toEqual(squareString)
    })
  })

  describe('transform()', () => {
    it('translates correctly', () => {
      const translation = new Matrix().translate(2, 1)
      const newSquare = square.transform(translation)
      expect(newSquare.toString()).toEqual('2,1 3,1 3,2 2,2')
    })

    it('transforms like Point', () => {
      const matrix = new Matrix(1, 2, 3, 4, 5, 6)
      const newSquare = square.transform(matrix)
      for (let i = 0; i < square.length; i++) {
        const squarePoint = new Point(square[i])
        const newSquarePoint = new Point(newSquare[i])
        expect(squarePoint.transform(matrix)).toEqual(newSquarePoint)
      }
    })
  })
})
