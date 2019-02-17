import * as SVGJS from '@svgdotjs/svg.js'

describe('SVG.utils', function () {
  describe('degrees()', function () {
    it('converts radiant to degrees', function () {
      expect(SVGJS.utils.degrees(Math.PI)).toBe(180)
    })
    it('maps to 0 - 360 degree only', function () {
      expect(SVGJS.utils.degrees(2.5 * Math.PI)).toBe(90)
    })
  })
})