import {
  Box,
  Gradient,
  Matrix,
  Rect,
  makeInstance as SVG
} from '../../../src/main.js'
import { getMethodsFor } from '../../../src/utils/methods.js'
import { getWindow, withWindow } from '../../../src/utils/window.js'

const { zoom, viewbox} = getMethodsFor('viewbox')

const { any, objectContaining, arrayContaining } = jasmine

const getBody = () => {
  let win = getWindow()
  return win.document.body || win.document.documentElement
}

describe('Box.js', () => {
  describe('()', () => {
    it('creates a new Box with default attributes', () => {
      const box = new Box()
      expect(box).toEqual(any(Box))
      expect(box).toEqual(objectContaining({
        width: 0, height: 0, x: 0, y: 0, w: 0, h: 0, cx: 0, cy: 0, x2: 0, y2: 0
      }))
    })
  })

  describe('init()', () => {
    it('inits or reinits the box according to input', () => {
      expect(new Box().init(1,2,3,4).toArray()).toEqual([1,2,3,4])
    })

    it('works with array input', () => {
      expect(new Box().init([1,2,3,4]).toArray()).toEqual([1,2,3,4])
    })

    it('works with 3 arguments as input', () => {
      expect(new Box().init(1,2,3,4).toArray()).toEqual([1,2,3,4])
    })

    it('works with string input', () => {
      expect(new Box().init('1,2,3,4').toArray()).toEqual([1,2,3,4])
    })

    it('creates a new box from parsed string with exponential values', function() {
      expect(new Box().init('-1.12e1 1e-2 +2e2 +.3e+4').toArray())
        .toEqual([-11.2, 0.01, 200, 3000])
    })

    it('works with object input', () => {
      expect(new Box().init({x: 1, y: 2, width: 3, height: 4}).toArray())
        .toEqual([1,2,3,4])
    })

    it('calculates all derived values correctly', () => {
      expect(new Box().init(2, 4, 6, 8)).toEqual(objectContaining({
        cx: 5, cy: 8, x2: 8, y2: 12, w: 6, h: 8
      }))
    })

    it('can handle input with left instead of x and top instead of y', () => {
      expect(new Box().init({left: 1, top: 2, width: 3, height: 4}).toArray())
        .toEqual([1,2,3,4])
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
      var box1 = new Box(50, 50, 100, 100).transform(new Matrix(1,0,0,1,20,20))
      var box2 = new Box(50, 50, 100, 100).transform(new Matrix(2,0,0,2,0,0))
      var box3 = new Box(-200, -200, 100, 100).transform(new Matrix(1,0,0,1,-20,-20))

      expect(box1.toArray()).toEqual([70, 70, 100, 100])
      expect(box2.toArray()).toEqual([100, 100, 200, 200])
      expect(box3.toArray()).toEqual([-220, -220, 100, 100])
    })
  })

  describe('addOffset()', () => {
    it('adds the current page offset to the box', () => {
      withWindow({pageXOffset: 50, pageYOffset: 25}, () => {
        const box = new Box(100, 100, 100, 100).addOffset()

        expect(box.toArray()).toEqual([150, 125, 100, 100])
      })
    })
  })

  describe('toString()', () => {
    it('returns a string representation of the box', () => {
      expect(new Box(1,2,3,4).toString()).toBe('1 2 3 4')
    })
  })

  describe('toArray()', () => {
    it('returns an array representation of the box', () => {
      expect(new Box(1,2,3,4).toArray()).toEqual([1,2,3,4])
    })
  })

  describe('isNulled()', () => {
    it('checks if the box consists of only zeros', () => {
      expect(new Box().isNulled()).toBe(true)
      expect(new Box(1,2,3,4).isNulled()).toBe(false)
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

      // it('throws when it is not possible to get a bbox', () => {
      //   const gradient = new Gradient('radial')
      //   expect(() => gradient.bbox()).toThrow()
      // })
    })

    describe('rbox()', () => {
      it('returns the BoundingClientRect of the element', () => {
        const canvas = SVG().addTo(container)
        const rect = new Rect().size(100, 200).move(20, 30).addTo(canvas)
          .attr('transform', new Matrix({scale: 2, translate:[40, 50]}))

        expect(rect.rbox()).toEqual(any(Box))
        expect(rect.rbox().toArray()).toEqual([80, 110, 200, 400])
      })

      it('throws when element is not in dom', () => {
        expect(() => new Rect().rbox()).toThrow()
      })
    })

    describe('viewbox()', () => {
      it('sets the viewbox of the element', () => {
        const canvas = viewbox.call(SVG().addTo(container), 10, 10, 200, 200)
        expect(canvas.attr('viewBox')).toEqual('10 10 200 200')
      })

      it('gets the viewbox of the element', () => {
        const canvas = viewbox.call(SVG().addTo(container), 10, 10, 200, 200)
        expect(viewbox.call(canvas)).toEqual(any(Box))
        expect(viewbox.call(canvas).toArray()).toEqual([10, 10, 200, 200])
      })
    })

    describe('zoom()', () => {
      it('zooms around the center by default', () => {
        const canvas = zoom.call(SVG().size(100, 50).viewbox(0, 0, 100, 50).addTo(container), 2)
        expect(canvas.attr('viewBox')).toEqual('25 12.5 50 25')
      })

      it('zooms around a point', () => {
        const canvas = zoom.call(SVG().size(100, 50).viewbox(0, 0, 100, 50).addTo(container), 2, [0, 0])
        expect(canvas.attr('viewBox')).toEqual('0 0 50 25')
      })

      it('gets the zoom', () => {
        const canvas = zoom.call(SVG().size(100, 50).viewbox(0, 0, 100, 50).addTo(container), 2)
        expect(zoom.call(canvas)).toEqual(2)
      })
    })
  })
})
