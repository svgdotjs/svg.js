/* globals describe, expect, it, beforeEach, spyOn, container */

import { Rect, SVG, Matrix, Ellipse, Gradient } from '../../../../src/main.js'

describe('sugar.js', () => {
  describe('Element/Runner', () => {
    describe('fill()', () => {
      describe('as setter', () => {
        it('returns itself', () => {
          const rect = new Rect()
          expect(rect.fill('black')).toBe(rect)
        })

        it('sets a fill color', () => {
          const rect = new Rect()
          expect(rect.fill('black').attr('fill')).toBe('black')
        })

        it('sets a fill pattern when pattern given', () => {
          const canvas = SVG().addTo(container)
          const pattern = canvas.pattern()
          const rect = canvas.rect(100, 100)
          expect(rect.fill(pattern).attr('fill')).toBe(pattern.url())
        })

        it('sets a fill pattern when image given', () => {
          const canvas = SVG().addTo(container)
          const image = canvas.image('spec/fictures/pixel.png')
          const rect = canvas.rect(100, 100)
          expect(rect.fill(image).attr('fill')).toBe(image.parent().url())
        })

        it('sets an object of fill properties', () => {
          const rect = new Rect()
          expect(
            rect
              .fill({
                color: 'black',
                opacity: 0.5,
                rule: 'even-odd'
              })
              .attr()
          ).toEqual({
            fill: 'black',
            'fill-opacity': 0.5,
            'fill-rule': 'even-odd'
          })
        })
      })

      describe('as getter', () => {
        it('returns fill color', () => {
          const rect = new Rect().fill('black')
          expect(rect.fill()).toBe('black')
        })

        it('returns default fill color if nothing is set', () => {
          const rect = new Rect()
          expect(rect.fill()).toBe('#000000')
        })
      })
    })

    describe('stroke()', () => {
      describe('as setter', () => {
        it('returns itself', () => {
          const rect = new Rect()
          expect(rect.stroke('black')).toBe(rect)
        })

        it('sets a stroke color', () => {
          const rect = new Rect()
          expect(rect.stroke('black').attr('stroke')).toBe('black')
        })

        it('sets a stroke pattern when pattern given', () => {
          const canvas = SVG().addTo(container)
          const pattern = canvas.pattern()
          const rect = canvas.rect(100, 100)
          expect(rect.stroke(pattern).attr('stroke')).toBe(pattern.url())
        })

        it('sets a stroke pattern when image given', () => {
          const canvas = SVG().addTo(container)
          const image = canvas.image('spec/fictures/pixel.png')
          const rect = canvas.rect(100, 100)
          expect(rect.stroke(image).attr('stroke')).toBe(image.parent().url())
        })

        it('sets an object of stroke properties', () => {
          const rect = new Rect()
          expect(
            rect
              .stroke({
                color: 'black',
                width: 2,
                opacity: 0.5,
                linecap: 'butt',
                linejoin: 'miter',
                miterlimit: 10,
                dasharray: '2 2',
                dashoffset: 15
              })
              .attr()
          ).toEqual({
            stroke: 'black',
            'stroke-width': 2,
            'stroke-opacity': 0.5,
            'stroke-linecap': 'butt',
            'stroke-linejoin': 'miter',
            'stroke-miterlimit': 10,
            'stroke-dasharray': '2 2',
            'stroke-dashoffset': 15
          })
        })

        it('sets stroke dasharray with array passed', () => {
          const rect = new Rect().stroke({ dasharray: [2, 2] })
          expect(rect.attr()).toEqual({ 'stroke-dasharray': '2 2' })
        })
      })

      describe('as getter', () => {
        it('returns stroke color', () => {
          const rect = new Rect().stroke('black')
          expect(rect.stroke()).toBe('black')
        })

        it('returns default stroke color if nothing is set', () => {
          const rect = new Rect()
          expect(rect.stroke()).toBe('#000000')
        })
      })
    })

    describe('matrix()', () => {
      it('gets the matrix with no argument passed', () => {
        const rect = new Rect().transform(new Matrix(1, 0, 1, 1, 1, 0))
        expect(rect.matrix()).toEqual(new Matrix(1, 0, 1, 1, 1, 0))
      })

      it('sets the matrix if matrix given', () => {
        const rect = new Rect().matrix(new Matrix(1, 0, 1, 1, 1, 0))
        expect(rect.matrix()).toEqual(new Matrix(1, 0, 1, 1, 1, 0))
      })

      it('sets the matrix with 6 arguments given', () => {
        const rect = new Rect().matrix(1, 0, 1, 1, 1, 0)
        expect(rect.matrix()).toEqual(new Matrix(1, 0, 1, 1, 1, 0))
      })
    })

    describe('rotate()', function () {
      it('redirects to transform()', function () {
        const rect = new Rect()
        const spy = spyOn(rect, 'transform')
        rect.rotate(1, 2, 3)
        expect(spy).toHaveBeenCalledWith({ rotate: 1, ox: 2, oy: 3 }, true)
      })
    })

    describe('skew()', function () {
      it('redirects to transform() with no argument', function () {
        const rect = new Rect()
        const spy = spyOn(rect, 'transform')
        rect.skew()
        expect(spy).toHaveBeenCalledWith(
          { skew: [undefined, undefined], ox: undefined, oy: undefined },
          true
        )
      })

      it('redirects to transform() with one argument', function () {
        const rect = new Rect()
        const spy = spyOn(rect, 'transform')
        rect.skew(5)
        expect(spy).toHaveBeenCalledWith(
          { skew: 5, ox: undefined, oy: undefined },
          true
        )
      })

      it('redirects to transform() with two argument', function () {
        const rect = new Rect()
        const spy = spyOn(rect, 'transform')
        rect.skew(5, 6)
        expect(spy).toHaveBeenCalledWith(
          { skew: [5, 6], ox: undefined, oy: undefined },
          true
        )
      })

      it('redirects to transform() with three arguments', function () {
        const rect = new Rect()
        const spy = spyOn(rect, 'transform')
        rect.skew(5, 6, 7)
        expect(spy).toHaveBeenCalledWith({ skew: 5, ox: 6, oy: 7 }, true)
      })

      it('redirects to transform() with four arguments', function () {
        const rect = new Rect()
        const spy = spyOn(rect, 'transform')
        rect.skew(5, 6, 7, 8)
        expect(spy).toHaveBeenCalledWith({ skew: [5, 6], ox: 7, oy: 8 }, true)
      })
    })

    describe('shear', () => {
      it('redirects to transform()', function () {
        const rect = new Rect()
        const spy = spyOn(rect, 'transform')
        rect.shear(1, 2, 3)
        expect(spy).toHaveBeenCalledWith({ shear: 1, ox: 2, oy: 3 }, true)
      })
    })

    describe('scale()', function () {
      it('redirects to transform() with no argument', function () {
        const rect = new Rect()
        const spy = spyOn(rect, 'transform')
        rect.scale()
        expect(spy).toHaveBeenCalledWith(
          { scale: [undefined, undefined], ox: undefined, oy: undefined },
          true
        )
      })

      it('redirects to transform() with one argument', function () {
        const rect = new Rect()
        const spy = spyOn(rect, 'transform')
        rect.scale(5)
        expect(spy).toHaveBeenCalledWith(
          { scale: 5, ox: undefined, oy: undefined },
          true
        )
      })

      it('redirects to transform() with two argument', function () {
        const rect = new Rect()
        const spy = spyOn(rect, 'transform')
        rect.scale(5, 6)
        expect(spy).toHaveBeenCalledWith(
          { scale: [5, 6], ox: undefined, oy: undefined },
          true
        )
      })

      it('redirects to transform() with three arguments', function () {
        const rect = new Rect()
        const spy = spyOn(rect, 'transform')
        rect.scale(5, 6, 7)
        expect(spy).toHaveBeenCalledWith({ scale: 5, ox: 6, oy: 7 }, true)
      })

      it('redirects to transform() with four arguments', function () {
        const rect = new Rect()
        const spy = spyOn(rect, 'transform')
        rect.scale(5, 6, 7, 8)
        expect(spy).toHaveBeenCalledWith({ scale: [5, 6], ox: 7, oy: 8 }, true)
      })
    })

    describe('translate()', function () {
      it('redirects to transform()', function () {
        const rect = new Rect()
        const spy = spyOn(rect, 'transform')
        rect.translate(1, 2)
        expect(spy).toHaveBeenCalledWith({ translate: [1, 2] }, true)
      })
    })

    describe('relative()', () => {
      it('redirects to transform()', function () {
        const rect = new Rect()
        const spy = spyOn(rect, 'transform')
        rect.relative(1, 2)
        expect(spy).toHaveBeenCalledWith({ relative: [1, 2] }, true)
      })
    })

    describe('flip()', function () {
      it('redirects to transform()', function () {
        const rect = new Rect()
        const spy = spyOn(rect, 'transform')
        rect.flip('x', 2)
        expect(spy).toHaveBeenCalledWith({ flip: 'x', origin: 2 }, true)
      })

      it('sets flip to "both" when calling without anything', function () {
        const rect = new Rect()
        const spy = spyOn(rect, 'transform')
        rect.flip()
        expect(spy).toHaveBeenCalledWith(
          { flip: 'both', origin: 'center' },
          true
        )
      })

      // this works because only x and y are valid flip values. Everything else flips on both axis
      it('sets flip to both and origin to number when called with origin only', function () {
        const rect = new Rect()
        const spy = spyOn(rect, 'transform')
        rect.flip(5)
        expect(spy).toHaveBeenCalledWith({ flip: 'both', origin: 5 }, true)
      })
    })

    describe('opacity()', function () {
      it('redirects to attr() directly', function () {
        const rect = new Rect()
        const spy = spyOn(rect, 'attr')
        rect.opacity(0.5)
        expect(spy).toHaveBeenCalledWith('opacity', 0.5)
      })
    })

    describe('font()', function () {
      const txt = 'Some text'
      let canvas, text

      beforeEach(() => {
        canvas = SVG().addTo(container)
        text = canvas.text(txt)
      })

      it('sets leading when given', function () {
        const spy = spyOn(text, 'leading')
        text.font({ leading: 3 })
        expect(spy).toHaveBeenCalledWith(3)
      })

      it('sets text-anchor when anchor given', function () {
        const spy = spyOn(text, 'attr')
        text.font({ anchor: 'start' })
        expect(spy).toHaveBeenCalledWith('text-anchor', 'start')
      })

      it('sets all font properties via attr()', function () {
        const spy = spyOn(text, 'attr')
        text.font({
          size: 20,
          family: 'Verdana',
          weight: 'bold',
          stretch: 'wider',
          variant: 'small-caps',
          style: 'italic'
        })
        expect(spy).toHaveBeenCalledWith('font-size', 20)
        expect(spy).toHaveBeenCalledWith('font-family', 'Verdana')
        expect(spy).toHaveBeenCalledWith('font-weight', 'bold')
        expect(spy).toHaveBeenCalledWith('font-stretch', 'wider')
        expect(spy).toHaveBeenCalledWith('font-variant', 'small-caps')
        expect(spy).toHaveBeenCalledWith('font-style', 'italic')
      })

      it('redirects all other stuff directly to attr()', function () {
        const spy = spyOn(text, 'attr')
        text.font({
          foo: 'bar',
          bar: 'baz'
        })
        expect(spy).toHaveBeenCalledWith('foo', 'bar')
        expect(spy).toHaveBeenCalledWith('bar', 'baz')
      })

      it('sets key value pair when called with 2 parameters', function () {
        const spy = spyOn(text, 'attr')
        text.font('size', 20)
        expect(spy).toHaveBeenCalledWith('font-size', 20)
      })

      it('gets value if called with one parameter', function () {
        const spy = spyOn(text, 'attr')
        text.font('size')
        expect(spy).toHaveBeenCalledWith('font-size', undefined)
      })
    })
  })

  describe('radius()', () => {
    describe('Rect', () => {
      it('sets rx and ry on the rectangle', () => {
        const rect = new Rect().radius(5, 10)
        expect(rect.attr()).toEqual({ rx: 5, ry: 10 })
      })
    })

    describe('Ellipse', () => {
      it('sets rx and ry on the rectangle', () => {
        const rect = new Ellipse().radius(5, 10)
        expect(rect.attr()).toEqual({ rx: 5, ry: 10 })
      })
    })

    describe('radialGradient', () => {
      it('sets rx and ry on the rectangle', () => {
        const rect = new Gradient('radial').radius(5)
        expect(rect.attr()).toEqual({ r: 5 })
      })
    })
  })

  describe('Path', () => {
    describe('length', () => {
      it('returns the full length of the path', () => {
        const canvas = SVG().addTo(container)
        const path = canvas.path('M0 0 L 0 5')
        expect(path.length()).toBe(5)
      })
    })

    describe('pointAt', () => {
      it('returns a point at a specific length', () => {
        const canvas = SVG().addTo(container)
        const path = canvas.path('M0 0 L 0 5')
        const point = path.pointAt(3)

        expect(point.x).toBeCloseTo(0) // chrome has rounding issues -.-
        expect(point.y).toBe(3)
      })
    })
  })

  describe('events', () => {
    ;[
      'click',
      'dblclick',
      'mousedown',
      'mouseup',
      'mouseover',
      'mouseout',
      'mousemove',
      'mouseenter',
      'mouseleave',
      'touchstart',
      'touchmove',
      'touchleave',
      'touchend',
      'touchcancel'
    ].forEach((ev) => {
      describe(ev, () => {
        it('calls on() with the eventname set to ' + ev, () => {
          const rect = new Rect()
          const spy = spyOn(rect, 'on')
          const fn = () => {}
          rect[ev](fn)
          expect(spy).toHaveBeenCalledWith(ev, fn)
        })

        it(
          'calls off() with the eventname set to ' +
            ev +
            ' when null is passed as second argument',
          () => {
            const rect = new Rect()
            const spy = spyOn(rect, 'off')
            rect[ev](null)
            expect(spy).toHaveBeenCalledWith(ev)
          }
        )
      })
    })
  })
})
