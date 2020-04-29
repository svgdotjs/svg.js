/* globals describe, expect, it, beforeEach */

import { PathArray, Box } from '../../../src/main.js'

describe('PathArray.js', () => {
  let p1, p2, p3, p4, p5, p6, p7

  beforeEach(() => {
    p1 = new PathArray('m10 10 h 80 v 80 h -80 l 300 400 z')
    p2 = new PathArray('m10 80 c 40 10 65 10 95 80 s 150 150 180 80 t 300 300 q 52 10 95 80 z')
    p3 = new PathArray('m80 80 A 45 45, 0, 0, 0, 125 125 L 125 80 z')
    p4 = new PathArray('M215.458,245.23c0,0,77.403,0,94.274,0S405,216.451,405,138.054S329.581,15,287.9,15c-41.68,0-139.924,0-170.688,0C86.45,15,15,60.65,15,134.084c0,73.434,96.259,112.137,114.122,112.137C146.984,246.221,215.458,245.23,215.458,245.23z')
    p5 = new PathArray('M10 10-45-30.5.5 .89L2e-2.5.5.5-.5C.5.5.5.5.5.5L-3-4z')
    p6 = new PathArray('m 0,0 0,3189 2209,0 0,-3189 -2209,0 z m 154,154 1901,0 0,2881 -1901,0 0,-2881 z')
    p7 = new PathArray('m 0,0 a 45 45, 0, 0, 0, 125 125')
  })

  it('converts to absolute values', () => {
    expect(p1.toString()).toBe('M10 10H90V90H10L310 490Z ')
    expect(p2.toString()).toBe('M10 80C50 90 75 90 105 160S255 310 285 240T585 540Q637 550 680 620Z ')
    expect(p3.toString()).toBe('M80 80A45 45 0 0 0 125 125L125 80Z ')
    expect(p4.toString()).toBe('M215.458 245.23C215.458 245.23 292.861 245.23 309.73199999999997 245.23S405 216.451 405 138.054S329.581 15 287.9 15C246.21999999999997 15 147.97599999999997 15 117.21199999999999 15C86.45 15 15 60.65 15 134.084C15 207.518 111.259 246.221 129.122 246.221C146.984 246.221 215.458 245.23 215.458 245.23Z ')
    expect(p6.toString()).toBe('M0 0L0 3189L2209 3189L2209 0L0 0ZM154 154L2055 154L2055 3035L154 3035L154 154Z ')
    expect(p7.toString()).toBe('M0 0A45 45 0 0 0 125 125 ')
  })

  it('parses difficult syntax correctly', () => {
    expect(p5.toString()).toBe('M10 10L-45 -30.5L0.5 0.89L0.02 0.5L0.5 -0.5C0.5 0.5 0.5 0.5 0.5 0.5L-3 -4Z ')
  })

  it('parses flat arrays correctly', () => {
    const arr = new PathArray([ 'M', 0, 0, 'L', 100, 100, 'z' ])
    expect(arr.toString()).toBe('M0 0L100 100Z ')
  })

  it('parses nested arrays correctly', () => {
    const arr = new PathArray([ [ 'M', 0, 0 ], [ 'L', 100, 100 ], [ 'z' ] ])
    expect(arr.toString()).toBe('M0 0L100 100Z ')
  })

  // this test is designed to cover a certain line but it doesnt work because of #608
  it('returns the valueOf when PathArray is given', () => {
    const p = new PathArray('m10 10 h 80 v 80 h -80 l 300 400 z')

    expect((new PathArray(p))).toEqual(p)
  })

  it('can handle all formats which can be used', () => {
    // when no command is specified after move, line is used automatically (specs say so)
    expect(new PathArray('M10 10 80 80 30 30 Z').toString()).toBe('M10 10L80 80L30 30Z ')

    // parsing can handle 0.5.3.3.2 stuff
    expect(new PathArray('M10 10L.5.5.3.3Z').toString()).toBe('M10 10L0.5 0.5L0.3 0.3Z ')
  })

  describe('move()', () => {
    it('moves all points in a straight path', () => {
      expect(p1.move(100, 200).toString()).toBe('M100 200H180V280H100L400 680Z ')
    })

    it('moves all points in a curved path', () => {
      expect(p2.move(100, 200).toString()).toBe('M100 200C140 210 165 210 195 280S345 430 375 360T675 660Q727 670 770 740Z ')
    })

    it('moves all points in a arc path', () => {
      expect(p3.move(100, 200).toString()).toBe('M100 200A45 45 0 0 0 145 245L145 200Z ')
    })

    it('does nothing if passed number is not a number', () => {
      expect(p3.move()).toEqual(p3)
    })
  })

  describe('size()', () => {
    it('resizes all points in a straight path', () => {
      expect(p1.size(600, 200).toString()).toBe('M10 10H170V43.333333333333336H10L610 210Z ')
    })

    it('resizes all points in a curved path', () => {
      expect(p2.size(600, 200).toString()).toBe('M10 80C45.82089552238806 83.70370370370371 68.2089552238806 83.70370370370371 95.07462686567165 109.62962962962963S229.40298507462686 165.1851851851852 256.2686567164179 139.25925925925927T524.9253731343283 250.37037037037038Q571.4925373134329 254.07407407407408 610 280Z ')
    })

    it('resizes all points in a arc path', () => {
      const expected = [
        [ 'M', 80, 80 ],
        [ 'A', 600, 200, 0, 0, 0, 680, 280 ],
        [ 'L', 680, 80 ],
        [ 'Z' ]
      ]

      const toBeTested = p3.size(600, 200)

      for (let i = toBeTested.length; i--;) {
        expect(toBeTested[i].shift().toUpperCase()).toBe(expected[i].shift().toUpperCase())
        for (let j = toBeTested[i].length; j--;) {
          expect(toBeTested[i][j]).toBeCloseTo(expected[i][j])
        }
      }
    })
  })

  describe('bbox()', () => {
    it('calculates the bounding box of the PathArray', () => {
      const box = new PathArray('M0 0 L 10 10').bbox()
      expect(box).toEqual(new Box(0, 0, 10, 10))
    })
  })
})
