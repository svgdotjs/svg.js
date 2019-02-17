import * as SVGJS from '@svgdotjs/svg.js'
import * as helpers from './helpers'

describe('Svg', function () {

   describe('create()', function () {
      it('doenst alter size when adopting width SVG()', function () {
         var svg = SVGJS.SVG('#inlineSVG') as SVGJS.Svg
         expect(svg.width()).toBe(0)
         expect(svg.height()).toBe(0)
      })
   })

   it('is an instance of SVG.Container', function () {
      expect(helpers.draw instanceof SVGJS.Container).toBe(true)
   })

   it('is an instance of SVG.Svg', function () {
      expect(helpers.draw instanceof SVGJS.Svg).toBe(true)
   })

   it('returns itself as Svg when root', function () {
      expect(helpers.draw.root()).toBe(helpers.draw)
   })

   it('has a defs element when root', function () {
      expect(helpers.draw.defs() instanceof SVGJS.Defs).toBe(true)
   })

   describe('defs()', function () {
      it('returns defs element', function () {
         expect(helpers.draw.defs()).toBe((helpers.draw.node.getElementsByTagName('defs')[0] as any).instance)
      })
      it('references parent node', function () {
         expect(helpers.draw.defs().parent()).toBe(helpers.draw)
      })
   })

   describe('isRoot()', function () {
      it('returns true when the Svg is not attached to dom', function () {
         expect(SVGJS.SVG().isRoot()).toBe(true)
      })
      it('returns true when its outer element is not an svg element', function () {
         expect(SVGJS.SVG().addTo(document.createElement('div')).isRoot()).toBe(true)
      })
      it('returns true when its the root element of the dom', function () {
         expect(helpers.draw.isRoot()).toBe(true)
      })
      it('returns false when parent is svg element', function () {
         expect(SVGJS.SVG().addTo(SVGJS.SVG()).isRoot()).toBe(false)
      })
   })

   describe('remove()', function () {
      it('removes the Svg from the dom only if Svg is not root element', function () {
         var cnt = document.querySelectorAll('svg').length
         helpers.draw.remove()

         expect(document.querySelectorAll('svg').length).toBe(cnt - 1)

         helpers.updateDraw(SVGJS.SVG().addTo(helpers.drawing).size(100, 100));
         expect(window.document.querySelectorAll('svg').length).toBe(cnt)
      })
   })

})
