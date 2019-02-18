import * as SVGJS from '@svgdotjs/svg.js'
import * as helpers from './helpers'

describe('Symbol', function () {
  describe('()', function () {
    var element: SVGJS.Symbol

    beforeEach(function () {
      element = helpers.draw.symbol()
    })

    it('creates an instance of SVG.Symbol', function () {
      expect(element instanceof SVGJS.Symbol).toBeTruthy()
    })
    it('is an instance of SVG.Container', function () {
      expect(element instanceof SVGJS.Container).toBeTruthy()
    })
  })
})