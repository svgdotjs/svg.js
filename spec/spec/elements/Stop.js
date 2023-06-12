/* globals describe, expect, it, jasmine */

import { Stop, Gradient } from '../../../src/main.js'

const { any } = jasmine

describe('Stop.js', () => {
  describe('()', () => {
    it('creates a new object of type Stop', () => {
      expect(new Stop()).toEqual(any(Stop))
    })

    it('sets passed attributes on the element', () => {
      expect(new Stop({ id: 'foo' }).id()).toBe('foo')
    })
  })

  describe('update()', () => {
    it('sets offset, color and opacity with 3 arguments given', () => {
      const stop = new Stop()
      stop.update(0.1, '#ffffff', 0.5)
      expect(stop.attr('offset')).toBe(0.1)
      expect(stop.attr('stop-color')).toBe('#ffffff')
      expect(stop.attr('stop-opacity')).toBe(0.5)
    })

    it('sets offset, color and opacity with object given', () => {
      const stop = new Stop()
      stop.update({ offset: 0.1, color: '#ffffff', opacity: 0.5 })
      expect(stop.attr('offset')).toBe(0.1)
      expect(stop.attr('stop-color')).toBe('#ffffff')
      expect(stop.attr('stop-opacity')).toBe(0.5)
    })

    it('sets efault values if not all supplied', () => {
      let stop = new Stop()
      stop.update({ offset: 0.1 })
      expect(stop.attr('offset')).toBe(0.1)
      expect(stop.attr('stop-color')).toBe('#000000')
      expect(stop.attr('stop-opacity')).toBe(1)

      stop = new Stop()
      stop.update({ color: '#ffffff' })
      expect(stop.attr('offset')).toBe(0)
      expect(stop.attr('stop-color')).toBe('#ffffff')
      expect(stop.attr('stop-opacity')).toBe(1)

      stop = new Stop()
      stop.update({ opacity: 0.5 })
      expect(stop.attr('offset')).toBe(0)
      expect(stop.attr('stop-color')).toBe('#000000')
      expect(stop.attr('stop-opacity')).toBe(0.5)
    })
  })

  describe('Gradient', () => {
    describe('stop()', () => {
      it('creates a stop in the gradient with 3 arguments', () => {
        const gradient = new Gradient('linear')
        const stop = gradient.stop(0.1, '#ffffff', 0.5)
        expect(stop).toEqual(any(Stop))
        expect(stop.attr('offset')).toBe(0.1)
        expect(stop.attr('stop-color')).toBe('#ffffff')
        expect(stop.attr('stop-opacity')).toBe(0.5)
      })

      it('creates stop in the gradient with object given', () => {
        const gradient = new Gradient('linear')
        const stop = gradient.stop({
          offset: 0.1,
          color: '#ffffff',
          opacity: 0.5
        })
        expect(stop.attr('offset')).toBe(0.1)
        expect(stop.attr('stop-color')).toBe('#ffffff')
        expect(stop.attr('stop-opacity')).toBe(0.5)
      })
    })
  })
})
