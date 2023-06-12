/* globals describe, expect, it, beforeEach, jasmine, container */

import { Marker, SVG, Defs } from '../../../src/main.js'

const { any } = jasmine

describe('Marker.js', function () {
  describe('()', () => {
    it('creates a new object of type Marker', () => {
      expect(new Marker()).toEqual(any(Marker))
    })

    it('sets passed attributes on the element', () => {
      expect(new Marker({ id: 'foo' }).id()).toBe('foo')
    })
  })

  describe('width()', () => {
    it('sets the markerWidth attribute', () => {
      const marker = new Marker().width(100)
      expect(marker.attr('markerWidth')).toBe(100)
    })
  })

  describe('height()', () => {
    it('sets the markerHeight attribute', () => {
      const marker = new Marker().height(100)
      expect(marker.attr('markerHeight')).toBe(100)
    })
  })

  describe('orient()', () => {
    it('sets the orient attribute', () => {
      const marker = new Marker().orient('auto')
      expect(marker.attr('orient')).toBe('auto')
    })
  })

  describe('ref()', () => {
    it('sets refX and refY attribute', () => {
      const marker = new Marker().ref(10, 20)
      expect(marker.attr('refX')).toBe(10)
      expect(marker.attr('refY')).toBe(20)
    })
  })

  describe('update()', () => {
    it('updates the marker', () => {
      const marker = new Marker()
      marker.rect(100, 100)
      marker.update(function (m) {
        m.rect(100, 100)
        expect(this).toBe(marker)
        expect(m).toBe(marker)
      })
      expect(marker.children().length).toBe(1)
    })
  })

  describe('toString()', () => {
    it('returns the url identifier for this marker', () => {
      const marker = new Marker()
      expect(marker.toString()).toBe('url(#' + marker.id() + ')')
    })
  })

  describe('Container', () => {
    var canvas
    var group

    beforeEach(() => {
      canvas = SVG()
      group = canvas.group()
    })

    describe('marker()', () => {
      it('creates an instance of Marker', () => {
        const marker = group.marker(10, 12)
        expect(marker instanceof Marker).toBeTrue()
      })

      it('creates marker in defs', () => {
        const marker = group.marker(10, 12)
        expect(marker.parent() instanceof Defs).toBeTruthy()
      })

      it('sets the refX to half of the given width and height', () => {
        const marker = group.marker(10, 12)
        expect(marker.node.getAttribute('refX')).toBe('5')
        expect(marker.node.getAttribute('refY')).toBe('6')
      })
    })
  })

  describe('Defs', () => {
    describe('marker()', () => {
      it('creates a marker in the defs and sets all attributes', () => {
        const canvas = SVG()
        const defs = canvas.defs()
        const marker = defs.marker(10, 12)
        expect(marker.attr('refX')).toBe(5)
        expect(marker.attr('refY')).toBe(6)
        expect(marker.attr('markerWidth')).toBe(10)
        expect(marker.attr('markerHeight')).toBe(12)
        expect(marker.attr('viewBox')).toBe('0 0 10 12')
        expect(marker.attr('orient')).toBe('auto')
        expect(marker).toEqual(any(Marker))
        expect(defs.children()).toEqual([marker])
      })
    })
  })

  describe('marker', () => {
    var path, marker, canvas

    beforeEach(() => {
      // because we use `reference` here we need to put it into the live dom
      canvas = new SVG().addTo(container)
      path = canvas.path(
        'M 100 200 C 200 100 300  0 400 100 C 500 200 600 300 700 200 C 800 100 900 100 900 100'
      )
    })

    it('creates an instance of Marker', () => {
      path.marker('mid', 10, 12, function (add) {
        add.rect(10, 12)

        this.ref(5, 6)
      })

      expect(path.reference('marker-mid').children().length).toBe(1)
      expect(path.reference('marker-mid').attr('refX')).toBe(5)
      expect(path.reference('marker-mid') instanceof Marker).toBeTruthy()
    })

    describe('marker()', () => {
      it('returns the target element', () => {
        expect(path.marker('start', 10, 12)).toBe(path)
      })

      it('creates a marker and applies it to the marker-start attribute', () => {
        path.marker('start', 10, 12)
        marker = path.reference('marker-start')

        expect(path.node.getAttribute('marker-start')).toBe(marker.toString())
      })

      it('creates a marker and applies it to the marker-mid attribute', () => {
        path.marker('mid', 10, 12)
        marker = path.reference('marker-mid')

        expect(path.node.getAttribute('marker-mid')).toBe(marker.toString())
      })

      it('creates a marker and applies it to the marker-end attribute', () => {
        path.marker('end', 10, 12)
        marker = path.reference('marker-end')

        expect(path.node.getAttribute('marker-end')).toBe(marker.toString())
      })

      it('creates a marker and applies it to the marker-end attribute', () => {
        path.marker('all', 10, 12)
        marker = path.reference('marker')

        expect(path.node.getAttribute('marker')).toBe(marker.toString())
      })

      it('accepts an instance of an existing marker element as the second argument', () => {
        marker = new Marker().size(11, 11)
        path.marker('mid', marker)

        expect(path.node.getAttribute('marker-mid')).toBe(marker.toString())
      })
    })
  })
})
