/* globals describe, expect, it, spyOn, jasmine */

import { EventTarget } from '../../../src/main.js'
import { getWindow } from '../../../src/utils/window.js'

const { any, objectContaining, createSpy } = jasmine

const event = (name) => {
  const CustomEvent = getWindow().CustomEvent
  return new CustomEvent(name)
}

describe('EventTarget.js', () => {
  describe('()', () => {
    it('creates a new object of type EventTarget', () => {
      expect(new EventTarget()).toEqual(any(EventTarget))
    })
  })

  describe('addEventListener()', () => {
    it('is a noop', () => {
      const target = new EventTarget()
      const frozen = Object.freeze(target)
      frozen.addEventListener()
    })
  })

  describe('dispatch()', () => {
    it('eventually calls dispatchEvent on the target and returns the event', () => {
      const target = new EventTarget()
      const spy = spyOn(target, 'dispatchEvent').and.callThrough()
      const options = { cancelable: false }
      const event = target.dispatch('bla', 'foo', options)
      expect(spy).toHaveBeenCalledWith(event)
      expect(event).toEqual(
        objectContaining({ type: 'bla', detail: 'foo', cancelable: false })
      )
    })
  })

  describe('dispatchEvent()', () => {
    it('returns true if no events are bound', () => {
      const target = new EventTarget()
      expect(target.dispatchEvent(event('event'))).toBe(true)
    })

    it('calls the handler for a bound event', () => {
      const target = new EventTarget()
      const spy = createSpy('event')
      const ev = event('event')
      target.on('event', spy)
      const ret = target.dispatchEvent(ev)
      expect(spy).toHaveBeenCalledWith(ev)
      expect(ret).toBe(!ev.defaultPrevented)
    })

    it('returns negative default prevented', () => {
      const target = new EventTarget()
      const ev = event('event')
      ev.preventDefault()
      const ret = target.dispatchEvent(ev)
      expect(ret).toBe(!ev.defaultPrevented)
    })
  })

  describe('fire()', () => {
    it('calls dispatch and returns the element', () => {
      const target = new EventTarget()
      const spy = spyOn(target, 'dispatch')
      expect(target.fire('event', 'foo', 'bar')).toBe(target)
      expect(spy).toHaveBeenCalledWith('event', 'foo', 'bar')
    })
  })

  describe('getEventHolder()', () => {
    it('returns itself', () => {
      const target = new EventTarget()
      expect(target.getEventHolder()).toBe(target)
    })
  })

  describe('getEventTarget()', () => {
    it('returns itself', () => {
      const target = new EventTarget()
      expect(target.getEventTarget()).toBe(target)
    })
  })

  describe('off()', () => {
    it('returns itself', () => {
      const target = new EventTarget()
      const spy = createSpy()
      expect(target.on('event', spy)).toBe(target)
    })

    it('removes an event binding from the target', () => {
      const target = new EventTarget()
      const spy = createSpy()
      target.on('event', spy)
      target.dispatch('event')
      expect(spy.calls.count()).toBe(1)
      target.off('event', spy)
      target.dispatch('event')
      expect(spy.calls.count()).toBe(1)
    })

    it('removes an event binding with options from the target', () => {
      const target = new EventTarget()
      const spy = createSpy()
      target.on('event', spy, undefined, { capture: true })
      target.dispatch('event')
      expect(spy.calls.count()).toBe(1)
      target.off('event', spy, { capture: true })
      target.dispatch('event')
      expect(spy.calls.count()).toBe(1)
    })
  })

  describe('on()', () => {
    it('returns itself', () => {
      const target = new EventTarget()
      const spy = createSpy()
      expect(target.off('event', spy)).toBe(target)
    })

    it('adds an event binding to the target', () => {
      const target = new EventTarget()
      const spy = createSpy()
      expect(spy.calls.count()).toBe(0)
      target.on('event', spy)
      target.dispatch('event')
      expect(spy.calls.count()).toBe(1)
    })
  })

  describe('removeEventListener()', () => {
    it('is a noop', () => {
      const target = new EventTarget()
      const frozen = Object.freeze(target)
      frozen.removeEventListener()
    })
  })
})
