import * as SVGJS from '@svgdotjs/svg.js'


describe('Regex', function () {

  describe('matchers', function () {

    describe('numberAndUnit', function () {
      var match

      it('is true with a positive unit value', function () {
        match = ('10%').match(SVGJS.regex.numberAndUnit)
        expect(match[1]).toBe('10')
        expect(match[5]).toBe('%')
      })
      it('is true with a negative unit value', function () {
        match = ('-11%').match(SVGJS.regex.numberAndUnit)
        expect(match[1]).toBe('-11')
        expect(match[5]).toBe('%')
      })
      it('is false with a positive unit value', function () {
        match = ('NotAUnit').match(SVGJS.regex.numberAndUnit)
        expect(match).toBeNull()
      })

      it('is true with a number', function () {
        ["1", "-1", "+15", "1.55", ".5", "5.", "1.3e2", "1E-4", "1e+12"].forEach(function (s) {
          expect(SVGJS.regex.numberAndUnit.test(s)).toBeTruthy()
        })
      })
      it('is false with a faulty number', function () {
        ["+-1", "1.2.3", "1+1", "1e4.5", ".5.", "1f5", "."].forEach(function (s) {
          expect(SVGJS.regex.numberAndUnit.test(s)).toBeFalsy()
        })
      })
      it('is true with a number with unit', function () {
        ["1px", "-1em", "+15%", "1.55s", ".5pt", "5.deg", "1.3e2rad", "1E-4grad", "1e+12cm"].forEach(function (s) {
          expect(SVGJS.regex.numberAndUnit.test(s)).toBeTruthy()
        })
      })
      it('is false with a faulty number or wrong unit', function () {
        ["1em1", "-1eq,5"].forEach(function (s) {
          expect(SVGJS.regex.numberAndUnit.test(s)).toBeFalsy()
        })
      })

    })
  })

  describe('testers', function () {

    describe('isHex', function () {
      it('is true with a three based hex', function () {
        expect(SVGJS.regex.isHex.test('#f09')).toBeTruthy()
      })
      it('is true with a six based hex', function () {
        expect(SVGJS.regex.isHex.test('#fe0198')).toBeTruthy()
      })
      it('is false with a faulty hex', function () {
        expect(SVGJS.regex.isHex.test('###')).toBeFalsy()
        expect(SVGJS.regex.isHex.test('#0')).toBeFalsy()
        expect(SVGJS.regex.isHex.test('f06')).toBeFalsy()
      })
    })

    describe('isRgb', function () {
      it('is true with an rgb value', function () {
        expect(SVGJS.regex.isRgb.test('rgb(255,66,100)')).toBeTruthy()
      })
      it('is false with a non-rgb value', function () {
        expect(SVGJS.regex.isRgb.test('hsb(255, 100, 100)')).toBeFalsy()
      })
    })

    describe('isNumber', function () {

      it('is true with a number', function () {
        ["1", "-1", "+15", "1.55", ".5", "5.", "1.3e2", "1E-4", "1e+12"].forEach(function (s) {
          expect(SVGJS.regex.isNumber.test(s)).toBeTruthy()
        })
      })

      it('is false with a faulty number', function () {
        ["1a", "+-1", "1.2.3", "1+1", "1e4.5", ".5.", "1f5", "."].forEach(function (s) {
          expect(SVGJS.regex.isNumber.test(s)).toBeFalsy()
        })
      })

    })

  })

})