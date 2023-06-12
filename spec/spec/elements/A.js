/* globals describe, expect, it, jasmine */

import { A, G, Rect } from '../../../src/main.js'

const { any } = jasmine

const url = 'https://svgjs.dev'
describe('A.js', () => {
  describe('()', () => {
    it('creates a new object of type A', () => {
      expect(new A()).toEqual(any(A))
    })

    it('sets passed attributes on the element', () => {
      expect(new A({ id: 'foo' }).id()).toBe('foo')
    })
  })

  describe('to()', () => {
    it('creates xlink:href attribute', () => {
      const link = new A()
      link.to(url)
      expect(link.attr('href')).toBe(url)
    })
  })

  describe('target()', () => {
    it('creates target attribute', () => {
      const link = new A()
      link.target('_blank')
      expect(link.attr('target')).toBe('_blank')
    })
  })

  describe('Container', () => {
    describe('link()', () => {
      it('creates a link with given url', () => {
        const group = new G()
        const link = group.link(url)
        expect(link.attr('href')).toBe(url)
        expect(link).toEqual(any(A))
      })
    })
  })

  describe('Element', () => {
    describe('linker()', () => {
      it('returns the instance of the link of a linked element', () => {
        const link = new A().to(url)
        const rect = link.rect(100, 100)

        expect(rect.linker()).toBe(link)
      })

      it('returns null if no link is found', () => {
        const group = new G()
        const rect = group.rect(100, 100)

        expect(rect.linker()).toBe(null)
      })

      it('returns null when el is not in dom at all', () => {
        const group = new G()
        expect(group.linker()).toBe(null)
      })
    })

    describe('unlink()', () => {
      it('returns itself', () => {
        const group = new G()
        expect(group.unlink()).toBe(group)
      })

      it('removes the link', () => {
        const group = new G()
        const link = group.link(url)
        const rect = link.rect(100, 100)

        expect(rect.unlink().parent()).toBe(group)
        expect(link.parent()).toBe(null)
      })

      it("removes also the link when link wasn't in document", () => {
        const link = new A().to(url)
        const rect = link.rect(100, 100)

        expect(rect.unlink().parent()).toBe(null)
        expect(link.parent()).toBe(null)
      })
    })

    describe('linkTo()', () => {
      it('wraps the called element in a link with given url', () => {
        const rect = new Rect()
        rect.linkTo(url)
        expect(rect.linker()).toEqual(any(A))
        expect(rect.linker().attr('href')).toBe(url)
      })

      it('wraps the called element in a link with given block', () => {
        const rect = new Rect()
        rect.linkTo(function (link) {
          link.to(url).target('_blank')
        })
        expect(rect.linker().attr('href')).toBe(url)
        expect(rect.linker().attr('target')).toBe('_blank')
      })

      it('reuses existing link if possible', () => {
        const rect = new Rect()
        rect.linkTo(url)
        const link = rect.linker()
        rect.linkTo(url + '/something')
        expect(rect.linker()).toBe(link)
      })
    })
  })
})
