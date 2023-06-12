/* globals describe, expect, it */

import { Rect } from '../../../../src/main.js'

describe('class.js', () => {
  describe('Dom', () => {
    describe('classes()', () => {
      it('returns all classes on an element', () => {
        const rect = new Rect({ class: 'myClass myClass2' })
        expect(rect.classes()).toEqual(['myClass', 'myClass2'])
      })

      it('returns an empty array if no class on the element', () => {
        const rect = new Rect()
        expect(rect.classes()).toEqual([])
      })
    })

    describe('hasClass()', () => {
      it('returns true if a class is present on the element', () => {
        const rect = new Rect({ class: 'myClass myClass2' })
        expect(rect.hasClass('myClass')).toBe(true)
      })

      it('returns false if a class is not present on the element', () => {
        const rect = new Rect({ class: 'myClass myClass2' })
        expect(rect.hasClass('myClass3')).toBe(false)
      })
    })

    describe('addClass()', () => {
      it('returns itself', () => {
        const rect = new Rect({ class: 'myClass myClass2' })
        expect(rect.addClass('myClass3')).toBe(rect)
      })

      it('adds a class to the element', () => {
        const rect = new Rect({ class: 'myClass myClass2' }).addClass(
          'myClass3'
        )
        expect(rect.classes()).toEqual(['myClass', 'myClass2', 'myClass3'])
      })

      it('does nothing if class already present on the element', () => {
        const rect = new Rect({ class: 'myClass myClass2' }).addClass('myClass')
        expect(rect.classes()).toEqual(['myClass', 'myClass2'])
      })
    })

    describe('removeClass()', () => {
      it('returns itself', () => {
        const rect = new Rect({ class: 'myClass myClass2' })
        expect(rect.removeClass('myClass3')).toBe(rect)
      })

      it('removes a class from the element', () => {
        const rect = new Rect({ class: 'myClass myClass2' }).removeClass(
          'myClass2'
        )
        expect(rect.classes()).toEqual(['myClass'])
      })

      it('does nothing if class is not present on the element', () => {
        const rect = new Rect({ class: 'myClass myClass2' }).removeClass(
          'myClass3'
        )
        expect(rect.classes()).toEqual(['myClass', 'myClass2'])
      })
    })

    describe('toggleClass()', () => {
      it('returns itself', () => {
        const rect = new Rect({ class: 'myClass myClass2' })
        expect(rect.toggleClass('myClass3')).toBe(rect)
      })

      it('removes a class from the element when its present', () => {
        const rect = new Rect({ class: 'myClass myClass2' }).toggleClass(
          'myClass2'
        )
        expect(rect.classes()).toEqual(['myClass'])
      })

      it('adds a class to the element if its not present', () => {
        const rect = new Rect({ class: 'myClass myClass2' }).toggleClass(
          'myClass3'
        )
        expect(rect.classes()).toEqual(['myClass', 'myClass2', 'myClass3'])
      })
    })
  })
})
