import * as SVGJS from '@svgdotjs/svg.js'
import { Transform } from 'stream';

describe('Morphing', function () {
  describe('constructors', function () {

    it('SVG.Morphable with Number', function () {
      var morpher = new SVGJS.Morphable().from(10).to(5)

      expect(morpher instanceof SVGJS.Morphable).toBe(true)
      expect(morpher.type()).toBe(SVGJS.Number)
      expect(morpher.at(0.5) instanceof SVGJS.Number).toBe(true)
      expect(morpher.at(0.5).valueOf()).toBe(7.5)
    })

    it('SVG.Morphable with String', function () {
      var morpher = new SVGJS.Morphable().from('foo').to('bar')

      expect(morpher instanceof SVGJS.Morphable).toBe(true)
      expect(morpher.type()).toBe(SVGJS.NonMorphable)
      expect(morpher.at(0.5) instanceof SVGJS.NonMorphable).toBe(true)
      expect(morpher.at(0.5).valueOf()).toBe('foo')
      expect(morpher.at(1).valueOf()).toBe('bar')
    })

    it('SVG.Morphable with Object', function () {
      var morpher = new SVGJS.Morphable().from({ a: 5, b: 10 }).to({ a: 10, b: 20 })

      expect(morpher instanceof SVGJS.Morphable).toBe(true)
      expect(morpher.type()).toBe(SVGJS.ObjectBag)
      expect(morpher.at(0.5) instanceof Object).toBe(true)
      expect(morpher.at(0.5).valueOf()).toEqual(jasmine.objectContaining({ a: 7.5, b: 15 }))
    })

    it('Creates a morphable out of an SVG.Number', function () {
      var morpher = new SVGJS.Number(5).to(10)

      expect(morpher instanceof SVGJS.Morphable).toBe(true)
      expect(morpher.type()).toBe(SVGJS.Number)
      expect(morpher.at(0.5) instanceof SVGJS.Number).toBe(true)
      expect(morpher.at(0.5).valueOf()).toBe(7.5)
    })

    it('Creates a morphable out of an SVG.Color', function () {
      var morpher = new SVGJS.Color('#fff').to('#000')

      expect(morpher instanceof SVGJS.Morphable).toBe(true)
      expect(morpher.type()).toBe(SVGJS.Color)
      expect(morpher.at(0.5) instanceof SVGJS.Color).toBe(true)
      expect(morpher.at(0.5).toHex()).toBe('#808080')
    })

    it('Creates a morphable out of an SVG.Box', function () {
      var morpher = new SVGJS.Box(1, 2, 3, 4).to([5, 6, 7, 8])

      expect(morpher instanceof SVGJS.Morphable).toBe(true)
      expect(morpher.type()).toBe(SVGJS.Box)
      expect(morpher.at(0.5) instanceof SVGJS.Box).toBe(true)
      expect(morpher.at(0.5)).toEqual(jasmine.objectContaining({ x: 3, y: 4, width: 5, height: 6 }))
    })

    it('Creates a morphable out of an SVG.Matrix', function () {
      var morpher = new SVGJS.Matrix(1, 2, 3, 4, 5, 6).to([3, 4, 5, 6, 7, 8])

      expect(morpher instanceof SVGJS.Morphable).toBe(true)
      expect(morpher.type()).toBe(SVGJS.Matrix)
      expect(morpher.at(0.5) instanceof SVGJS.Matrix).toBe(true)
      expect(morpher.at(0.5)).toEqual(jasmine.objectContaining(new SVGJS.Matrix(2, 3, 4, 5, 6, 7)))
    })

    it('Creates a morphable out of an SVG.Array', function () {
      var morpher = new SVGJS.Array([1, 2, 3, 4, 5, 6]).to([3, 4, 5, 6, 7, 8])

      expect(morpher instanceof SVGJS.Morphable).toBe(true)
      expect(morpher.type()).toBe(SVGJS.Array)
      expect(morpher.at(0.5) instanceof SVGJS.Array).toBe(true)
      expect(morpher.at(0.5).toArray()).toEqual(jasmine.arrayContaining([2, 3, 4, 5, 6, 7]))
    })

    it('Creates a morphable out of an SVG.PointArray', function () {
      var morpher = new SVGJS.PointArray([1, 2, 3, 4, 5, 6]).to([3, 4, 5, 6, 7, 8])

      expect(morpher instanceof SVGJS.Morphable).toBe(true)
      expect(morpher.type()).toBe(SVGJS.PointArray)
      expect(morpher.at(0.5) instanceof SVGJS.PointArray).toBe(true)
      expect(morpher.at(0.5).toArray()).toEqual(jasmine.arrayContaining([2, 3, 4, 5, 6, 7]))
    })

    it('Creates a morphable out of an SVG.PathArray', function () {
      var morpher = new SVGJS.PathArray(['M', 1, 2, 'L', 3, 4, 'L', 5, 6]).to(['M', 3, 4, 'L', 5, 6, 'L', 7, 8])

      expect(morpher instanceof SVGJS.Morphable).toBe(true)
      expect(morpher.type()).toBe(SVGJS.PathArray)
      expect(morpher.at(0.5) instanceof SVGJS.PathArray).toBe(true)
      expect(morpher.at(0.5).toArray()).toEqual(jasmine.arrayContaining(['M', 2, 3, 'L', 4, 5, 'L', 6, 7]))
    })

    it('Creates a morphable out of an SVG.NonMorphable', function () {
      var morpher = new SVGJS.NonMorphable('foo').to('bar')

      expect(morpher instanceof SVGJS.Morphable).toBe(true)
      expect(morpher.type()).toBe(SVGJS.NonMorphable)
      expect(morpher.at(0.5) instanceof SVGJS.NonMorphable).toBe(true)
      expect(morpher.at(0.5).valueOf()).toBe('foo')
      expect(morpher.at(1).valueOf()).toBe('bar')
    })

    it('Creates a morphable out of an SVG.TransformBag', function () {
      var morpher = new SVGJS.TransformBag({ rotate: 0, translateX: 0 })
        .to({ rotate: 50, translateX: 20 })

      expect(morpher instanceof SVGJS.Morphable).toBe(true)
      expect(morpher.type()).toBe(SVGJS.TransformBag)
      expect(morpher.at(0.5) instanceof SVGJS.TransformBag).toBe(true)

      expect(morpher.at(0.5)).toEqual(jasmine.objectContaining({ rotate: 25, translateX: 10 }))
    })

    it('Creates a morphable out of an SVG.ObjectBag', function () {
      var morpher = new SVGJS.ObjectBag({ a: 5, b: 10 }).to({ a: 10, b: 20 })

      expect(morpher instanceof SVGJS.Morphable).toBe(true)
      expect(morpher.type()).toBe(SVGJS.ObjectBag)
      expect(morpher.at(0.5) instanceof Object).toBe(true)
      expect(morpher.at(0.5).valueOf()).toEqual(jasmine.objectContaining({ a: 7.5, b: 15 }))
    })
  })

  describe('from()', function () {
    it('sets the type of the runner', function () {
      var morpher = new SVGJS.Morphable().from(5)
      expect(morpher.type()).toBe(SVGJS.Number)
    })

    it('sets the from attribute to an array representation of the morphable type', function () {
      var morpher = new SVGJS.Morphable().from(5)
      expect(morpher.from() as Array<number>).toEqual(jasmine.arrayContaining([5]))
    })
  })

  describe('type()', function () {
    it('sets the type of the runner', function () {
      var morpher = new SVGJS.Morphable().type(SVGJS.Number)
      expect((morpher as any)._type).toBe(SVGJS.Number)
    })

    it('gets the type of the runner', function () {
      var morpher = new SVGJS.Morphable().type(SVGJS.Number)
      expect(morpher.type()).toBe(SVGJS.Number)
    })
  })

  describe('to()', function () {
    it('sets the type of the runner', function () {
      var morpher = new SVGJS.Morphable().to(5)
      expect(morpher.type()).toBe(SVGJS.Number)
    })

    it('sets the from attribute to an array representation of the morphable type', function () {
      var morpher = new SVGJS.Morphable().to(5)
      expect(morpher.to() as Array<number>).toEqual(jasmine.arrayContaining([5]))
    })
  })
})
