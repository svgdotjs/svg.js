import * as SVGJS from '@svgdotjs/svg.js'
import * as helpers from './helpers'

describe('Defs', function () {
  var defs: SVGJS.Defs

  beforeEach(function () {
    defs = helpers.draw.defs()
  })

  it('creates an instance of SVG.Defs', function () {
    expect(defs instanceof SVGJS.Defs).toBeTruthy()
  })

})