/* globals describe, expect, it, beforeEach, jasmine */

import { Number as SVGNumber } from '../../../src/main.js'

const { any } = jasmine

describe('Number.js', () => {
  let number

  beforeEach(() => {
    number = new SVGNumber()
  })

  describe('()', () => {
    it('is zero', () => {
      expect(number.value).toBe(0)
    })

    it('has a blank unit', () => {
      expect(number.unit).toBe('')
    })

    it('accepts the unit as a second argument', () => {
      number = new SVGNumber(30, '%')
      expect(number.value).toBe(30)
      expect(number.unit).toBe('%')
    })

    it('parses a pixel value', () => {
      number = new SVGNumber('20px')
      expect(number.value).toBe(20)
      expect(number.unit).toBe('px')
    })

    it('parses a percent value', () => {
      number = new SVGNumber('99%')
      expect(number.value).toBe(0.99)
      expect(number.unit).toBe('%')
    })

    it('parses a seconds value', () => {
      number = new SVGNumber('2s')
      expect(number.value).toBe(2000)
      expect(number.unit).toBe('s')
    })

    it('parses a negative percent value', () => {
      number = new SVGNumber('-89%')
      expect(number.value).toBe(-0.89)
      expect(number.unit).toBe('%')
    })

    it('falls back to 0 if given value is NaN', () => {
      number = new SVGNumber(NaN)
      expect(number.value).toBe(0)
    })

    it('falls back to maximum value if given number is positive infinite', () => {
      // eslint-disable-next-line no-loss-of-precision
      number = new SVGNumber(1.7976931348623157e10308)
      expect(number.value).toBe(3.4e38)
    })

    it('falls back to minimum value if given number is negative infinite', () => {
      // eslint-disable-next-line no-loss-of-precision
      number = new SVGNumber(-1.7976931348623157e10308)
      expect(number.value).toBe(-3.4e38)
    })
  })

  describe('toString()', () => {
    it('converts the number to a string', () => {
      expect(number.toString()).toBe('0')
    })

    it('appends the unit', () => {
      number.value = 1.21
      number.unit = 'px'
      expect(number.toString()).toBe('1.21px')
    })

    it('converts percent values properly', () => {
      number.value = 1.36
      number.unit = '%'
      expect(number.toString()).toBe('136%')
    })

    it('converts second values properly', () => {
      number.value = 2500
      number.unit = 's'
      expect(number.toString()).toBe('2.5s')
    })
  })

  describe('valueOf()', () => {
    it('returns a numeric value for default units', () => {
      expect(typeof number.valueOf()).toBe('number')
      number = new SVGNumber('12')
      expect(typeof number.valueOf()).toBe('number')
      number = new SVGNumber(13)
      expect(typeof number.valueOf()).toBe('number')
    })

    it('returns a numeric value for pixel units', () => {
      number = new SVGNumber('10px')
      expect(typeof number.valueOf()).toBe('number')
    })

    it('returns a numeric value for percent units', () => {
      number = new SVGNumber('20%')
      expect(typeof number.valueOf()).toBe('number')
    })

    it('converts to a primitive when multiplying', () => {
      number.value = 80
      expect(number * 4).toBe(320)
    })
  })

  describe('plus()', () => {
    it('returns a new instance', () => {
      expect(number.plus(4.5)).not.toBe(number)
      expect(number.plus(4.5)).toEqual(any(SVGNumber))
    })

    it('adds a given number', () => {
      expect(number.plus(3.5).valueOf()).toBe(3.5)
    })

    it('adds a given percentage value', () => {
      expect(number.plus('225%').valueOf()).toBe(2.25)
    })

    it('adds a given pixel value', () => {
      expect(number.plus('83px').valueOf()).toBe(83)
    })

    it('use the unit of this number as the unit of the returned number by default', () => {
      expect(new SVGNumber('12s').plus('3%').unit).toBe('s')
    })

    it('use the unit of the passed number as the unit of the returned number when this number as no unit', () => {
      expect(number.plus('15%').unit).toBe('%')
    })
  })

  describe('minus()', () => {
    it('subtracts a given number', () => {
      expect(number.minus(3.7).valueOf()).toBe(-3.7)
    })

    it('subtracts a given percentage value', () => {
      expect(number.minus('223%').valueOf()).toBe(-2.23)
    })

    it('subtracts a given pixel value', () => {
      expect(number.minus('85px').valueOf()).toBe(-85)
    })

    it('use the unit of this number as the unit of the returned number by default', () => {
      expect(new SVGNumber('12s').minus('3%').unit).toBe('s')
    })

    it('use the unit of the passed number as the unit of the returned number when this number as no unit', () => {
      expect(number.minus('15%').unit).toBe('%')
    })
  })

  describe('times()', () => {
    beforeEach(() => {
      number = number.plus(4)
    })

    it('multiplies with a given number', () => {
      expect(number.times(3).valueOf()).toBe(12)
    })

    it('multiplies with a given percentage value', () => {
      expect(number.times('110%').valueOf()).toBe(4.4)
    })

    it('multiplies with a given pixel value', () => {
      expect(number.times('85px').valueOf()).toBe(340)
    })

    it('use the unit of this number as the unit of the returned number by default', () => {
      expect(new SVGNumber('12s').times('3%').unit).toBe('s')
    })

    it('use the unit of the passed number as the unit of the returned number when this number as no unit', () => {
      expect(number.times('15%').unit).toBe('%')
    })
  })

  describe('divide()', () => {
    beforeEach(() => {
      number = number.plus(90)
    })

    it('divides by a given number', () => {
      expect(number.divide(3).valueOf()).toBe(30)
    })

    it('divides by a given percentage value', () => {
      expect(number.divide('3000%').valueOf()).toBe(3)
    })

    it('divides by a given pixel value', () => {
      expect(number.divide('45px').valueOf()).toBe(2)
    })

    it('use the unit of this number as the unit of the returned number by default', () => {
      expect(new SVGNumber('12s').divide('3%').unit).toBe('s')
    })

    it('use the unit of the passed number as the unit of the returned number when this number as no unit', () => {
      expect(number.divide('15%').unit).toBe('%')
    })
  })

  describe('convert()', () => {
    it('changes the unit of the number', () => {
      const number = new SVGNumber('12px').convert('%')
      expect(number.toString()).toBe('1200%')
    })
  })
})
