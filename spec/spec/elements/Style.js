/* globals describe, expect, it, jasmine */

import { Style, G } from '../../../src/main.js'

const { any } = jasmine

describe('Style.js', () => {
  describe('()', () => {
    it('creates a new object of type Style', () => {
      expect(new Style()).toEqual(any(Style))
    })

    it('sets passed attributes on the element', () => {
      expect(new Style({ id: 'foo' }).id()).toBe('foo')
    })
  })

  describe('addText()', () => {
    it('appends a string to the current textContent and returns itself', () => {
      const style = new Style()
      expect(style.addText('foo').node.textContent).toBe('foo')
      expect(style.addText('bar').node.textContent).toBe('foobar')
      expect(style.addText('foobar')).toBe(style)
    })

    it('appends an empty string if nothing passed', () => {
      const style = new Style()
      expect(style.addText().node.textContent).toBe('')
    })
  })

  describe('font()', () => {
    it('adds a font-face rule to load a custom font and returns itself', () => {
      const style = new Style()
      expect(style.font('fontName', 'url')).toBe(style)
      expect(style.node.textContent).toBe(
        '@font-face{font-family:fontName;src:url;}'
      )
    })

    it('adds extra parameters if wanted', () => {
      const style = new Style()
      style.font('fontName', 'url', { foo: 'bar' })
      expect(style.node.textContent).toBe(
        '@font-face{font-family:fontName;src:url;foo:bar;}'
      )
    })
  })

  describe('rule()', () => {
    it('adds a css rule', () => {
      const style = new Style()
      expect(style.rule('#id', { fontSize: 15 })).toBe(style)
      expect(style.node.textContent).toBe('#id{font-size:15;}')
    })

    it('adds only selector when no obj was given', () => {
      const style = new Style()
      style.rule('#id')
      expect(style.node.textContent).toBe('#id')
    })

    it('adds nothing if no selector was given', () => {
      const style = new Style()
      style.rule()
      expect(style.node.textContent).toBe('')
    })
  })

  describe('Container', () => {
    describe('style()', () => {
      it('creates a style element in the container and adds a rule', () => {
        const g = new G()
        const style = g.style('#id', { fontSize: 15 })
        expect(style).toEqual(any(Style))
        expect(style.node.textContent).toBe('#id{font-size:15;}')
      })
    })

    describe('fontface()', () => {
      it('creates a style element in the container and adds a font-face rule', () => {
        const g = new G()
        const style = g.fontface('fontName', 'url', { foo: 'bar' })
        expect(style).toEqual(any(Style))
        expect(style.node.textContent).toBe(
          '@font-face{font-family:fontName;src:url;foo:bar;}'
        )
      })
    })
  })
})
