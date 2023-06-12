/* globals describe, expect, it */

import { Rect } from '../../../../src/main.js'

describe('css.js', () => {
  describe('Dom', () => {
    describe('css()', () => {
      describe('as getter', () => {
        it('returns all css as object', () => {
          const rect = new Rect({
            style: 'fill: none; outline-width: 1px; stroke: none'
          })
          expect(rect.css()).toEqual({
            fill: 'none',
            'outline-width': '1px',
            stroke: 'none'
          })
        })

        it('returns an object with selected css properties', () => {
          const rect = new Rect({
            style: 'fill: none; outline-width: 1px; stroke: none'
          })
          expect(rect.css(['fill', 'stroke'])).toEqual({
            fill: 'none',
            stroke: 'none'
          })
        })

        it('returns a single property with property name given', () => {
          const rect = new Rect({
            style: 'fill: none; outline-width: 1px; stroke: none'
          })
          expect(rect.css('fill')).toBe('none')
        })

        it('returns undefined if css property is not set', () => {
          const rect = new Rect({
            style: 'fill: none; outline-width: 1px; stroke: none'
          })
          expect(rect.css('outline-color')).toBe('')
        })
      })

      describe('as setter', () => {
        it('returns itself', () => {
          const rect = new Rect({
            style: 'fill: none; outline-width: 1px; stroke: none'
          })
          expect(rect.css('fill', 'black')).toBe(rect)
        })

        it('adds a css property', () => {
          const rect = new Rect({
            style: 'fill: none; outline-width: 1px; stroke: none'
          })
          expect(rect.css('stroke-width', '2px').css('stroke-width')).toBe(
            '2px'
          )
        })

        it('changes a css property', () => {
          const rect = new Rect({
            style: 'fill: none; outline-width: 1px; stroke: none'
          })
          expect(rect.css('fill', 'black').css('fill')).toBe('black')
        })

        it('sets an object of properties', () => {
          const rect = new Rect()
          expect(rect.css({ fill: 'none', stroke: 'none' }).css()).toEqual({
            fill: 'none',
            stroke: 'none'
          })
        })

        it('removes property if empty string is passed as value', () => {
          const rect = new Rect({
            style: 'fill: none; outline-width: 1px; stroke: none'
          })
          expect(rect.css('fill', '').css('fill')).toBe('')
        })

        it('removes property if null is passed as value', () => {
          const rect = new Rect({
            style: 'fill: none; outline-width: 1px; stroke: none'
          })
          expect(rect.css('fill', null).css('fill')).toBe('')
        })

        it('removes property if null is passed as part of object', () => {
          const rect = new Rect({
            style: 'fill: none; outline-width: 1px; stroke: none'
          })
          expect(rect.css({ fill: null, stroke: 'black' }).css('fill')).toBe('')
        })
      })
    })

    describe('show()', () => {
      it('returns itself', () => {
        const rect = new Rect()
        expect(rect.show()).toBe(rect)
      })

      it('removes the display property', () => {
        const rect = new Rect().hide()
        expect(rect.show().css('display')).toBe('')
      })
    })

    describe('hide()', () => {
      it('returns itself', () => {
        const rect = new Rect()
        expect(rect.hide()).toBe(rect)
      })

      it('sets the css display property to none', () => {
        const rect = new Rect()
        expect(rect.hide().css('display')).toBe('none')
      })
    })

    describe('visible()', () => {
      it('returns true if display is not none', () => {
        const rect = new Rect()
        expect(rect.show().visible()).toBe(true)
        expect(rect.css('display', 'block').visible()).toBe(true)
      })

      it('returns false if display is none', () => {
        const rect = new Rect()
        expect(rect.hide().visible()).toBe(false)
      })
    })
  })
})
