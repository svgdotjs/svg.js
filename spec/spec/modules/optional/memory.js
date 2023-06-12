/* globals describe, expect, it */

import { Rect } from '../../../../src/main.js'

describe('memory.js', () => {
  describe('Dom', () => {
    describe('memory()', () => {
      it('returns all memory as object', () => {
        const rect = new Rect().remember({
          fill: 'none',
          'outline-width': '1px',
          stroke: 'none'
        })
        expect(rect.memory()).toEqual({
          fill: 'none',
          'outline-width': '1px',
          stroke: 'none'
        })
      })
    })

    describe('remember()', () => {
      describe('as getter', () => {
        it('returns a single property with property name given', () => {
          const rect = new Rect().remember({
            fill: 'none',
            'outline-width': '1px',
            stroke: 'none'
          })
          expect(rect.remember('fill')).toBe('none')
        })

        it('returns undefined if memory property is not set', () => {
          const rect = new Rect().remember({
            fill: 'none',
            'outline-width': '1px',
            stroke: 'none'
          })
          expect(rect.remember('outline-color')).toBe(undefined)
        })
      })

      describe('as setter', () => {
        it('returns itself', () => {
          const rect = new Rect().remember({
            fill: 'none',
            'outline-width': '1px',
            stroke: 'none'
          })
          expect(rect.remember('fill', 'black')).toBe(rect)
        })

        it('adds a memory property', () => {
          const rect = new Rect().remember({
            fill: 'none',
            'outline-width': '1px',
            stroke: 'none'
          })
          expect(
            rect.remember('stroke-width', '2px').remember('stroke-width')
          ).toBe('2px')
        })

        it('changes a memory property', () => {
          const rect = new Rect().remember({
            fill: 'none',
            'outline-width': '1px',
            stroke: 'none'
          })
          expect(rect.remember('fill', 'black').remember('fill')).toBe('black')
        })

        it('sets an object of properties', () => {
          const rect = new Rect()
          expect(
            rect.remember({ fill: 'none', stroke: 'none' }).memory()
          ).toEqual({ fill: 'none', stroke: 'none' })
        })
      })
    })

    describe('forget()', () => {
      it('removes property', () => {
        const rect = new Rect().remember({
          fill: 'none',
          'outline-width': '1px',
          stroke: 'none'
        })
        expect(rect.forget('fill').remember('fill')).toBe(undefined)
      })

      it('removes multiple properties', () => {
        const rect = new Rect().remember({
          fill: 'none',
          'outline-width': '1px',
          stroke: 'none'
        })
        expect(rect.forget('fill', 'stroke').memory()).toEqual({
          'outline-width': '1px'
        })
      })

      it('erases the whole object with nothing passed', () => {
        const rect = new Rect().remember({
          fill: 'none',
          'outline-width': '1px',
          stroke: 'none'
        })
        expect(rect.forget().memory()).toEqual({})
      })
    })
  })
})
