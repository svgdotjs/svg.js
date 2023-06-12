/* globals describe, expect, it */

import { regex } from '../../../../src/main.js'

describe('regex.js', () => {
  describe('numberAndUnit', () => {
    it('matches number and unit 12px', () => {
      const match = '12px'.match(regex.numberAndUnit)
      expect(match[1]).toBe('12')
      expect(match[5]).toBe('px')
    })

    it('matches number and unit 12', () => {
      const match = '12'.match(regex.numberAndUnit)
      expect(match[1]).toBe('12')
      expect(match[5]).toBe('')
    })

    it('matches number and unit 12%', () => {
      const match = '12%'.match(regex.numberAndUnit)
      expect(match[1]).toBe('12')
      expect(match[5]).toBe('%')
    })

    it('matches number and unit -12%', () => {
      const match = '-12%'.match(regex.numberAndUnit)
      expect(match[1]).toBe('-12')
      expect(match[5]).toBe('%')
    })

    it('matches number and unit -12.123%', () => {
      const match = '-12.123%'.match(regex.numberAndUnit)
      expect(match[1]).toBe('-12.123')
      expect(match[5]).toBe('%')
    })

    it('matches number and unit -12.123e12%', () => {
      const match = '-12.123e12%'.match(regex.numberAndUnit)
      expect(match[1]).toBe('-12.123e12')
      expect(match[5]).toBe('%')
    })
  })

  describe('hex', () => {
    it('matches a 6 digit hex', () => {
      const match = '#123456'.match(regex.hex)
      expect(match[1]).toBe('12')
      expect(match[2]).toBe('34')
      expect(match[3]).toBe('56')
    })

    /* it('does not matches without #', () => {
      const match = '123456'.match(regex.hex)
      expect(match).toBe(null)
    }) */

    it('does not matches other then 0-f #', () => {
      const match = '#09afhz'.match(regex.hex)
      expect(match).toBe(null)
    })

    it('does not matches non full hex', () => {
      const match = '#aaa'.match(regex.hex)
      expect(match).toBe(null)
    })
  })

  describe('rgb', () => {
    it('matches rgb values of rgb(...) command', () => {
      const match = 'rgb(12,34,56)'.match(regex.rgb)
      expect(match[1]).toBe('12')
      expect(match[2]).toBe('34')
      expect(match[3]).toBe('56')
    })

    it('does not match in the wrong format', () => {
      expect('rgb(   12 , 34  ,     56)'.match(regex.rgb)).toBe(null)
      expect('12,34,56'.match(regex.rgb)).toBe(null)
      expect('(12,34,56)'.match(regex.rgb)).toBe(null)
      expect('rgb(aa,34,56)'.match(regex.rgb)).toBe(null)
      expect('rgb(12,34)'.match(regex.rgb)).toBe(null)
    })
  })

  describe('reference', () => {
    it('matches a reference', () => {
      const match = '#soMe_cRazy-1_id'.match(regex.reference)
      expect(match[1]).toBe('#soMe_cRazy-1_id')
    })

    it('tries to match malformed references', () => {
      const match = '#some_crazy%-1_id'.match(regex.reference)
      expect(match[0]).toBe('#some_crazy')
    })
  })

  describe('transforms', () => {
    it('splits a transform chain', () => {
      const split =
        'rotate(34) translate(1,2), translate(1 ,  3),rotate(12)    ,   something(1,2,3)'.split(
          regex.transforms
        )
      expect(split).toEqual([
        'rotate(34',
        'translate(1,2',
        'translate(1 ,  3',
        'rotate(12',
        'something(1,2,3',
        ''
      ])
    })
  })

  describe('whitespace', () => {
    it('replaces all whitespaces', () => {
      expect('   \n \r   \t   '.replace(regex.whitespace, ' ')).toBe(
        '             '
      )
    })
  })

  describe('isHex', () => {
    it('returns true when testing hex values', () => {
      expect(regex.isHex.test('#123')).toBe(true)
      expect(regex.isHex.test('#abc')).toBe(true)
      expect(regex.isHex.test('#123456')).toBe(true)
      expect(regex.isHex.test('#abcdef')).toBe(true)
      expect(regex.isHex.test('#16fde9')).toBe(true)
    })

    it('returns false when testing non hex values', () => {
      expect(regex.isHex.test('#12')).toBe(false)
      expect(regex.isHex.test('abc')).toBe(false)
      expect(regex.isHex.test('#1234563')).toBe(false)
      expect(regex.isHex.test('#kasdhs')).toBe(false)
      expect(regex.isHex.test('#abcd')).toBe(false)
    })
  })

  describe('isRgb', () => {
    it('returns true when testing rgb values', () => {
      expect(regex.isRgb.test('rgb(1,2,3)')).toBe(true)
      expect(regex.isRgb.test('rgb( 3,   1,3)')).toBe(true)
    })

    it('returns false when testing non rgb values', () => {
      expect(regex.isRgb.test('hsl(1,2,3)')).toBe(false)
      expect(regex.isRgb.test('#123')).toBe(false)
      expect(regex.isRgb.test('something')).toBe(false)
    })
  })

  describe('isBlank', () => {
    it('returns true if something is blank', () => {
      expect(regex.isBlank.test('')).toBe(true)
      expect(regex.isBlank.test(' ')).toBe(true)
      expect(regex.isBlank.test('\n')).toBe(true)
      expect(regex.isBlank.test('\r')).toBe(true)
      expect(regex.isBlank.test('\t')).toBe(true)
      expect(regex.isBlank.test(' \n\r\t')).toBe(true)
    })

    it('returns false if something is not blank', () => {
      expect(regex.isBlank.test('a')).toBe(false)
      expect(regex.isBlank.test('1')).toBe(false)
    })
  })

  describe('isNumber', () => {
    it('returns true if something is a number', () => {
      expect(regex.isNumber.test('123')).toBe(true)
      expect(regex.isNumber.test('-123')).toBe(true)
      expect(regex.isNumber.test('-12.3')).toBe(true)
      expect(regex.isNumber.test('-12.3e12')).toBe(true)
      expect(regex.isNumber.test('-12.3e-12')).toBe(true)
      expect(regex.isNumber.test('+12.3e-12')).toBe(true)
      expect(regex.isNumber.test('+12.3E-12')).toBe(true)
    })

    it('returns false if something is not a number', () => {
      expect(regex.isNumber.test('a')).toBe(false)
      expect(regex.isNumber.test('-a')).toBe(false)
      expect(regex.isNumber.test('-12a')).toBe(false)
      expect(regex.isNumber.test('-12.3a12')).toBe(false)
      expect(regex.isNumber.test('-12.3e-1a')).toBe(false)
      expect(regex.isNumber.test('12.12.12')).toBe(false)
      expect(regex.isNumber.test('12.12e12.3')).toBe(false)
      expect(regex.isNumber.test('12.12e12e4')).toBe(false)
    })
  })

  describe('isImage', () => {
    it('returns true if something is an image filename', () => {
      expect(regex.isImage.test('a.jpg')).toBe(true)
      expect(regex.isImage.test('a.jpeg')).toBe(true)
      expect(regex.isImage.test('a.png')).toBe(true)
      expect(regex.isImage.test('a.gif')).toBe(true)
      expect(regex.isImage.test('a.svg')).toBe(true)
    })

    it('returns false if something is not an image filename', () => {
      expect(regex.isImage.test('a.abc')).toBe(false)
      expect(regex.isImage.test('a.txt')).toBe(false)
      expect(regex.isImage.test('a.doc')).toBe(false)
    })
  })

  describe('delimiter', () => {
    it('splits at whitespace and comma', () => {
      const split = '1,2 3 , 4   5,,  6'.split(regex.delimiter)
      expect(split).toEqual(['1', '2', '3', '4', '5', '6'])
    })
  })

  describe('isPathLetter', () => {
    it('returns true if something is a path letter', () => {
      'MLHVCSQTAZmlhvcsqtaz'.split('').forEach((l) => {
        expect(regex.isPathLetter.test(l)).toBe(true)
      })
    })

    it('returns false if something is not path letter', () => {
      '123biuBIU$%&'.split('').forEach((l) => {
        expect(regex.isPathLetter.test(l)).toBe(false)
      })
    })
  })
})
