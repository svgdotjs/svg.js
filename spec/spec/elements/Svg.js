/* globals describe, expect, it, jasmine, container */

import { Svg, SVG, Defs } from '../../../src/main.js'
import {
  svg as ns,
  xlink,
  svgjs
} from '../../../src/modules/core/namespaces.js'
import { getWindow } from '../../../src/utils/window.js'

const { any } = jasmine

describe('Svg.js', () => {
  describe('()', () => {
    it('creates a new object of type Svg', () => {
      expect(new Svg()).toEqual(any(Svg))
    })

    it('sets passed attributes on the element', () => {
      expect(new Svg({ id: 'foo' }).id()).toBe('foo')
    })

    it('creates namespaces on creation', () => {
      const svg = new Svg()

      expect(svg.attr('xmlns')).toBe(ns)
      expect(svg.attr('version')).toBe(1.1)
      expect(svg.attr('xmlns:xlink')).toBe(xlink)
      expect(svg.attr('xmlns:svgjs')).toBe(svgjs)
    })
  })

  describe('defs()', () => {
    it('returns the defs if its the root svg', () => {
      const svg = new Svg()
      const defs = new Defs().addTo(svg)
      expect(svg.defs()).toBe(defs)
    })

    it('returns the defs if its not the root svg', () => {
      const svg = new Svg()
      const defs = new Defs().addTo(svg)
      const nested = new Svg().addTo(svg)
      expect(nested.defs()).toBe(defs)
    })

    it('creates the defs if not found', () => {
      const svg = new SVG()

      expect(svg.findOne('defs')).toBe(null)

      const defs = svg.defs()

      expect(svg.findOne('defs')).toBe(defs)
    })
  })

  describe('namespace()', () => {
    it('returns itself', () => {
      const svg = SVG('<svg />')
      expect(svg.namespace()).toBe(svg)
    })

    it('creates the namespace attributes on the svg', () => {
      const svg = SVG('<svg />')

      expect(svg.attr('xmlns')).toBe(undefined)

      svg.namespace()

      expect(svg.attr('xmlns')).toBe(ns)
      expect(svg.attr('version')).toBe(1.1)
      expect(svg.attr('xmlns:xlink')).toBe(xlink)
      expect(svg.attr('xmlns:svgjs')).toBe(svgjs)
    })
  })

  describe('isRoot()', () => {
    it('returns true if svg is the root svg', () => {
      const canvas = SVG().addTo(container)
      expect(canvas.isRoot()).toBe(true)
    })

    it('returns true if its detached from the dom', () => {
      const svg = new Svg()
      expect(svg.isRoot()).toBe(true)
    })

    it('returns true if its the root child of the document', () => {
      // cannot be tested here
    })

    it('returns false if its the child of a document-fragment', () => {
      const fragment = getWindow().document.createDocumentFragment()
      const svg = new Svg().addTo(fragment)
      expect(svg.isRoot()).toBe(false)
    })

    it('returns false if its a child of another svg element', () => {
      const svg = new Svg()
      const nested = new Svg().addTo(svg)
      expect(nested.isRoot()).toBe(false)
    })
  })

  describe('removeNamespace()', () => {
    it('returns itself', () => {
      const svg = new Svg()
      expect(svg.removeNamespace()).toBe(svg)
    })

    it('removes the namespace attributes from the svg element', () => {
      const svg = new Svg()

      expect(svg.attr('xmlns')).toBe(ns)

      svg.removeNamespace()

      expect(svg.attr('xmlns')).toBe(undefined)
      expect(svg.attr('version')).toBe(undefined)
      expect(svg.attr('xmlns:xlink')).toBe(undefined)
      expect(svg.attr('xmlns:svgjs')).toBe(undefined)
    })
  })

  describe('root()', () => {
    it('returns itself if its the root svg', () => {
      const svg = new Svg()
      expect(svg.root()).toBe(svg)
    })

    it('returns the actual root if its not the root svg', () => {
      const svg = new Svg()
      const nested = new Svg().addTo(svg)
      expect(nested.root()).toBe(svg)
    })
  })

  describe('Container', () => {
    describe('nested()', () => {
      it('creates an svg element in the container', () => {
        const svg = new Svg()
        const nested = svg.nested()
        expect(nested).toEqual(any(Svg))
        expect(nested.parent()).toBe(svg)
      })

      it('has no namespaces set', () => {
        const svg = new Svg()
        const nested = svg.nested()

        expect(nested.attr('xmlns')).toBe(undefined)
        expect(nested.attr('version')).toBe(undefined)
        expect(nested.attr('xmlns:xlink')).toBe(undefined)
        expect(nested.attr('xmlns:svgjs')).toBe(undefined)
      })
    })
  })
})
