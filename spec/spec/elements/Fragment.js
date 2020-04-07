/* globals describe, expect, it, spyOn, jasmine */

import { Fragment, Dom } from '../../../src/main.js'
import { getWindow } from '../../../src/utils/window.js'

const { any } = jasmine

describe('Fragment.js', () => {

  describe('()', () => {
    it('creates a new object of type Fragment', () => {
      expect(new Fragment()).toEqual(any(Fragment))
    })

    it('uses passed node instead of creating', () => {
      const fragment = getWindow().document.createDocumentFragment()
      expect(new Fragment(fragment).node).toBe(fragment)
    })

    it('has all Container methods available', () => {
      const frag = new Fragment()
      const rect = frag.rect(100, 100)

      expect(frag.children()).toEqual([ rect ])
    })
  })

  describe('svg()', () => {
    describe('as setter', () => {
      it('calls parent method with outerHtml = false', () => {
        const frag = new Fragment()
        const spy = spyOn(Dom.prototype, 'svg').and.callThrough()
        frag.svg('<rect>', true)
        expect(spy).toHaveBeenCalledWith('<rect>', false)
      })
    })

    describe('as getter', () => {
      it('calls parent method with outerHtml = false - 1', () => {
        const frag = new Fragment()
        const group = frag.group()
        group.rect(123.456, 234.567)
        const spy = spyOn(Dom.prototype, 'svg').and.callThrough()

        expect(frag.svg(false)).toBe('<g><rect width="123.456" height="234.567"></rect></g>')
        expect(spy).toHaveBeenCalledWith(null, false)
      })

      it('calls parent method with outerHtml = false - 2', () => {
        const frag = new Fragment()
        const group = frag.group()
        group.rect(123.456, 234.567)
        const spy = spyOn(Dom.prototype, 'svg').and.callThrough()

        expect(frag.svg(null, true)).toBe('<g><rect width="123.456" height="234.567"></rect></g>')
        expect(spy).toHaveBeenCalledWith(null, false)
      })
    })

  })
})
