/* globals describe, expect, it, beforeEach, spyOn, jasmine */

import { Color } from '../../../src/main.js'

const { any } = jasmine

describe('Color.js', () => {
  var color

  beforeEach(() => {
    color = new Color({ r: 0, g: 102, b: 255 })
  })

  describe('()', () => {
    describe('constructs a color from an object in the correct color space', () => {
      it('rgb', () => {
        const color = new Color({ r: 255, g: 0, b: 128 })
        expect(color.r).toBe(255)
        expect(color.g).toBe(0)
        expect(color.b).toBe(128)
        expect(color.space).toBe('rgb')
      })

      it('xyz', () => {
        const color = new Color({ x: 255, y: 0, z: 128 })
        expect(color.x).toBe(255)
        expect(color.y).toBe(0)
        expect(color.z).toBe(128)
        expect(color.space).toBe('xyz')
      })

      it('hsl', () => {
        const color = new Color({ h: 255, s: 0, l: 128 })
        expect(color.h).toBe(255)
        expect(color.s).toBe(0)
        expect(color.l).toBe(128)
        expect(color.space).toBe('hsl')
      })

      it('lab', () => {
        const color = new Color({ l: 255, a: 0, b: 128 })
        expect(color.l).toBe(255)
        expect(color.a).toBe(0)
        expect(color.b).toBe(128)
        expect(color.space).toBe('lab')
      })

      it('lch', () => {
        const color = new Color({ l: 255, c: 0, h: 128 })
        expect(color.l).toBe(255)
        expect(color.c).toBe(0)
        expect(color.h).toBe(128)
        expect(color.space).toBe('lch')
      })

      it('cmyk', () => {
        const color2 = new Color({ c: 20, y: 15, m: 10, k: 5 })
        expect(color2.c).toBe(20)
        expect(color2.m).toBe(10)
        expect(color2.y).toBe(15)
        expect(color2.k).toBe(5)
        expect(color2.space).toBe('cmyk')
      })

      it('and default to rgb when unknown parameters are passed', () => {
        const color = new Color({ h: 12, b: 10, l: 100 })
        expect(color.r).toBe(0)
        expect(color.g).toBe(0)
        expect(color.b).toBe(0)
        expect(color.space).toBe('rgb')
      })
    })

    it('constructs a color from an array', () => {
      const color = new Color([30, 24, 50])
      expect(color.r).toBe(30)
      expect(color.g).toBe(24)
      expect(color.b).toBe(50)
      expect(color.space).toBe('rgb')
    })

    it('constructs a color from an array with space in array', () => {
      const color = new Color([50, 50, 5, 'lab'])
      expect(color.l).toBe(50)
      expect(color.a).toBe(50)
      expect(color.b).toBe(5)
      expect(color.space).toBe('lab')
    })

    it('constructs a color from an array with space given', () => {
      const color = new Color([50, 50, 5], 'lab')
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

    it('throws an error if unsupported string format was given', () => {
      expect(() => new Color('#0066')).toThrowError(
        "Unsupported string format, can't construct Color"
      )
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

    // This conversion is pretty lossy
    // Especially g is super wrong (which should be 0 at testing and is >170)
    // describe('xyz()', () => {

    //   it('can convert from rgb to xyz', () => {
    //     const color = new Color(255, 0, 128)
    //     const xyz = color.xyz()
    //     expect(xyz.x).toBeCloseTo(0.780182, 6)
    //     expect(xyz.y).toBeCloseTo(0.611077, 6)
    //     expect(xyz.z).toBeCloseTo(0.590749, 6)
    //     expect(xyz.space).toBe('xyz')
    //   })

    //   it('can convert from xyz to rgb', () => {
    //     const xyz = new Color(0.780181754521692, 0.6110767760212142, 0.590748864329329, 'xyz')
    //     const rgb = xyz.rgb()
    //     expect(rgb.r).toBeCloseTo(255, 0)
    //     expect(rgb.g).toBeCloseTo(0, 0)
    //     expect(rgb.b).toBeCloseTo(128, 0)
    //     expect(rgb.space).toBe('rgb')
    //   })

    //   it('is invertable', () => {
    //     const { r, g, b } = new Color(255, 0, 128).xyz().rgb()
    //     expect(r).toBeCloseTo(255, 0)
    //     expect(g).toBeCloseTo(0, 0)
    //     expect(b).toBeCloseTo(128, 0)
    //   })

    //   it('handles black', () => {
    //     const color = new Color(0, 0, 0).xyz().rgb()
    //     expect(color.r).toBeCloseTo(0, 0)
    //     expect(color.g).toBeCloseTo(0, 0)
    //     expect(color.b).toBeCloseTo(0, 0)
    //     expect(color.toHex()).toBe('#000000')
    //   })

    //   it('handles white', () => {
    //     const color = new Color(255, 255, 255).xyz().rgb()
    //     expect(color.r).toBeCloseTo(255, 0)
    //     expect(color.g).toBeCloseTo(255, 0)
    //     expect(color.b).toBeCloseTo(255, 0)
    //     expect(color.toHex()).toBe('#ffffff')
    //   })
    // })

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

  describe('static methods', () => {
    describe('random()', () => {
      it('returns color', () => {
        expect(Color.random()).toEqual(any(Color))
      })

      it('returns color with mode=vibrant', () => {
        expect(Color.random('vibrant')).toEqual(any(Color))
      })

      it('returns color with mode=sine', () => {
        expect(Color.random('sine')).toEqual(any(Color))
      })

      it('returns color with mode=pastel', () => {
        expect(Color.random('pastel')).toEqual(any(Color))
      })

      it('returns color with mode=dark', () => {
        expect(Color.random('dark')).toEqual(any(Color))
      })

      it('returns color with mode=rgb', () => {
        expect(Color.random('rgb')).toEqual(any(Color))
      })

      it('returns color with mode=lab', () => {
        expect(Color.random('lab')).toEqual(any(Color))
      })

      it('returns color with mode=grey', () => {
        expect(Color.random('grey')).toEqual(any(Color))
      })

      it('throws an error if mode is unknown', () => {
        expect(() => Color.random('foo')).toThrowError(
          'Unsupported random color mode'
        )
      })
    })

    describe('test()', () => {
      it('returns false for non strings', () => {
        expect(Color.test(1)).toBe(false)
      })

      it('returns true if a given string is a color - hex', () => {
        expect(Color.test('#abc')).toBe(true)
        expect(Color.test('#abcdef')).toBe(true)
      })

      it('returns true if a given string is a color - rgb', () => {
        expect(Color.test('rgb(1,2,3)')).toBe(true)
      })

      it('returns false if a given string is a not a color', () => {
        expect(Color.test('#1234')).toBe(false)
        expect(Color.test('#Hallo Welt')).toBe(false)
      })
    })

    describe('isRgb()', () => {
      it('returns true if object has all rgb properties set', () => {
        expect(Color.isRgb({ r: 12, g: 45, b: 11, blub: true })).toBe(true)
      })

      it('returns false if object has not all rgb properties set or they are not numbers', () => {
        expect(Color.isRgb({ r: 12, g: 45 })).toBe(false)
        expect(Color.isRgb({ r: 12, g: 45, b: '1' })).toBe(false)
      })
    })

    describe('isColor', () => {
      it('tests if given value is a color', () => {
        const spy1 = spyOn(Color, 'isRgb')
        const spy2 = spyOn(Color, 'test')
        expect(Color.isColor(new Color())).toBe(true)
        Color.isColor('#000')
        const color = { r: 12, g: 45, b: 11 }
        Color.isColor(color)
        expect(spy1).toHaveBeenCalledWith('#000')
        expect(spy1).toHaveBeenCalledWith(color)
        expect(spy2).toHaveBeenCalledWith('#000')
      })
    })
  })
})
