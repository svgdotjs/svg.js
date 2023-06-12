/* globals describe, expect, it */

import { Rect } from '../../../../src/main.js'

describe('data.js', () => {
  describe('Dom', () => {
    describe('data()', () => {
      describe('as getter', () => {
        it('returns all data as object', () => {
          const rect = new Rect({
            'data-fill': 'none',
            'data-outline-width': '1px',
            'data-stroke': 'none'
          })
          expect(rect.data()).toEqual({
            fill: 'none',
            'outline-width': '1px',
            stroke: 'none'
          })
        })

        it('returns an object with selected data properties', () => {
          const rect = new Rect({
            'data-fill': 'none',
            'data-outline-width': '1px',
            'data-stroke': 'none'
          })
          expect(rect.data(['fill', 'stroke'])).toEqual({
            fill: 'none',
            stroke: 'none'
          })
        })

        it('returns a single property with property name given', () => {
          const rect = new Rect({
            'data-fill': 'none',
            'data-outline-width': '1px',
            'data-stroke': 'none'
          })
          expect(rect.data('fill')).toBe('none')
        })

        it('returns undefined if data property is not set', () => {
          const rect = new Rect({
            'data-fill': 'none',
            'data-outline-width': '1px',
            'data-stroke': 'none'
          })
          expect(rect.data('outline-color')).toBe(undefined)
        })
      })

      describe('as setter', () => {
        it('returns itself', () => {
          const rect = new Rect({
            'data-fill': 'none',
            'data-outline-width': '1px',
            'data-stroke': 'none'
          })
          expect(rect.data('fill', 'black')).toBe(rect)
        })

        it('adds a data property', () => {
          const rect = new Rect({
            'data-fill': 'none',
            'data-outline-width': '1px',
            'data-stroke': 'none'
          })
          expect(rect.data('stroke-width', '2px').data('stroke-width')).toBe(
            '2px'
          )
        })

        it('changes a data property', () => {
          const rect = new Rect({
            'data-fill': 'none',
            'data-outline-width': '1px',
            'data-stroke': 'none'
          })
          expect(rect.data('fill', 'black').data('fill')).toBe('black')
        })

        it('sets an object of properties', () => {
          const rect = new Rect()
          expect(rect.data({ fill: 'none', stroke: 'none' }).data()).toEqual({
            fill: 'none',
            stroke: 'none'
          })
        })

        it('removes property if null is passed as value', () => {
          const rect = new Rect({
            'data-fill': 'none',
            'data-outline-width': '1px',
            'data-stroke': 'none'
          })
          expect(rect.data('fill', null).data('fill')).toBe(undefined)
        })

        it('removes property if null is passed as part of object', () => {
          const rect = new Rect({
            'data-fill': 'none',
            'data-outline-width': '1px',
            'data-stroke': 'none'
          })
          expect(rect.data({ fill: null, stroke: 'black' }).data('fill')).toBe(
            undefined
          )
        })

        it('converts everything except number and strings to JSON', () => {
          const rect = new Rect()
          expect(rect.data('fill', { some: 'object' }).attr('data-fill')).toBe(
            JSON.stringify({ some: 'object' })
          )
          expect(rect.data('fill', 5).attr('data-fill')).toBe(5)
          expect(rect.data('fill', 'string').attr('data-fill')).toBe('string')
        })

        it('does not convert to json with third parameter true', () => {
          const rect = new Rect()
          expect(
            rect.data('fill', { some: 'object' }, true).attr('data-fill')
          ).toBe({}.toString())
        })
      })
    })
  })
})
