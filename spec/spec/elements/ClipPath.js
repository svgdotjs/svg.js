/* globals describe, expect, it, spyOn, jasmine, container */

import { ClipPath, SVG, Container, Rect } from '../../../src/main.js'

const { any } = jasmine

describe('ClipPath.js', () => {
  describe('()', () => {
    it('creates a new object of type ClipPath', () => {
      expect(new ClipPath()).toEqual(any(ClipPath))
    })

    it('sets passed attributes on the element', () => {
      expect(new ClipPath({ id: 'foo' }).id()).toBe('foo')
    })
  })

  describe('remove()', () => {
    it('unclips all targets', () => {
      const canvas = SVG().addTo(container)
      const clip = canvas.clip()
      const rect = canvas.rect(100, 100).clipWith(clip)
      expect(clip.remove()).toBe(clip)
      expect(rect.clipper()).toBe(null)
    })

    it('calls remove on parent class', () => {
      const clip = new ClipPath()
      const spy = spyOn(Container.prototype, 'remove')
      clip.remove()
      expect(spy).toHaveBeenCalled()
    })
  })

  describe('targets()', () => {
    it('gets all targets of this clipPath', () => {
      const canvas = SVG().addTo(container)
      const clip = canvas.clip()
      const rect = canvas.rect(100, 100).clipWith(clip)
      expect(clip.targets()).toEqual([rect])
    })
  })

  describe('Container', () => {
    describe('clip()', () => {
      it('creates a clipPath in the defs', () => {
        const canvas = SVG()
        const clip = canvas.clip()
        expect(clip).toEqual(any(ClipPath))
        expect(canvas.defs().children()).toEqual([clip])
      })
    })
  })

  describe('Element', () => {
    describe('clipper()', () => {
      it('returns the instance of ClipPath the current element is clipped with', () => {
        const canvas = SVG().addTo(container)
        const clip = canvas.clip()
        const rect = canvas.rect(100, 100).clipWith(clip)
        expect(rect.clipper()).toEqual(clip)
      })

      it('returns null if no clipPath was found', () => {
        expect(new Rect().clipper()).toBe(null)
      })
    })

    describe('clipWith()', () => {
      it('sets the clip-path attribute on the element to the id of the clipPath', () => {
        const clip = new ClipPath().id('foo')
        const rect = new Rect().clipWith(clip)
        expect(rect.attr('clip-path')).toBe('url(#foo)')
      })

      it('creates a clipPath and appends the passed element to it to clip current element', () => {
        const canvas = SVG().addTo(container)
        const circle = canvas.circle(40)
        const rect = canvas.rect(100, 100).clipWith(circle)
        expect(circle.parent()).toEqual(any(ClipPath))
        expect(rect.attr('clip-path')).toBe(`url(#${circle.parent().id()})`)
      })
    })

    describe('unclip()', () => {
      it('sets the clip-target attribute to null and returns itself', () => {
        const clip = new ClipPath().id('foo')
        const rect = new Rect().clipWith(clip)
        expect(rect.unclip()).toBe(rect)
        expect(rect.attr('clip-path')).toBe(undefined)
      })
    })
  })
})
