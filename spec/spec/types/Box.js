/* globals describe, expect, it, beforeEach, afterEach, spyOn, jasmine, container */

import { Box, Matrix, Rect, G, makeInstance as SVG } from '../../../src/main.js'
import { withWindow, getWindow } from '../../../src/utils/window.js'
import { isNulledBox, domContains } from '../../../src/types/Box.js'

const { any, objectContaining } = jasmine

// const getBody = () => {
//   const win = getWindow()
//   return win.document.body || win.document.documentElement
// }

describe('Box.js', () => {
  describe('isNulledBox', () => {
    it('returns true if x, y, with and height is 0', () => {
      expect(isNulledBox({ x: 0, y: 0, width: 0, height: 0 })).toBe(true)
    })

    it('returns false if one or more of x, y, with and height is not 0', () => {
      expect(isNulledBox({ x: 0, y: 0, width: 0, height: 1 })).toBe(false)
      expect(isNulledBox({ x: 0, y: 1, width: 0, height: 1 })).toBe(false)
    })
  })

  describe('domContains()', () => {
    describe('with native function', () => {
      it('returns true if node is in the dom', () => {
        expect(domContains(container)).toBe(true)
      })

      it('returns false if node is not in the dom', () => {
        const g = new G()
        const rect = new Rect().addTo(g)
        expect(domContains(rect.node)).toBe(false)
      })
    })

    describe('with polyfill', () => {
      let containsBackup
      beforeEach(() => {
        containsBackup = getWindow().document.documentElement.contains
        getWindow().document.documentElement.contains = null
      })

      afterEach(() => {
        getWindow().document.documentElement.contains = containsBackup
      })

      it('returns true if node is in the dom', () => {
        expect(domContains(container)).toBe(true)
      })

      it('returns false if node is not in the dom', () => {
        const g = new G()
        const rect = new Rect().addTo(g)
        expect(domContains(rect.node)).toBe(false)
      })
    })
  })

  describe('Box', () => {
    describe('()', () => {
      it('creates a new Box with default attributes', () => {
        const box = new Box()
        expect(box).toEqual(any(Box))
        expect(box).toEqual(
          objectContaining({
            width: 0,
            height: 0,
            x: 0,
            y: 0,
            w: 0,
            h: 0,
            cx: 0,
            cy: 0,
            x2: 0,
            y2: 0
          })
        )
      })
    })

    describe('init()', () => {
      it('inits or reinits the box according to input', () => {
        expect(new Box().init(1, 2, 3, 4).toArray()).toEqual([1, 2, 3, 4])
      })

      it('works with array input', () => {
        expect(new Box().init([1, 2, 3, 4]).toArray()).toEqual([1, 2, 3, 4])
      })

      it('works with 3 arguments as input', () => {
        expect(new Box().init(1, 2, 3, 4).toArray()).toEqual([1, 2, 3, 4])
      })

      it('works with string input', () => {
        expect(new Box().init('1,2,3,4').toArray()).toEqual([1, 2, 3, 4])
      })

      it('creates a new box from parsed string with exponential values', function () {
        expect(new Box().init('-1.12e1 1e-2 +2e2 +.3e+4').toArray()).toEqual([
          -11.2, 0.01, 200, 3000
        ])
      })

      it('works with object input', () => {
        expect(
          new Box().init({ x: 1, y: 2, width: 3, height: 4 }).toArray()
        ).toEqual([1, 2, 3, 4])
      })

      it('calculates all derived values correctly', () => {
        expect(new Box().init(2, 4, 6, 8)).toEqual(
          objectContaining({
            cx: 5,
            cy: 8,
            x2: 8,
            y2: 12,
            w: 6,
            h: 8
          })
        )
      })

      it('can handle input with left instead of x and top instead of y', () => {
        expect(
          new Box().init({ left: 1, top: 2, width: 3, height: 4 }).toArray()
        ).toEqual([1, 2, 3, 4])
      })
    })

    describe('merge()', () => {
      it('merges various bounding boxes', () => {
        var box1 = new Box(50, 50, 100, 100)
        var box2 = new Box(300, 400, 100, 100)
        var box3 = new Box(500, 100, 100, 100)
        var merged = box1.merge(box2).merge(box3)

        expect(merged.toArray()).toEqual([50, 50, 550, 450])
      })

      it('returns a new instance', () => {
        var box1 = new Box(50, 50, 100, 100)
        var box2 = new Box(300, 400, 100, 100)
        var merged = box1.merge(box2)

        expect(merged).toEqual(any(Box))
      })
    })

    describe('transform()', () => {
      it('transforms the box with given matrix', () => {
        var box1 = new Box(50, 50, 100, 100).transform(
          new Matrix(1, 0, 0, 1, 20, 20)
        )
        var box2 = new Box(50, 50, 100, 100).transform(
          new Matrix(2, 0, 0, 2, 0, 0)
        )
        var box3 = new Box(-200, -200, 100, 100).transform(
          new Matrix(1, 0, 0, 1, -20, -20)
        )

        expect(box1.toArray()).toEqual([70, 70, 100, 100])
        expect(box2.toArray()).toEqual([100, 100, 200, 200])
        expect(box3.toArray()).toEqual([-220, -220, 100, 100])
      })

      it('also works with matrix like input', () => {
        var box1 = new Box(50, 50, 100, 100).transform(
          new Matrix(1, 0, 0, 1, 20, 20).toArray()
        )
        var box2 = new Box(50, 50, 100, 100).transform(
          new Matrix(2, 0, 0, 2, 0, 0).toArray()
        )
        var box3 = new Box(-200, -200, 100, 100).transform(
          new Matrix(1, 0, 0, 1, -20, -20).toArray()
        )

        expect(box1.toArray()).toEqual([70, 70, 100, 100])
        expect(box2.toArray()).toEqual([100, 100, 200, 200])
        expect(box3.toArray()).toEqual([-220, -220, 100, 100])
      })
    })

    describe('addOffset()', () => {
      it('returns a new instance', () => {
        withWindow({ pageXOffset: 50, pageYOffset: 25 }, () => {
          const box = new Box(100, 100, 100, 100)
          const box2 = box.addOffset()

          expect(box2).toEqual(any(Box))
          expect(box2).not.toBe(box)
        })
      })

      it('adds the current page offset to the box', () => {
        withWindow({ pageXOffset: 50, pageYOffset: 25 }, () => {
          const box = new Box(100, 100, 100, 100).addOffset()

          expect(box.toArray()).toEqual([150, 125, 100, 100])
        })
      })
    })

    describe('toString()', () => {
      it('returns a string representation of the box', () => {
        expect(new Box(1, 2, 3, 4).toString()).toBe('1 2 3 4')
      })
    })

    describe('toArray()', () => {
      it('returns an array representation of the box', () => {
        expect(new Box(1, 2, 3, 4).toArray()).toEqual([1, 2, 3, 4])
      })
    })

    describe('isNulled()', () => {
      it('checks if the box consists of only zeros', () => {
        expect(new Box().isNulled()).toBe(true)
        expect(new Box(1, 2, 3, 4).isNulled()).toBe(false)
      })
    })
  })

  describe('Element', () => {
    describe('bbox()', () => {
      it('returns the bounding box of the element', () => {
        const canvas = SVG().addTo(container)
        const rect = new Rect().size(100, 200).move(20, 30).addTo(canvas)

        expect(rect.bbox()).toEqual(any(Box))
        expect(rect.bbox().toArray()).toEqual([20, 30, 100, 200])
      })

      it('returns the bounding box of the element even if the node is not in the dom', () => {
        const rect = new Rect().size(100, 200).move(20, 30)
        expect(rect.bbox().toArray()).toEqual([20, 30, 100, 200])
      })

      it('throws when it is not possible to get a bbox', () => {
        const spy = spyOn(
          getWindow().SVGGraphicsElement.prototype,
          'getBBox'
        ).and.callFake(() => {
          throw new Error('No BBox for you')
        })
        const rect = new Rect()
        expect(() => rect.bbox()).toThrow()
        expect(spy).toHaveBeenCalled()
      })
    })

    describe('rbox()', () => {
      it('returns the BoundingClientRect of the element', () => {
        const canvas = SVG().addTo(container)
        const rect = new Rect()
          .size(100, 200)
          .move(20, 30)
          .addTo(canvas)
          .attr('transform', new Matrix({ scale: 2, translate: [40, 50] }))

        expect(rect.rbox()).toEqual(any(Box))
        expect(rect.rbox().toArray()).toEqual([80, 110, 200, 400])
      })

      it('returns the rbox box of the element in the coordinate system of the passed element', () => {
        const canvas = SVG().addTo(container)
        const group = canvas.group().translate(1, 1)
        const rect = new Rect()
          .size(100, 200)
          .move(20, 30)
          .addTo(canvas)
          .attr('transform', new Matrix({ scale: 2, translate: [40, 50] }))

        expect(rect.rbox(group)).toEqual(any(Box))
        expect(rect.rbox(group).toArray()).toEqual([79, 109, 200, 400])
      })

      // svgdom actually only throws here because a new Rect without dimensions has no bounding box
      // so in case you would create a rect with with and height this test would fail because
      // svgdom actually can calculate an rbox for the element
      // in that case we have to change the test like above so that the getBoundingClientRect call is mocked with a spy
      it('throws when element is not in dom', () => {
        expect(() => new Rect().rbox()).toThrow()
      })
    })

    describe('inside()', () => {
      it('checks if a point is in the elements borders', () => {
        const canvas = SVG().addTo(container)
        const rect = canvas.rect(100, 100)
        expect(rect.inside(50, 50)).toBe(true)
        expect(rect.inside(101, 101)).toBe(false)
      })
    })

    describe('viewbox()', () => {
      it('sets the viewbox of the element', () => {
        const canvas = SVG().addTo(container).viewbox(10, 10, 200, 200)
        expect(canvas.attr('viewBox')).toEqual('10 10 200 200')
      })

      it('gets the viewbox of the element', () => {
        const canvas = SVG().addTo(container).viewbox(10, 10, 200, 200)
        expect(canvas.viewbox()).toEqual(any(Box))
        expect(canvas.viewbox().toArray()).toEqual([10, 10, 200, 200])
      })
    })

    describe('zoom()', () => {
      it('zooms around the center by default', () => {
        const canvas = SVG()
          .size(100, 50)
          .viewbox(0, 0, 100, 50)
          .addTo(container)
          .zoom(2)
        expect(canvas.attr('viewBox')).toEqual('25 12.5 50 25')
      })

      it('zooms around a point', () => {
        const canvas = SVG()
          .size(100, 50)
          .viewbox(0, 0, 100, 50)
          .addTo(container)
          .zoom(2, [0, 0])
        expect(canvas.attr('viewBox')).toEqual('0 0 50 25')
      })

      it('gets the zoom', () => {
        // We use a nested here because its actually harder to get a width and height for a nested svg because clientHeight
        // is not available
        const svg = SVG()
          .size(100, 50)
          .addTo(container)
          .nested()
          .size(100, 50)
          .viewbox(0, 0, 100, 50)
          .zoom(2)
        expect(svg.zoom()).toEqual(2)
      })

      it('gets the zoom with clientHeight', () => {
        const svg = SVG()
          .css({ width: '100px', height: '50px' })
          .addTo(container)
          .viewbox(25, 12.5, 50, 25)

        const node = svg.node

        // svgdom doesn't support clientHeight
        // so we mock it here
        if (typeof node.clientHeight === 'undefined') {
          node.clientHeight = 50
          node.clientWidth = 100
        }

        expect(svg.zoom()).toEqual(2)
      })

      it('throws an error if it is impossible to get an absolute value', () => {
        const svg = SVG()
          .size(100, 50)
          .addTo(container)
          .nested()
          .viewbox(0, 0, 100, 50)
        expect(() => svg.zoom()).toThrowError(
          'Impossible to get absolute width and height. Please provide an absolute width and height attribute on the zooming element'
        )
      })

      it('handles zoom level 0 which is - which basically sets the viewbox to a very high value', () => {
        const svg = SVG()
          .size(100, 50)
          .viewbox(0, 0, 100, 50)
          .addTo(container)
          .zoom(0)
        expect(svg.zoom()).toBeCloseTo(0, 10)
      })

      it('handles zoom level 0 and can recover from it', () => {
        const svg = SVG()
          .size(100, 50)
          .viewbox(0, 0, 100, 50)
          .addTo(container)
          .zoom(0)
          .zoom(1)
        expect(svg.zoom()).toBe(1)
      })
    })
  })
})
