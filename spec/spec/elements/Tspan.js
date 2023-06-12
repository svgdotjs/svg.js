/* globals describe, expect, it, jasmine, container */

import { Tspan, Text, Number as SVGNumber, SVG } from '../../../src/main.js'
import { getWindow } from '../../../src/utils/window.js'

const { any } = jasmine

describe('Tspan.js', () => {
  describe('()', () => {
    it('creates a new object of type Tspan', () => {
      expect(new Tspan()).toEqual(any(Tspan))
    })

    it('sets passed attributes on the element', () => {
      expect(new Tspan({ id: 'foo' }).id()).toBe('foo')
    })
  })

  describe('text()', () => {
    it('sets the text content of the tspan and returns itself', () => {
      const tspan = new Tspan()
      expect(tspan.text('Hello World')).toBe(tspan)
      expect(tspan.node.textContent).toBe('Hello World')
    })

    it('returns the textContent of the tspan', () => {
      const tspan = new Tspan().text('Hello World')
      expect(tspan.text()).toBe('Hello World')
    })

    it('adds a newline when this tspan is a newline', () => {
      const tspan = new Tspan().text('Hello World').newLine()
      expect(tspan.text()).toBe('Hello World\n')
    })

    it('executes a function in the context of the tspan', () => {
      const tspan = new Tspan()
      tspan.text(function (t) {
        expect(this).toBe(tspan)
        expect(t).toBe(tspan)
      })
    })
  })

  describe('dx()', () => {
    it('sets the dx attribute and returns itself', () => {
      const tspan = new Tspan()
      expect(tspan.dx(20)).toBe(tspan)
      expect(tspan.attr('dx')).toBe(20)
    })

    it('returns the dx attribute', () => {
      const tspan = new Tspan().dx(20)
      expect(tspan.dx()).toBe(20)
    })
  })

  describe('dy()', () => {
    it('sets the dy attribute and returns itself', () => {
      const tspan = new Tspan()
      expect(tspan.dy(20)).toBe(tspan)
      expect(tspan.attr('dy')).toBe(20)
    })

    it('returns the dy attribute', () => {
      const tspan = new Tspan().dy(20)
      expect(tspan.dy()).toBe(20)
    })
  })

  describe('newLine()', () => {
    it('works without text parent', () => {
      // should not fail
      const tspan = new Tspan().newLine()
      expect(tspan.dom.newLined).toBeTrue()
    })

    it('returns itself', () => {
      const tspan = new Tspan()
      expect(tspan.newLine()).toBe(tspan)
    })

    it('marks the tspan as a newline', () => {
      const tspan = new Tspan().wrap(new Text()).newLine()
      expect(tspan.dom.newLined).toBeTrue()
    })

    it('sets dy to zero of first line', () => {
      const text = new Text()
      const first = text.tspan('First Line').newLine()
      expect(first.dy()).toBe(0)
    })

    it('sets dy corresponding to line and leading', () => {
      const canvas = SVG().addTo(container)
      const text = new Text().leading(2).build(true).addTo(canvas)
      text.tspan('First Line').newLine()
      text.tspan('Second Line').newLine()
      const third = text.tspan('Third Line').newLine()

      const fontSize = getWindow()
        .getComputedStyle(third.node)
        .getPropertyValue('font-size')
      const dy = 2 * new SVGNumber(fontSize)
      expect(third.dy()).toBe(dy)
    })
  })

  describe('Tspan', () => {
    describe('tspan()', () => {
      it('creates a tspan in a text', () => {
        const text = new Text()
        const tspan = text.tspan()
        expect(tspan).toEqual(any(Tspan))
        expect(tspan.parent()).toBe(text)
      })

      it('creates a tspan in a tspan', () => {
        const tspan1 = new Tspan()
        const tspan2 = tspan1.tspan()
        expect(tspan2).toEqual(any(Tspan))
        expect(tspan2.parent()).toBe(tspan1)
      })
    })
  })

  describe('Text', () => {
    describe('newLine()', () => {
      it('creates a tspan and calls newLine() on it', () => {
        const text = new Text()
        const tspan = text.newLine()
        expect(tspan).toEqual(any(Tspan))
        expect(tspan.parent()).toBe(text)
        expect(tspan.dom.newLined).toBeTrue()
      })
    })
  })
})
