/* globals describe, expect, it, jasmine */

import {
  Morphable,
  NonMorphable,
  ObjectBag,
  Color,
  Box,
  Matrix,
  PointArray,
  PathArray,
  TransformBag,
  Number as SVGNumber,
  Array as SVGArray
} from '../../../src/main.js'
import { Stepper, easing, Ease } from '../../../src/animation/Controller.js'

const { objectContaining, arrayContaining, any } = jasmine

describe('Morphable.js', () => {
  describe('()', () => {
    it('sets a default stepper', () => {
      const morpher = new Morphable()
      expect(morpher.stepper().ease).toBe(easing['-'])
    })

    it('sets the passed stepper', () => {
      const ease = new Ease()
      const morpher = new Morphable(ease)
      expect(morpher.stepper()).toBe(ease)
    })
  })

  describe('constructors', () => {
    it('Morphable with SVGNumber', () => {
      const morpher = new Morphable().from(10).to(5)

      expect(morpher).toEqual(any(Morphable))
      expect(morpher.type()).toBe(SVGNumber)
      expect(morpher.at(0.5)).toEqual(any(SVGNumber))
      expect(morpher.at(0.5).valueOf()).toBe(7.5)
    })

    it('Morphable with String', () => {
      const morpher = new Morphable().from('foo').to('bar')

      expect(morpher).toEqual(any(Morphable))
      expect(morpher.type()).toBe(NonMorphable)
      expect(morpher.at(0.5)).toEqual(any(NonMorphable))
      expect(morpher.at(0.5).valueOf()).toBe('foo')
      expect(morpher.at(1).valueOf()).toBe('bar')
    })

    it('Morphable with Object', () => {
      const morpher = new Morphable().from({ a: 5, b: 10 }).to({ a: 10, b: 20 })

      expect(morpher).toEqual(any(Morphable))
      expect(morpher.type()).toBe(ObjectBag)
      expect(morpher.at(0.5)).toEqual(any(Object))
      expect(morpher.at(0.5).valueOf()).toEqual(
        objectContaining({ a: new SVGNumber(7.5), b: new SVGNumber(15) })
      )
    })

    it('Morphable from object containing css values', () => {
      const morpher = new Morphable()
        .from({ opacity: '0', 'stroke-width': '10px' })
        .to({ opacity: 1, 'stroke-width': 20 })

      expect(morpher).toEqual(any(Morphable))
      expect(morpher.type()).toBe(ObjectBag)
      expect(morpher.at(0.5)).toEqual(any(Object))
      expect(morpher.at(0.5).valueOf()).toEqual(
        objectContaining({
          opacity: new SVGNumber(0.5),
          'stroke-width': new SVGNumber('15px')
        })
      )
    })

    it('Creates a morphable out of an SVGNumber', () => {
      const morpher = new SVGNumber(5).to(10)

      expect(morpher).toEqual(any(Morphable))
      expect(morpher.type()).toBe(SVGNumber)
      expect(morpher.at(0.5)).toEqual(any(SVGNumber))
      expect(morpher.at(0.5).valueOf()).toBe(7.5)
    })

    it('Creates a morphable out of an Color', () => {
      const morpher = new Color('#fff').to('#000')

      expect(morpher).toEqual(any(Morphable))
      expect(morpher.type()).toBe(Color)
      expect(morpher.at(0.5)).toEqual(any(Color))
      expect(morpher.at(0.5).toHex()).toBe('#808080')
    })

    it('Creates a morphable out of an Box', () => {
      const morpher = new Box(1, 2, 3, 4).to([5, 6, 7, 8])

      expect(morpher).toEqual(any(Morphable))
      expect(morpher.type()).toBe(Box)
      expect(morpher.at(0.5)).toEqual(any(Box))
      expect(morpher.at(0.5)).toEqual(
        objectContaining({ x: 3, y: 4, width: 5, height: 6 })
      )
    })

    it('Creates a morphable out of an Matrix', () => {
      const morpher = new Matrix(1, 2, 3, 4, 5, 6).to([3, 4, 5, 6, 7, 8])

      expect(morpher).toEqual(any(Morphable))
      expect(morpher.type()).toBe(Matrix)
      expect(morpher.at(0.5)).toEqual(any(Matrix))
      expect(morpher.at(0.5)).toEqual(
        objectContaining(new Matrix(2, 3, 4, 5, 6, 7))
      )
    })

    it('Creates a morphable out of an SVGArray', () => {
      const morpher = new SVGArray([1, 2, 3, 4, 5, 6]).to([3, 4, 5, 6, 7, 8])

      expect(morpher).toEqual(any(Morphable))
      expect(morpher.type()).toBe(SVGArray)
      expect(morpher.at(0.5)).toEqual(any(SVGArray))
      expect(morpher.at(0.5).toArray()).toEqual(
        arrayContaining([2, 3, 4, 5, 6, 7])
      )
    })

    it('Creates a morphable out of an PointArray', () => {
      const morpher = new PointArray([1, 2, 3, 4, 5, 6]).to([3, 4, 5, 6, 7, 8])

      expect(morpher).toEqual(any(Morphable))
      expect(morpher.type()).toBe(PointArray)
      expect(morpher.at(0.5)).toEqual(any(PointArray))
      expect(morpher.at(0.5).toArray()).toEqual(
        arrayContaining([2, 3, 4, 5, 6, 7])
      )
    })

    it('Creates a morphable out of an PathArray', () => {
      const morpher = new PathArray(['M', 1, 2, 'L', 3, 4, 'L', 5, 6]).to([
        'M',
        3,
        4,
        'L',
        5,
        6,
        'L',
        7,
        8
      ])

      expect(morpher).toEqual(any(Morphable))
      expect(morpher.type()).toBe(PathArray)
      expect(morpher.at(0.5)).toEqual(any(PathArray))
      expect(morpher.at(0.5).toArray()).toEqual(
        arrayContaining(['M', 2, 3, 'L', 4, 5, 'L', 6, 7])
      )
    })

    it('creates a morphable from unmorphable types', () => {
      const morpher = new Morphable().from('Hallo').to('Welt')

      expect(morpher).toEqual(any(Morphable))
      expect(morpher.type()).toBe(NonMorphable)
      expect(morpher.at(0.5)).toEqual(any(NonMorphable))
      expect(morpher.at(0.5).valueOf()).toBe('Hallo')
      expect(morpher.at(1).valueOf()).toBe('Welt')
    })

    it('Creates a morphable out of an TransformBag', () => {
      const morpher = new TransformBag({ rotate: 0, translateX: 0 }).to({
        rotate: 50,
        translateX: 20
      })

      expect(morpher).toEqual(any(Morphable))
      expect(morpher.type()).toBe(TransformBag)
      expect(morpher.at(0.5)).toEqual(any(TransformBag))

      expect(morpher.at(0.5)).toEqual(
        objectContaining({ rotate: 25, translateX: 10 })
      )
    })

    it('Creates a morphable out of an ObjectBag', () => {
      const morpher = new ObjectBag({ a: 5, b: 10 }).to({ a: 10, b: 20 })

      expect(morpher).toEqual(any(Morphable))
      expect(morpher.type()).toBe(ObjectBag)
      expect(morpher.at(0.5)).toEqual(any(Object))
      expect(morpher.at(0.5).valueOf()).toEqual(
        objectContaining({ a: new SVGNumber(7.5), b: new SVGNumber(15) })
      )
    })

    it('creates a morphable from a color string', () => {
      let morpher = new Morphable().from('#fff').to('#000')

      expect(morpher).toEqual(any(Morphable))
      expect(morpher.type()).toBe(Color)
      expect(morpher.at(0.5)).toEqual(any(Color))
      expect(morpher.at(0.5).toHex()).toBe('#808080')

      morpher = new Morphable().from('rgb(255,255,255)').to('rgb(0,0,0)')

      expect(morpher).toEqual(any(Morphable))
      expect(morpher.type()).toBe(Color)
      expect(morpher.at(0.5)).toEqual(any(Color))
      expect(morpher.at(0.5).toHex()).toBe('#808080')
    })

    it('creates a morphable from path string', () => {
      const morpher = new Morphable().from('M 0 0 L 10 10').to('M 0 0 L 20 20')

      expect(morpher).toEqual(any(Morphable))
      expect(morpher.type()).toBe(PathArray)
      expect(morpher.at(0.5)).toEqual(any(PathArray))
      expect(morpher.at(0.5).toString()).toBe('M0 0L15 15 ')
    })

    it('creates a morphable from number string', () => {
      let morpher = new Morphable().from('10').to('20')

      expect(morpher).toEqual(any(Morphable))
      expect(morpher.type()).toBe(SVGNumber)
      expect(morpher.at(0.5)).toEqual(any(SVGNumber))
      expect(morpher.at(0.5).toString()).toBe('15')

      morpher = new Morphable().from('10px').to('20px')

      expect(morpher).toEqual(any(Morphable))
      expect(morpher.type()).toBe(SVGNumber)
      expect(morpher.at(0.5)).toEqual(any(SVGNumber))
      expect(morpher.at(0.5).toString()).toBe('15px')
    })

    it('creates a morphable from delimited string', () => {
      const morpher = new Morphable().from(' 0 1,  2  , 3  ').to('4,5,6,7')

      expect(morpher).toEqual(any(Morphable))
      expect(morpher.type()).toBe(SVGArray)
      expect(morpher.at(0.5)).toEqual(any(SVGArray))
      expect(morpher.at(0.5)).toEqual([2, 3, 4, 5])
    })

    it('creates a morphable from an array', () => {
      const morpher = new Morphable().from([0, 1, 2, 3]).to([4, 5, 6, 7])

      expect(morpher).toEqual(any(Morphable))
      expect(morpher.type()).toBe(SVGArray)
      expect(morpher.at(0.5)).toEqual(any(SVGArray))
      expect(morpher.at(0.5)).toEqual([2, 3, 4, 5])
    })

    it('converts the to-color to the from-type', () => {
      const morpher = new Color('#fff').to(new Color(1, 2, 3, 'hsl'))
      expect(new Color(morpher.from()).space).toBe('rgb')
      expect(morpher.at(0.5).space).toBe('rgb')
    })

    it('converts the from-color to the to-type', () => {
      const morpher = new Morphable().to(new Color(1, 2, 3, 'hsl')).from('#fff')
      expect(new Color(morpher.from()).space).toBe('hsl')
      expect(morpher.at(0.5).space).toBe('hsl')
    })
  })

  describe('from()', () => {
    it('sets the type of the runner', () => {
      const morpher = new Morphable().from(5)
      expect(morpher.type()).toBe(SVGNumber)
    })

    it('sets the from attribute to an array representation of the morphable type', () => {
      const morpher = new Morphable().from(5)
      expect(morpher.from()).toEqual(arrayContaining([5]))
    })
  })

  describe('type()', () => {
    it('sets the type of the runner', () => {
      const morpher = new Morphable().type(SVGNumber)
      expect(morpher._type).toBe(SVGNumber)
    })

    it('gets the type of the runner', () => {
      const morpher = new Morphable().type(SVGNumber)
      expect(morpher.type()).toBe(SVGNumber)
    })
  })

  describe('to()', () => {
    it('sets the type of the runner', () => {
      const morpher = new Morphable().to(5)
      expect(morpher.type()).toBe(SVGNumber)
    })

    it('sets the from attribute to an array representation of the morphable type', () => {
      const morpher = new Morphable().to(5)
      expect(morpher.to()).toEqual(arrayContaining([5]))
    })
  })

  describe('stepper()', () => {
    it('sets and gets the stepper of the Morphable', () => {
      const stepper = new Stepper()
      const morpher = new Morphable().stepper(stepper)
      expect(morpher.stepper()).toBe(stepper)
    })
  })

  describe('NonMorphable', () => {
    describe('()', () => {
      it('wraps any type into a NonMorphable from an array', () => {
        const non = new NonMorphable([5])
        expect(non.valueOf()).toBe(5)
      })

      it('wraps any type into a NonMorphable from any type', () => {
        expect(new NonMorphable(5).valueOf()).toBe(5)
        expect(new NonMorphable('Hello').valueOf()).toBe('Hello')
      })
    })

    describe('toArray()', () => {
      it('returns array representation of NonMorphable', () => {
        expect(new NonMorphable(5).toArray()).toEqual([5])
        expect(new NonMorphable('Hello').toArray()).toEqual(['Hello'])
      })
    })
  })

  describe('TransformBag', () => {
    describe('()', () => {
      it('creates an object which holds transformations for morphing by passing array', () => {
        const bag = new TransformBag([0, 1, 2, 3, 4, 5, 6, 7])
        expect(bag.toArray()).toEqual([0, 1, 2, 3, 4, 5, 6, 7])
      })

      it('creates an object which holds transformations for morphing by passing object', () => {
        const bag = new TransformBag({
          scaleX: 0,
          scaleY: 1,
          shear: 2,
          rotate: 3,
          translateX: 4,
          translateY: 5,
          originX: 6,
          originY: 7
        })

        expect(bag.toArray()).toEqual([0, 1, 2, 3, 4, 5, 6, 7])
      })
    })

    describe('toArray()', () => {
      it('creates an array out of the transform values', () => {
        const bag = new TransformBag([0, 1, 2, 3, 4, 5, 6, 7])
        expect(bag.toArray()).toEqual([0, 1, 2, 3, 4, 5, 6, 7])
      })
    })
  })

  describe('ObjectBag', () => {
    describe('()', () => {
      it('wraps an object into a morphable object by passing an array', () => {
        const bag = new ObjectBag([
          'foo',
          SVGNumber,
          2,
          1,
          '',
          'bar',
          SVGNumber,
          2,
          2,
          '',
          'baz',
          SVGNumber,
          2,
          3,
          ''
        ])
        expect(bag.values).toEqual([
          'foo',
          SVGNumber,
          2,
          1,
          '',
          'bar',
          SVGNumber,
          2,
          2,
          '',
          'baz',
          SVGNumber,
          2,
          3,
          ''
        ])
      })

      it('wraps an object into a morphable object by passing an object', () => {
        const bag = new ObjectBag({ foo: 1, bar: 2, baz: 3 })
        expect(bag.values).toEqual([
          'bar',
          SVGNumber,
          2,
          2,
          '',
          'baz',
          SVGNumber,
          2,
          3,
          '',
          'foo',
          SVGNumber,
          2,
          1,
          ''
        ])
      })

      it('wraps an object with morphable values in an ObjectBag', () => {
        const bag = new ObjectBag({ fill: new Color(), bar: 2 })
        expect(bag.values).toEqual([
          'bar',
          SVGNumber,
          2,
          2,
          '',
          'fill',
          Color,
          5,
          0,
          0,
          0,
          0,
          'rgb'
        ])
      })

      it('wraps an array with morphable representation in an ObjectBag', () => {
        const bag = new ObjectBag([
          'bar',
          SVGNumber,
          2,
          2,
          '',
          'fill',
          Color,
          5,
          0,
          0,
          0,
          0,
          'rgb'
        ])
        expect(bag.toArray()).toEqual([
          'bar',
          SVGNumber,
          2,
          2,
          '',
          'fill',
          Color,
          5,
          0,
          0,
          0,
          0,
          'rgb'
        ])
      })
    })

    describe('toArray()', () => {
      it('creates an array out of the object', () => {
        const bag = new ObjectBag({ foo: 1, bar: 2, baz: 3 })
        expect(bag.toArray()).toEqual([
          'bar',
          SVGNumber,
          2,
          2,
          '',
          'baz',
          SVGNumber,
          2,
          3,
          '',
          'foo',
          SVGNumber,
          2,
          1,
          ''
        ])
      })

      it('creates a flattened array out of the object with morphable values', () => {
        const bag = new ObjectBag({ fill: new Color(), bar: 2 })
        expect(bag.toArray()).toEqual([
          'bar',
          SVGNumber,
          2,
          2,
          '',
          'fill',
          Color,
          5,
          0,
          0,
          0,
          0,
          'rgb'
        ])
      })
    })

    describe('valueOf()', () => {
      it('creates morphable objects from the stored values', () => {
        const bag = new ObjectBag({ foo: 1, bar: 2, baz: 3 })
        expect(bag.valueOf()).toEqual({
          foo: new SVGNumber(1),
          bar: new SVGNumber(2),
          baz: new SVGNumber(3)
        })
      })

      it('creates also morphable objects from the stored values', () => {
        const bag = new ObjectBag({ fill: new Color(), bar: 2 })
        expect(bag.valueOf()).toEqual({
          fill: objectContaining(new Color()),
          bar: new SVGNumber(2)
        })
      })
    })

    describe('align()', () => {
      it('aligns color spaces between two object bags', () => {
        const bag1 = new ObjectBag({ x: 1, y: '#fff' })
        const bag2 = new ObjectBag({ x: 2, y: new Color().hsl() })
        bag1.align(bag2.toArray())
        expect(bag1.toArray()).toEqual([
          'x',
          SVGNumber,
          2,
          1,
          '',
          'y',
          Color,
          5,
          0,
          0,
          100,
          0,
          'hsl'
        ])
      })
    })
  })
})
