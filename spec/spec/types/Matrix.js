/* globals describe, expect, it, spyOn, jasmine */

import { Matrix, Rect, SVG } from '../../../src/main.js'
import { getWindow } from '../../../src/utils/window.js'

const { any, objectContaining } = jasmine

describe('Matrix.js', () => {
  const comp = { a: 2, b: 0, c: 0, d: 2, e: 100, f: 50 }

  describe('initialization', () => {
    it('creates a new matrix with default values', () => {
      const matrix = new Matrix()
      expect(matrix).toEqual(
        objectContaining({ a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 })
      )
    })

    it('parses the current transform matrix from an element', () => {
      const rect = new Rect().transform(comp)
      const matrix = new Matrix(rect)
      expect(matrix).toEqual(objectContaining(comp))
    })

    it('parses a string value correctly', () => {
      const matrix = new Matrix('2, 0, 0, 2, 100, 50')
      expect(matrix).toEqual(objectContaining(comp))
    })

    it('parses an array correctly', () => {
      const matrix = new Matrix([2, 0, 0, 2, 100, 50])
      expect(matrix).toEqual(objectContaining(comp))
    })

    it('parses an object correctly', () => {
      const matrix = new Matrix(comp)
      expect(matrix).toEqual(objectContaining(comp))
    })

    it('parses a transform object correctly', () => {
      const matrix = new Matrix({ scale: 2, translate: [100, 50] })
      expect(matrix).toEqual(objectContaining(comp))
    })

    it('parses 6 arguments correctly', () => {
      const matrix = new Matrix(2, 0, 0, 2, 100, 50)
      expect(matrix).toEqual(objectContaining(comp))
    })

    it('falls back to base if source is missing values', () => {
      const matrix = new Matrix([])
      expect(matrix).toEqual(new Matrix())
    })
  })

  describe('toString()', () => {
    it('exports correctly to a string', () => {
      expect(new Matrix().toString()).toBe('matrix(1,0,0,1,0,0)')
    })
  })

  describe('transform()', () => {
    it('does simple left matrix multiplication if matrixlike object is passed', () => {
      const matrix = new Matrix().transform(new Matrix().scale(2))
      expect(matrix).toEqual(new Matrix().lmultiplyO(new Matrix().scale(2)))
    })

    it('forces the origin to a specific place if position.x is passed', () => {
      const matrix = new Matrix().transform({ px: 10 })
      expect(matrix.e).toBe(10)
    })

    it('forces the origin to a specific place if position.y is passed', () => {
      const matrix = new Matrix().transform({ py: 10 })
      expect(matrix.f).toBe(10)
    })
  })

  describe('decompose()', () => {
    it('decomposes a matrix properly', () => {
      var matrix = new Matrix()
        .scale(3, 2.5)
        .shear(4)
        .rotate(30)
        .translate(20, 30)
      var decomposed = matrix.decompose()
      expect(decomposed.scaleX).toBeCloseTo(3)
      expect(decomposed.scaleY).toBeCloseTo(2.5)
      expect(decomposed.shear).toBeCloseTo(4)
      expect(decomposed.rotate).toBeCloseTo(30)
      expect(decomposed.translateX).toBeCloseTo(20)
      expect(decomposed.translateY).toBeCloseTo(30)
    })

    it('can be recomposed to the same matrix', () => {
      var matrix = new Matrix()
        .scale(3, 2.5)
        .shear(4)
        .rotate(30)
        .translate(20, 30)
      var decomposed = matrix.decompose()

      // Get rid of the matrix values before recomposing with the matrix constructor
      for (const prop in 'abcdef') delete decomposed[prop]

      var composed = new Matrix(decomposed)
      expect(matrix.a).toBeCloseTo(composed.a)
      expect(matrix.b).toBeCloseTo(composed.b)
      expect(matrix.c).toBeCloseTo(composed.c)
      expect(matrix.d).toBeCloseTo(composed.d)
      expect(matrix.e).toBeCloseTo(composed.e)
      expect(matrix.f).toBeCloseTo(composed.f)
    })
  })

  describe('clone()', () => {
    it('returns a clone of the matrix', () => {
      var matrix = new Matrix(2, 0, 0, 5, 0, 0)
      var clone = matrix.clone()
      expect(matrix).not.toBe(clone)
      for (var i in 'abcdef') {
        expect(matrix[i]).toEqual(clone[i])
      }
    })
  })

  describe('multiply()', () => {
    it('multiplies two matrices', () => {
      var matrix1 = new Matrix(1, 4, 2, 5, 3, 6)
      var matrix2 = new Matrix(7, 8, 8, 7, 9, 6)
      var matrix3 = matrix1.multiply(matrix2)

      expect(matrix1.toString()).toBe('matrix(1,4,2,5,3,6)')
      expect(matrix2.toString()).toBe('matrix(7,8,8,7,9,6)')
      expect(matrix3.toString()).toBe('matrix(23,68,22,67,24,72)')
    })

    it('accepts matrices in any form', () => {
      var matrix1 = new Matrix(1, 4, 2, 5, 3, 6)
      var matrix2 = matrix1.multiply('7,8,8,7,9,6')

      expect(matrix1.toString()).toBe('matrix(1,4,2,5,3,6)')
      expect(matrix2.toString()).toBe('matrix(23,68,22,67,24,72)')
    })
  })

  describe('inverse()', () => {
    it('inverses matrix', () => {
      var matrix1 = new Matrix(2, 0, 0, 5, 4, 3)
      var matrix2 = matrix1.inverse()
      var abcdef = [0.5, 0, 0, 0.2, -2, -0.6]

      for (var i in 'abcdef') {
        expect(matrix2['abcdef'[i]]).toBeCloseTo(abcdef[i])
      }
    })

    it('throws if matrix is not invertible', () => {
      const matrix = new Matrix(0, 0, 0, 0, 0, 0)
      expect(() => matrix.inverse()).toThrowError(
        'Cannot invert matrix(0,0,0,0,0,0)'
      )
    })
  })

  describe('translate()', () => {
    it('translates matrix by given x and y values', () => {
      var matrix = new Matrix(1, 0, 0, 1, 4, 3).translate(10, 12.5)
      expect(matrix.e).toBe(14)
      expect(matrix.f).toBe(15.5)
    })

    it('does nothing if you give it no x or y value', () => {
      var matrix = new Matrix(1, 2, 3, 4, 5, 6).translate()
      expect(matrix.e).toBe(5)
      expect(matrix.f).toBe(6)
    })
  })

  describe('scale()', () => {
    it('performs a uniformal scale with one value', () => {
      var matrix = new Matrix(1, 0, 0, 1, 4, 3).scale(3)

      expect(matrix.a).toBe(3)
      expect(matrix.d).toBe(3)
      expect(matrix.e).toBe(4 * 3)
      expect(matrix.f).toBe(3 * 3)
    })

    it('performs a non-uniformal scale with two values', () => {
      var matrix = new Matrix(1, 0, 0, 1, 4, 3).scale(2.5, 3.5)

      expect(matrix.a).toBe(2.5)
      expect(matrix.d).toBe(3.5)
      expect(matrix.e).toBe(4 * 2.5)
      expect(matrix.f).toBe(3 * 3.5)
    })

    it('performs a uniformal scale at a given center point with three values', () => {
      var matrix = new Matrix(1, 3, 2, 3, 4, 3).scale(3, 2, 3)

      expect(matrix.a).toBe(3)
      expect(matrix.b).toBe(9)
      expect(matrix.c).toBe(6)
      expect(matrix.d).toBe(9)
      expect(matrix.e).toBe(8)
      expect(matrix.f).toBe(3)
    })

    it('performs a non-uniformal scale at a given center point with four values', () => {
      var matrix = new Matrix(1, 3, 2, 3, 4, 3).scale(3, 2, 2, 3)

      expect(matrix.a).toBe(3)
      expect(matrix.b).toBe(6)
      expect(matrix.c).toBe(6)
      expect(matrix.d).toBe(6)
      expect(matrix.e).toBe(8)
      expect(matrix.f).toBe(3)
    })
  })

  describe('rotate()', () => {
    it('performs a rotation with one argument', () => {
      var matrix = new Matrix(1, 3, 2, 3, 4, 3).rotate(30)

      expect(matrix.a).toBeCloseTo(-0.6339746)
      expect(matrix.b).toBeCloseTo(3.09807621)
      expect(matrix.c).toBeCloseTo(0.23205081)
      expect(matrix.d).toBeCloseTo(3.59807621)
      expect(matrix.e).toBeCloseTo(1.96410162)
      expect(matrix.f).toBeCloseTo(4.59807621)
    })

    it('performs a rotation around a given point with three arguments', () => {
      var matrix = new Matrix(1, 3, 2, 3, 4, 3).rotate(30, 2, 3)

      expect(matrix.a).toBeCloseTo(-0.633974596216)
      expect(matrix.b).toBeCloseTo(3.09807621135)
      expect(matrix.c).toBeCloseTo(0.232050807569)
      expect(matrix.d).toBeCloseTo(3.59807621135)
      expect(matrix.e).toBeCloseTo(3.73205080757)
      expect(matrix.f).toBeCloseTo(4.0)
    })
  })

  describe('flip()', () => {
    describe('with x given', () => {
      it('performs a flip over the horizontal axis with one argument', () => {
        var matrix = new Matrix(1, 0, 0, 1, 4, 3).flip('x')

        expect(matrix.a).toBe(-1)
        expect(matrix.d).toBe(1)
        expect(matrix.e).toBe(-4)
        expect(matrix.f).toBe(3)
      })

      it('performs a flip over the horizontal axis over a given point with two arguments', () => {
        var matrix = new Matrix(1, 0, 0, 1, 4, 3).flip('x', 150)

        expect(matrix.a).toBe(-1)
        expect(matrix.d).toBe(1)
        expect(matrix.e).toBe(296)
        expect(matrix.f).toBe(3)
      })
    })

    describe('with y given', () => {
      it('performs a flip over the vertical axis with one argument', () => {
        var matrix = new Matrix(1, 0, 0, 1, 4, 3).flip('y')

        expect(matrix.a).toBe(1)
        expect(matrix.d).toBe(-1)
        expect(matrix.e).toBe(4)
        expect(matrix.f).toBe(-3)
      })

      it('performs a flip over the vertical axis over a given point with two arguments', () => {
        var matrix = new Matrix(1, 0, 0, 1, 4, 3).flip('y', 100)

        expect(matrix.a).toBe(1)
        expect(matrix.d).toBe(-1)
        expect(matrix.e).toBe(4)
        expect(matrix.f).toBe(197)
      })
    })

    describe('with no axis given', () => {
      it('performs a flip over the horizontal and vertical axis with no argument', () => {
        var matrix = new Matrix(1, 0, 0, 1, 4, 3).flip()

        expect(matrix.a).toBe(-1)
        expect(matrix.d).toBe(-1)
        expect(matrix.e).toBe(-4)
        expect(matrix.f).toBe(-3)
      })

      it('performs a flip over the horizontal and vertical axis over a given point with one argument that represent both coordinates', () => {
        var matrix = new Matrix(1, 0, 0, 1, 4, 3).flip(100)

        expect(matrix.a).toBe(-1)
        expect(matrix.d).toBe(-1)
        expect(matrix.e).toBe(196)
        expect(matrix.f).toBe(197)
      })

      it('performs a flip over the horizontal and vertical axis over a given point with two arguments', () => {
        var matrix = new Matrix(1, 0, 0, 1, 4, 3).flip(50, 100)

        expect(matrix.a).toBe(-1)
        expect(matrix.d).toBe(-1)
        expect(matrix.e).toBe(96)
        expect(matrix.f).toBe(197)
      })
    })
  })

  describe('skew()', () => {
    it('performs a uniformal skew with one value', () => {
      var matrix = new Matrix(1, 0, 0, 1, 4, 3).skew(30)

      expect(matrix.a).toBe(1)
      expect(matrix.b).toBeCloseTo(0.57735026919)
      expect(matrix.c).toBeCloseTo(0.57735026919)
      expect(matrix.d).toBe(1)
      expect(matrix.e).toBeCloseTo(5.73205080757)
      expect(matrix.f).toBeCloseTo(5.30940107676)
    })

    it('performs a non-uniformal skew with two values', () => {
      var matrix = new Matrix(1, 0, 0, 1, 4, 3).skew(30, 20)

      expect(matrix.a).toBe(1)
      expect(matrix.b).toBeCloseTo(0.363970234266)
      expect(matrix.c).toBeCloseTo(0.57735026919)
      expect(matrix.d).toBe(1)
      expect(matrix.e).toBeCloseTo(5.73205080757)
      expect(matrix.f).toBeCloseTo(4.45588093706)
    })

    it('performs a uniformal skew at a given center point with three values', () => {
      var matrix = new Matrix(1, 0, 0, 1, 4, 3).skew(30, 150, 100)

      expect(matrix.a).toBe(1)
      expect(matrix.b).toBeCloseTo(0.57735026919)
      expect(matrix.c).toBeCloseTo(0.57735026919)
      expect(matrix.d).toBe(1)
      expect(matrix.e).toBeCloseTo(-52.0029761114)
      expect(matrix.f).toBeCloseTo(-81.2931393017)
    })

    it('performs a non-uniformal skew at a given center point with four values', () => {
      var matrix = new Matrix(1, 0, 0, 1, 4, 3).skew(30, 20, 150, 100)

      expect(matrix.a).toBe(1.0)
      expect(matrix.b).toBeCloseTo(0.363970234266)
      expect(matrix.c).toBeCloseTo(0.57735026919)
      expect(matrix.d).toBe(1.0)
      expect(matrix.e).toBeCloseTo(-52.0029761114)
      expect(matrix.f).toBeCloseTo(-50.1396542029)
    })

    it('can be chained', () => {
      var matrix = new Matrix(1, 0, 0, 1, 4, 3).skew(20, 30).skew(30, 20)
      expect(matrix.a).toBeCloseTo(1.33333333333)
      expect(matrix.b).toBeCloseTo(0.941320503456)
      expect(matrix.c).toBeCloseTo(0.941320503456)
      expect(matrix.d).toBeCloseTo(1.13247433143)
      expect(matrix.e).toBeCloseTo(8.1572948437)
      expect(matrix.f).toBeCloseTo(7.16270500812)
    })
  })

  describe('skewX', () => {
    it('performs a skew along the x axis with one value', () => {
      var matrix = new Matrix(1, 0, 0, 1, 4, 3).skewX(30)

      expect(matrix.a).toBe(1)
      expect(matrix.b).toBe(0)
      expect(matrix.c).toBeCloseTo(0.57735026919)
      expect(matrix.d).toBe(1)
      expect(matrix.e).toBeCloseTo(5.73205080757)
      expect(matrix.f).toBe(3)
    })

    it('performs a skew along the x axis at a given center point with three values', () => {
      var matrix = new Matrix(1, 0, 0, 1, 4, 3).skewX(30, 150, 100)

      expect(matrix.a).toBe(1)
      expect(matrix.b).toBe(0)
      expect(matrix.c).toBeCloseTo(0.57735026919)
      expect(matrix.d).toBe(1)
      expect(matrix.e).toBeCloseTo(-52.0029761114)
      expect(matrix.f).toBe(3)
    })
  })

  describe('skewY', () => {
    it('performs a skew along the y axis with one value', () => {
      var matrix = new Matrix(1, 0, 0, 1, 4, 3).skewY(30)

      expect(matrix.a).toBe(1)
      expect(matrix.b).toBeCloseTo(0.57735026919)
      expect(matrix.c).toBe(0)
      expect(matrix.d).toBe(1)
      expect(matrix.e).toBe(4)
      expect(matrix.f).toBeCloseTo(5.30940107676)
    })

    it('performs a skew along the y axis at a given center point with three values', () => {
      var matrix = new Matrix(1, 0, 0, 1, 4, 3).skewY(30, 150, 100)

      expect(matrix.a).toBe(1)
      expect(matrix.b).toBeCloseTo(0.57735026919)
      expect(matrix.c).toBe(0)
      expect(matrix.d).toBe(1)
      expect(matrix.e).toBe(4)
      expect(matrix.f).toBeCloseTo(-81.2931393017)
    })
  })

  describe('around()', () => {
    it('performs a matrix operation around an origin by shifting the origin to 0,0', () => {
      const matrix = new Matrix(1, 0, 0, 1, 0, 0).around(
        10,
        10,
        new Matrix().scale(2)
      )

      expect(matrix).toEqual(new Matrix(2, 0, 0, 2, -10, -10))
    })

    it('defaults to around center of 0,0', () => {
      const matrix = new Matrix(1, 0, 0, 1, 0, 0).around(
        0,
        0,
        new Matrix().scale(2)
      )

      expect(matrix).toEqual(new Matrix(2, 0, 0, 2, 0, 0))
    })
  })

  describe('equals()', () => {
    it('returns true if the same matrix is passed', () => {
      const matrix = new Matrix()
      expect(matrix.equals(matrix)).toBe(true)
    })

    it('returns true if the components match', () => {
      const matrix = new Matrix()
      expect(matrix.equals(matrix.clone())).toBe(true)
    })

    it('returns false if the components do not match', () => {
      const matrix = new Matrix()
      expect(matrix.equals(matrix.scale(2))).toBe(false)
    })
  })

  describe('valueOf()', () => {
    it('returns an object containing the matrix components', () => {
      const matrix = new Matrix().valueOf()
      expect(matrix).not.toEqual(any(Matrix))
      expect(matrix).toEqual({ a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 })
    })
  })

  describe('toArray', () => {
    it('converts matrix to array', () => {
      const arr = new Matrix().toArray()
      expect(arr).toEqual([1, 0, 0, 1, 0, 0])
    })
  })

  describe('static', () => {
    describe('fromArray()', () => {
      it('creates a matrix like object from an array', () => {
        const matrix = Matrix.fromArray([1, 2, 3, 4, 5, 6])
        expect(matrix).not.toEqual(any(Matrix))
        expect(matrix).toEqual(new Matrix(1, 2, 3, 4, 5, 6).valueOf())
      })
    })

    describe('isMatrixLike', () => {
      it('returns true if object contains all components', () => {
        expect(Matrix.isMatrixLike(new Matrix())).toBe(true)
        expect(Matrix.isMatrixLike(new Matrix().valueOf())).toBe(true)
        expect(Matrix.isMatrixLike({ f: 0 })).toBe(true)
      })

      it('returns false if no component is found', () => {
        expect(Matrix.isMatrixLike({ foo: 'bar' })).toBe(false)
      })
    })

    describe('formatTransforms()', () => {
      it('formats all transform input varieties to a canonical form', () => {
        expect(
          Matrix.formatTransforms({
            flip: true,
            skew: 5,
            scale: 5,
            originX: 5,
            originY: 5,
            positionX: 5,
            positionY: 5,
            translateX: 5,
            translateY: 5,
            relativeX: 5,
            relativeY: 5
          })
        ).toEqual({
          scaleX: -5,
          scaleY: -5,
          skewX: 5,
          skewY: 5,
          shear: 0,
          theta: 0,
          rx: 5,
          ry: 5,
          tx: 5,
          ty: 5,
          ox: 5,
          oy: 5,
          px: 5,
          py: 5
        })
      })

      it('respects flip=x', () => {
        expect(
          Matrix.formatTransforms({
            flip: 'x',
            scale: [1, 2],
            skew: [1, 2]
          })
        ).toEqual(
          objectContaining({ scaleX: -1, scaleY: 2, skewX: 1, skewY: 2 })
        )
      })

      it('respects flip=y', () => {
        expect(
          Matrix.formatTransforms({
            flip: 'y',
            scaleX: 1,
            scaleY: 2,
            skewX: 1,
            skewY: 2
          })
        ).toEqual(
          objectContaining({ scaleX: 1, scaleY: -2, skewX: 1, skewY: 2 })
        )
      })

      it('makes position NaN if not passed', () => {
        expect(
          Matrix.formatTransforms({
            flip: 'y',
            scaleX: 1,
            scaleY: 2,
            skewX: 1,
            skewY: 2
          })
        ).toEqual(objectContaining({ px: NaN, py: NaN }))
      })
    })
  })

  describe('Element', () => {
    describe('ctm()', () => {
      it('returns the native ctm wrapped into a matrix', () => {
        const rect = new Rect()
        const spy = spyOn(rect.node, 'getCTM')
        rect.ctm()
        expect(spy).toHaveBeenCalled()
      })
    })

    describe('screenCTM()', () => {
      it('returns the native screenCTM wrapped into a matrix for a normal element', () => {
        const rect = new Rect()
        const spy = spyOn(rect.node, 'getScreenCTM')
        rect.screenCTM()
        expect(spy).toHaveBeenCalled()
      })

      it('does extra work for nested svgs because firefox needs it', () => {
        const spy = spyOn(
          getWindow().SVGGraphicsElement.prototype,
          'getScreenCTM'
        )
        const svg = SVG().nested()
        svg.screenCTM()
        expect(spy).toHaveBeenCalled()
      })
    })
  })
})
