/* globals describe, expect, it, beforeEach */

import { Color } from '../../../src/main.js'

describe('Color.js', () => {
  var color

  beforeEach(() => {
    color = new Color({ r: 0, g: 102, b: 255 })
  })

  describe('construct: constructs a color in different formats', () => {

    it('constructs a color from an object in the correct color space', () => {

      // Try in rgb
      const color = new Color({ r: 255, g: 0, b: 128 })
      expect(color.r).toBe(255)
      expect(color.g).toBe(0)
      expect(color.b).toBe(128)
      expect(color.space).toBe('rgb')

      // Try in cmyk
      const color2 = new Color({ c: 20, y: 15, m: 10, k: 5 })
      expect(color2.c).toBe(20)
      expect(color2.m).toBe(10)
      expect(color2.y).toBe(15)
      expect(color2.k).toBe(5)
      expect(color2.space).toBe('cmyk')
    })

    it('constructs a color from an array', () => {
      const color = new Color([ 30, 24, 50 ])
      expect(color.r).toBe(30)
      expect(color.g).toBe(24)
      expect(color.b).toBe(50)
      expect(color.space).toBe('rgb')
    })

    it('constructs a color from an array with space in array', () => {
      const color = new Color([ 50, 50, 5, 'lab' ])
      expect(color.l).toBe(50)
      expect(color.a).toBe(50)
      expect(color.b).toBe(5)
      expect(color.space).toBe('lab')
    })

    it('constructs a color from an array with space given', () => {
      const color = new Color([ 50, 50, 5 ], 'lab')
      expect(color.l).toBe(50)
      expect(color.a).toBe(50)
      expect(color.b).toBe(5)
      expect(color.space).toBe('lab')
    })

    it('correclty parses an rgb string', () => {
      const color = new Color('rgb(255,0,128)')
      expect(color.r).toBe(255)
      expect(color.g).toBe(0)
      expect(color.b).toBe(128)
    })

    it('correclty parses a 3 digit hex string', () => {
      color = new Color('#f06')
      expect(color.r).toBe(255)
      expect(color.g).toBe(0)
      expect(color.b).toBe(102)
    })

    it('correclty parses a 6 digit hex string', () => {
      color = new Color('#0066ff')
      expect(color.r).toBe(0)
      expect(color.g).toBe(102)
      expect(color.b).toBe(255)
    })

  })

  describe('input and output: Importing and exporting colors', () => {
    describe('toHex()', () => {
      it('returns a hex color', () => {
        expect(color.toHex()).toBe('#0066ff')
      })
    })

    describe('toRgb()', () => {
      it('returns a rgb string color', () => {
        expect(color.toRgb()).toBe('rgb(0,102,255)')
      })
    })
  })

  describe('color spaces: The color spaces supported by our library', () => {

    describe('lab()', () => {
      it('can convert rgb to lab', () => {
        const color = new Color(255, 0, 128)
        const lab = color.lab()
        expect(lab.l).toBeCloseTo(54.88, 1)
        expect(lab.a).toBeCloseTo(84.55, 1)
        expect(lab.b).toBeCloseTo(4.065, 1)
        expect(lab.space).toBe('lab')
      })

      it('can convert from lab to rgb', () => {
        const lab = new Color(54.88, 84.55, 4.065, 'lab')
        const rgb = lab.rgb()
        expect(rgb.r).toBeCloseTo(255, 0)
        expect(rgb.g).toBeCloseTo(0, 0)
        expect(rgb.b).toBeCloseTo(128, 0)
        expect(rgb.space).toBe('rgb')
      })

      it('is invertable', () => {
        const { r, g, b } = new Color(255, 0, 128).lab().rgb()
        expect(r).toBeCloseTo(255, 0)
        expect(g).toBeCloseTo(0, 0)
        expect(b).toBeCloseTo(128, 0)
      })

      it('handles black', () => {
        const color = new Color(0, 0, 0).lab().rgb()
        expect(color.r).toBeCloseTo(0, 0)
        expect(color.g).toBeCloseTo(0, 0)
        expect(color.b).toBeCloseTo(0, 0)
        expect(color.toHex()).toBe('#000000')
      })

      it('handles white', () => {
        const color = new Color(255, 255, 255).lab().rgb()
        expect(color.r).toBeCloseTo(255, 0)
        expect(color.g).toBeCloseTo(255, 0)
        expect(color.b).toBeCloseTo(255, 0)
        expect(color.toHex()).toBe('#ffffff')
      })
    })

    describe('lch()', () => {
      it('can convert rgb to lch', () => {
        const color = new Color(255, 0, 128)
        const lch = color.lch()
        expect(lch.l).toBeCloseTo(54.88, 1)
        expect(lch.c).toBeCloseTo(84.65, 1)
        expect(lch.h).toBeCloseTo(2.75, 1)
        expect(lch.space).toBe('lch')
      })

      it('can convert from lch to rgb', () => {
        const lch = new Color(54.88, 84.65, 2.75, 'lch')
        const rgb = lch.rgb()
        expect(rgb.r).toBeCloseTo(255, 0)
        expect(rgb.g).toBeCloseTo(0, 0)
        expect(rgb.b).toBeCloseTo(128, 0)
        expect(rgb.space).toBe('rgb')
      })

      it('is invertable', () => {
        const { r, g, b } = new Color(255, 0, 128).lch().rgb()
        expect(r).toBeCloseTo(255, 0)
        expect(g).toBeCloseTo(0, 0)
        expect(b).toBeCloseTo(128, 0)
      })

      it('handles black', () => {
        const color = new Color(0, 0, 0).lch().rgb()
        expect(color.r).toBeCloseTo(0, 0)
        expect(color.g).toBeCloseTo(0, 0)
        expect(color.b).toBeCloseTo(0, 0)
        expect(color.toHex()).toBe('#000000')
      })

      it('handles white', () => {
        const color = new Color(255, 255, 255).lch().rgb()
        expect(color.r).toBeCloseTo(255, 0)
        expect(color.g).toBeCloseTo(255, 0)
        expect(color.b).toBeCloseTo(255, 0)
        expect(color.toHex()).toBe('#ffffff')
      })
    })

    describe('hsl()', () => {

      it('can convert from rgb to hsl', () => {
        const color = new Color(255, 0, 128)
        const hsl = color.hsl()
        expect(hsl.h).toBeCloseTo(329.88, 1)
        expect(hsl.s).toBeCloseTo(100, 1)
        expect(hsl.l).toBeCloseTo(50, 1)
        expect(hsl.space).toBe('hsl')
      })

      it('can convert from hsl to rgb', () => {
        const hsl = new Color(329.88, 100, 50, 'hsl')
        const rgb = hsl.rgb()
        expect(rgb.r).toBeCloseTo(255, 0)
        expect(rgb.g).toBeCloseTo(0, 0)
        expect(rgb.b).toBeCloseTo(128, 0)
        expect(rgb.space).toBe('rgb')
      })

      it('is invertable', () => {
        const { r, g, b } = new Color(255, 0, 128).hsl().rgb()
        expect(r).toBeCloseTo(255, 0)
        expect(g).toBeCloseTo(0, 0)
        expect(b).toBeCloseTo(128, 0)
      })

      it('handles black', () => {
        const color = new Color(0, 0, 0).hsl().rgb()
        expect(color.r).toBeCloseTo(0, 0)
        expect(color.g).toBeCloseTo(0, 0)
        expect(color.b).toBeCloseTo(0, 0)
        expect(color.toHex()).toBe('#000000')
      })

      it('handles white', () => {
        const color = new Color(255, 255, 255).hsl().rgb()
        expect(color.r).toBeCloseTo(255, 0)
        expect(color.g).toBeCloseTo(255, 0)
        expect(color.b).toBeCloseTo(255, 0)
        expect(color.toHex()).toBe('#ffffff')
      })
    })

    describe('cmyk()', () => {

      it('can convert from rgb to cmyk', () => {
        const color = new Color(255, 0, 128)
        const cmyk = color.cmyk()
        expect(cmyk.c).toBeCloseTo(0, 1)
        expect(cmyk.m).toBeCloseTo(1, 1)
        expect(cmyk.y).toBeCloseTo(0.49, 1)
        expect(cmyk.k).toBeCloseTo(0, 1)
        expect(cmyk.space).toBe('cmyk')
      })

      it('can convert from cmyk to rgb', () => {
        const color = new Color(0, 1, 0.49, 0, 'cmyk')
        const rgb = color.rgb()
        expect(rgb.r).toBeCloseTo(255, -1)
        expect(rgb.g).toBeCloseTo(0, -1)
        expect(rgb.b).toBeCloseTo(128, -1)
        expect(rgb.space).toBe('rgb')
      })

      it('is invertable', () => {
        const { r, g, b } = new Color(255, 0, 128).cmyk().rgb()
        expect(r).toBeCloseTo(255, 0)
        expect(g).toBeCloseTo(0, 0)
        expect(b).toBeCloseTo(128, 0)
      })

      it('handles black', () => {
        const color = new Color(0, 0, 0).cmyk().rgb()
        expect(color.r).toBeCloseTo(0, 0)
        expect(color.g).toBeCloseTo(0, 0)
        expect(color.b).toBeCloseTo(0, 0)
        expect(color.toHex()).toBe('#000000')
      })

      it('handles white', () => {
        const color = new Color(255, 255, 255).cmyk().rgb()
        expect(color.r).toBeCloseTo(255, 0)
        expect(color.g).toBeCloseTo(255, 0)
        expect(color.b).toBeCloseTo(255, 0)
        expect(color.toHex()).toBe('#ffffff')
      })

    })

  })

})
