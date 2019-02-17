import * as SVGJS from '@svgdotjs/svg.js'

describe('Adopter', function () {
  var path: SVGJS.Path, polyline: SVGJS.Polyline, polygon: SVGJS.Polygon,
    linearGradient: SVGJS.Gradient, radialGradient: SVGJS.Gradient

  beforeEach(function () {
    path = SVGJS.SVG('#lineAB') as SVGJS.Path
    polyline = SVGJS.SVG('#inlineSVG').find('polyline')[0] as SVGJS.Polyline
    polygon = SVGJS.SVG('#inlineSVG').find('polygon')[0] as SVGJS.Polygon
    linearGradient = SVGJS.SVG('#inlineSVG').find('linearGradient')[0] as SVGJS.Gradient
    radialGradient = SVGJS.SVG('#inlineSVG').find('radialGradient')[0] as SVGJS.Gradient
  })

  describe('with SVG.Svg instance', function () {
    it('adopts the main svg document when parent() method is called on first level children', function () {
      expect(path.parent() instanceof SVGJS.Svg).toBeTruthy()
    })
    it('defines a xmlns attribute', function () {
      expect(path.parent().node.getAttribute('xmlns')).toBe(SVGJS.namespaces.ns)
    })
    it('defines a version attribute', function () {
      expect(path.parent().node.getAttribute('version')).toBe('1.1')
    })
    it('defines a xmlns:xlink attribute', function () {
      expect(path.parent().node.getAttribute('xmlns:xlink')).toBe(SVGJS.namespaces.xlink)
    })
    it('initializes a defs node', function () {
      expect(path.defs() instanceof SVGJS.Defs).toBe(true)
    })
  })

  describe('with SVG.Path instance', function () {
    it('adopts an exiting path element', function () {
      expect(path instanceof SVGJS.Path).toBeTruthy()
    })
    it('modifies an adopted element', function () {
      path.fill('#f06')
      expect(path.node.getAttribute('fill')).toBe('#ff0066')
    })
    it('parses d attribute to SVG.PathArray', function () {
      expect(path.array() instanceof SVGJS.PathArray).toBeTruthy()
    })
  })

  describe('with SVG.Polyline instance', function () {
    it('parses points attribute to SVG.PointArray', function () {
      expect(polyline.array() instanceof SVGJS.PointArray).toBeTruthy()
    })
  })

  describe('with SVG.Polygon instance', function () {
    it('parses points attribute to SVG.PointArray', function () {
      expect(polygon.array() instanceof SVGJS.PointArray).toBeTruthy()
    })
  })

  describe('with linear SVG.Gradient instance', function () {
    it('is instance of SVG.Gradient', function () {
      expect(linearGradient instanceof SVGJS.Gradient).toBeTruthy()
    })
    it('has type of linearGradient', function () {
      expect(linearGradient.type).toBe('linearGradient') // actually it should be 'linear'. see #606
    })
  })

  describe('with radial SVG.Gradient instance', function () {
    it('is instance of SVG.Gradient', function () {
      expect(radialGradient instanceof SVGJS.Gradient).toBeTruthy()
    })
    it('has type of radialGradient', function () {
      expect(radialGradient.type).toBe('radialGradient') // actually it should be 'radial'. see #606
    })
  })

  describe('with node that has no matching svg.js class', function () {
    it('wraps the node in the Dom class', function () {
      var desc = SVGJS.SVG('#inlineSVG').find('desc')[0]
      expect(desc instanceof SVGJS.Dom).toBeTruthy()
    })
  })
})
