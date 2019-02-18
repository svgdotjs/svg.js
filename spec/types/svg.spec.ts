import * as SVGJS from '@svgdotjs/svg.js'

declare module '@svgdotjs/svg.js' {
   export interface Rect {
      soft: () => this;
   }
   export interface Ellipse {
      soft: () => this;
   }
   export interface Path {
      soft: () => this;
   }
}
describe('SVG', () => {

   describe('()', () => {
      let drawing: SVGJS.Svg
      let wrapper: SVGSVGElement
      let rect: SVGRectElement
      let wrapperHTML: HTMLElement

      beforeEach(() => {
         wrapper = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
         wrapper.id = 'testSvg'
         wrapperHTML = document.createElement('div')
         wrapperHTML.id = 'testDiv'
         rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
         document.documentElement.appendChild(wrapper)
         document.documentElement.appendChild(wrapperHTML)
      })

      afterEach(() => {
         wrapper.parentNode.removeChild(wrapper)
         wrapperHTML.parentNode.removeChild(wrapperHTML)
      })

      it('creates an instanceof SVG.Svg without any argument', () => {
         expect(SVGJS.SVG() instanceof SVGJS.Svg).toBe(true)
         expect(SVGJS.SVG().node.nodeName).toBe('svg')
      });

      it('creates an instanceof SVG.Dom with html node', () => {
         const el = SVGJS.SVG(wrapperHTML)
         expect(el instanceof SVGJS.Dom).toBe(true)
         expect(el.node).toBe(wrapperHTML)
      })

      it('creates new SVG.Dom when called with css selector pointing to html node', () => {
         const el = SVGJS.SVG('#testDiv')
         expect(el instanceof SVGJS.Dom).toBe(true)
         expect(el.node).toBe(wrapperHTML)
      })

      it('creates an instanceof SVG.Svg with svg node', () => {
         const doc = SVGJS.SVG(wrapper)
         expect(doc instanceof SVGJS.Svg).toBe(true)
         expect(doc.node).toBe(wrapper)
      })

      it('creates new SVG.Svg when called with css selector pointing to svg node', () => {
         const doc = SVGJS.SVG('#testSvg')
         expect(doc instanceof SVGJS.Svg).toBe(true)
         expect(doc.node).toBe(wrapper)
      })

      it('adopts any SVGElement', () => {
         expect(SVGJS.SVG(rect) instanceof SVGJS.Rect).toBe(true)
         expect(SVGJS.SVG(rect).node).toBe(rect)
      })

      it('creates an instanceof SVG.Svg when importing a whole svg', () => {
         const doc = SVGJS.SVG('<svg width="200"><rect></rect></svg>') as SVGJS.Svg

         expect(doc instanceof SVGJS.Svg).toBe(true)
         expect(doc.node.nodeName).toBe('svg')
         expect(doc.width()).toBe(200)
         expect(doc.get(0).node.nodeName).toBe('rect')
      })

      it('creates SVG.Shape from any shape string', () => {
         const rect = SVGJS.SVG('<rect width="200" height="100" />') as SVGJS.Rect
         const circle = SVGJS.SVG('<circle r="200" />') as SVGJS.Circle

         expect(rect instanceof SVGJS.Rect).toBe(true)
         expect(rect.node.nodeName).toBe('rect')
         expect(rect.width()).toBe(200)

         expect(circle instanceof SVGJS.Circle).toBe(true)
         expect(circle.node.nodeName).toBe('circle')
         expect(circle.attr('r')).toBe(200)
      })

      it('returns the argument when called with any SVG.Element', () => {
         drawing = SVGJS.SVG(wrapper)
         expect(SVGJS.SVG(drawing)).toBe(drawing)
      })

   })

   describe('create()', () => {
      it('creates an element with given node name and return it', () => {
         const element = SVGJS.create('rect')
         expect(element.nodeName).toBe('rect')
      })
   })

   describe('extend()', () => {

      let draw: SVGJS.Svg

      beforeEach(() => {
         const drawing = document.createElement('div')
         draw = SVGJS.SVG().addTo(drawing).size(100, 100)
      })

      afterEach(() => {
         draw.remove()
      })

      it('adds all functions in the given object to the target object', function () {
         SVGJS.extend(SVGJS.Rect, {
            soft: function () {
               return (this as SVGJS.Element).opacity(0.2)
            }
         })

         expect(typeof SVGJS.Rect.prototype.soft).toBe('function')
         expect(draw.rect(100, 100).soft().attr('opacity')).toBe(0.2)
      })
      it('accepts and extend multiple modules at once', function () {
         SVGJS.extend([SVGJS.Rect, SVGJS.Ellipse, SVGJS.Path], {
            soft: function () {
               return (this as SVGJS.Element).opacity(0.5)
            }
         })

         expect(typeof SVGJS.Rect.prototype.soft).toBe('function')
         expect(draw.rect(100, 100).soft().attr('opacity')).toBe(0.5)
         expect(typeof SVGJS.Ellipse.prototype.soft).toBe('function')
         expect(draw.ellipse(100, 100).soft().attr('opacity')).toBe(0.5)
         expect(typeof SVGJS.Path.prototype.soft).toBe('function')
         expect(draw.path().soft().attr('opacity')).toBe(0.5)
      })
   })

});