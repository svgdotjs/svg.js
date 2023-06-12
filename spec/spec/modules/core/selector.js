/* globals describe, expect, it, container */

import { find, SVG, G } from '../../../../src/main.js'
import { getWindow } from '../../../../src/utils/window.js'

describe('selector.js', () => {
  describe('baseFind()', () => {
    it('finds all elements of a selector in the document', () => {
      const div = SVG('<div />', true).id('foo').addTo(container)
      const span = SVG('<span />', true).addClass('bar').addTo(div)
      const span2 = SVG('<span />', true).addTo(div)

      expect(find('#canvas').map((el) => el.node)).toEqual([container])
      expect(find('span')).toEqual([span, span2])
      expect(find('#foo')).toEqual([div])
      expect(find('.bar')).toEqual([span])
    })

    it('finds all elements of a selector scoped to an element', () => {
      const div = SVG('<div />', true).id('foo').addTo(container)

      expect(find('#canvas', getWindow().document)[0].node).toBe(container)
      expect(find('#foo', container)).toEqual([div])
      expect(find('#canvas', div.node)).toEqual([])
    })
  })

  describe('Dom', () => {
    describe('find()', () => {
      it('finds all elements matching the selector in this element', () => {
        const g1 = new G()
        const g2 = new G().addTo(g1).id('foo')
        const g3 = new G().addTo(g1).addClass('bar')
        const g4 = new G().addTo(g2)
        const g5 = new G().addTo(g3)

        expect(g1.find('g')).toEqual([g2, g4, g3, g5])
        expect(g2.find('g')).toEqual([g4])
        expect(g1.find('#foo')).toEqual([g2])
        expect(g2.find('#foo')).toEqual([])
        expect(g1.find('.bar')).toEqual([g3])
      })
    })

    describe('findOne()', () => {
      it('finds an element in this element', () => {
        const g1 = new G()
        const g2 = new G().addTo(g1).id('foo')
        const g3 = new G().addTo(g1).addClass('bar')
        const g4 = new G().addTo(g2)

        expect(g1.findOne('g')).toBe(g2)
        expect(g2.findOne('g')).toBe(g4)
        expect(g1.findOne('#foo')).toBe(g2)
        expect(g2.findOne('#foo')).toBe(null)
        expect(g1.findOne('.bar')).toBe(g3)
      })
    })
  })
})
