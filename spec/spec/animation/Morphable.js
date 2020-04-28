/* globals describe, expect, it, jasmine */

import { Morphable, NonMorphable, ObjectBag, Color, Box, Matrix, PointArray, PathArray, TransformBag, Number as SVGNumber, Array as SVGArray } from '../../../src/main.js'

const { objectContaining, arrayContaining, any } = jasmine

describe('Morphable.js', function () {
  describe('constructors', function () {

    it('Morphable with SVGNumber', function () {
      var morpher = new Morphable().from(10).to(5)

      expect(morpher).toEqual(any(Morphable))
      expect(morpher.type()).toBe(SVGNumber)
      expect(morpher.at(0.5)).toEqual(any(SVGNumber))
      expect(morpher.at(0.5).valueOf()).toBe(7.5)
    })

    it('Morphable with String', function () {
      var morpher = new Morphable().from('foo').to('bar')

      expect(morpher).toEqual(any(Morphable))
      expect(morpher.type()).toBe(NonMorphable)
      expect(morpher.at(0.5)).toEqual(any(NonMorphable))
      expect(morpher.at(0.5).valueOf()).toBe('foo')
      expect(morpher.at(1).valueOf()).toBe('bar')
    })

    it('Morphable with Object', function () {
      var morpher = new Morphable().from({ a: 5, b: 10 }).to({ a: 10, b: 20 })

      expect(morpher).toEqual(any(Morphable))
      expect(morpher.type()).toBe(ObjectBag)
      expect(morpher.at(0.5)).toEqual(any(Object))
      expect(morpher.at(0.5).valueOf()).toEqual(objectContaining({ a: 7.5, b: 15 }))
    })

    it('Creates a morphable out of an SVGNumber', function () {
      var morpher = new SVGNumber(5).to(10)

      expect(morpher).toEqual(any(Morphable))
      expect(morpher.type()).toBe(SVGNumber)
      expect(morpher.at(0.5)).toEqual(any(SVGNumber))
      expect(morpher.at(0.5).valueOf()).toBe(7.5)
    })

    it('Creates a morphable out of an Color', function () {
      var morpher = new Color('#fff').to('#000')

      expect(morpher).toEqual(any(Morphable))
      expect(morpher.type()).toBe(Color)
      expect(morpher.at(0.5)).toEqual(any(Color))
      expect(morpher.at(0.5).toHex()).toBe('#808080')
    })

    it('Creates a morphable out of an Box', function () {
      var morpher = new Box(1, 2, 3, 4).to([ 5, 6, 7, 8 ])

      expect(morpher).toEqual(any(Morphable))
      expect(morpher.type()).toBe(Box)
      expect(morpher.at(0.5)).toEqual(any(Box))
      expect(morpher.at(0.5)).toEqual(objectContaining({ x: 3, y: 4, width: 5, height: 6 }))
    })

    it('Creates a morphable out of an Matrix', function () {
      var morpher = new Matrix(1, 2, 3, 4, 5, 6).to([ 3, 4, 5, 6, 7, 8 ])

      expect(morpher).toEqual(any(Morphable))
      expect(morpher.type()).toBe(Matrix)
      expect(morpher.at(0.5)).toEqual(any(Matrix))
      expect(morpher.at(0.5)).toEqual(objectContaining(new Matrix(2, 3, 4, 5, 6, 7)))
    })

    it('Creates a morphable out of an Array', function () {
      var morpher = new SVGArray([ 1, 2, 3, 4, 5, 6 ]).to([ 3, 4, 5, 6, 7, 8 ])

      expect(morpher).toEqual(any(Morphable))
      expect(morpher.type()).toBe(SVGArray)
      expect(morpher.at(0.5)).toEqual(any(SVGArray))
      expect(morpher.at(0.5).toArray()).toEqual(arrayContaining([ 2, 3, 4, 5, 6, 7 ]))
    })

    it('Creates a morphable out of an PointArray', function () {
      var morpher = new PointArray([ 1, 2, 3, 4, 5, 6 ]).to([ 3, 4, 5, 6, 7, 8 ])

      expect(morpher).toEqual(any(Morphable))
      expect(morpher.type()).toBe(PointArray)
      expect(morpher.at(0.5)).toEqual(any(PointArray))
      expect(morpher.at(0.5).toArray()).toEqual(arrayContaining([ 2, 3, 4, 5, 6, 7 ]))
    })

    it('Creates a morphable out of an PathArray', function () {
      var morpher = new PathArray([ 'M', 1, 2, 'L', 3, 4, 'L', 5, 6 ]).to([ 'M', 3, 4, 'L', 5, 6, 'L', 7, 8 ])

      expect(morpher).toEqual(any(Morphable))
      expect(morpher.type()).toBe(PathArray)
      expect(morpher.at(0.5)).toEqual(any(PathArray))
      expect(morpher.at(0.5).toArray()).toEqual(arrayContaining([ 'M', 2, 3, 'L', 4, 5, 'L', 6, 7 ]))
    })

    it('Creates a morphable out of an NonMorphable', function () {
      var morpher = new NonMorphable('foo').to('bar')

      expect(morpher).toEqual(any(Morphable))
      expect(morpher.type()).toBe(NonMorphable)
      expect(morpher.at(0.5)).toEqual(any(NonMorphable))
      expect(morpher.at(0.5).valueOf()).toBe('foo')
      expect(morpher.at(1).valueOf()).toBe('bar')
    })

    it('Creates a morphable out of an TransformBag', function () {
      var morpher = new TransformBag({ rotate: 0, translateX: 0 })
        .to({ rotate: 50, translateX: 20 })

      expect(morpher).toEqual(any(Morphable))
      expect(morpher.type()).toBe(TransformBag)
      expect(morpher.at(0.5)).toEqual(any(TransformBag))

      expect(morpher.at(0.5)).toEqual(objectContaining({ rotate: 25, translateX: 10 }))
    })

    it('Creates a morphable out of an ObjectBag', function () {
      var morpher = new ObjectBag({ a: 5, b: 10 }).to({ a: 10, b: 20 })

      expect(morpher).toEqual(any(Morphable))
      expect(morpher.type()).toBe(ObjectBag)
      expect(morpher.at(0.5)).toEqual(any(Object))
      expect(morpher.at(0.5).valueOf()).toEqual(objectContaining({ a: 7.5, b: 15 }))
    })
  })

  describe('from()', function () {
    it('sets the type of the runner', function () {
      var morpher = new Morphable().from(5)
      expect(morpher.type()).toBe(SVGNumber)
    })

    it('sets the from attribute to an array representation of the morphable type', function () {
      var morpher = new Morphable().from(5)
      expect(morpher.from()).toEqual(arrayContaining([ 5 ]))
    })
  })

  describe('type()', function () {
    it('sets the type of the runner', function () {
      var morpher = new Morphable().type(SVGNumber)
      expect(morpher._type).toBe(SVGNumber)
    })

    it('gets the type of the runner', function () {
      var morpher = new Morphable().type(SVGNumber)
      expect(morpher.type()).toBe(SVGNumber)
    })
  })

  describe('to()', function () {
    it('sets the type of the runner', function () {
      var morpher = new Morphable().to(5)
      expect(morpher.type()).toBe(SVGNumber)
    })

    it('sets the from attribute to an array representation of the morphable type', function () {
      var morpher = new Morphable().to(5)
      expect(morpher.to()).toEqual(arrayContaining([ 5 ]))
    })
  })
})
