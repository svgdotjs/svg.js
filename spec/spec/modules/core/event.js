/* globals describe, expect, it, spyOn, jasmine */
import {
  windowEvents,
  getEvents,
  getEventTarget,
  clearEvents,
  dispatch,
  on,
  off
} from '../../../../src/modules/core/event.js'
import { getWindow } from '../../../../src/utils/window.js'
import { EventTarget, SVG } from '../../../../src/main.js'

const { any, createSpy } = jasmine

describe('event.js', () => {
  describe('getEvents()', () => {
    it('returns the instance events for an EventTarget', () => {
      const eventTarget = new EventTarget()
      eventTarget.events = 'Test'
      const events = getEvents(eventTarget)
      expect(events).toBe('Test')
    })

    it('accesses windowEvents if instance is window', () => {
      windowEvents.events = 'bla'
      const events = getEvents(SVG(getWindow()))
      expect(events).toBe(windowEvents.events)
    })
  })

  describe('getEventTarget()', () => {
    it('calls getEventTarget() on the instance', () => {
      const eventTarget = new EventTarget()
      const spy = spyOn(eventTarget, 'getEventTarget')
      getEventTarget(eventTarget)
      expect(spy).toHaveBeenCalled()
    })
  })

  describe('clearEvents()', () => {
    it('sets events to an empty object', () => {
      const eventTarget = new EventTarget()
      eventTarget.events = 'Test'
      clearEvents(eventTarget)
      expect(eventTarget.events).toEqual({})
    })

    it('does not do anything if no event object is found on the instance', () => {
      const eventTarget = new EventTarget()
      delete eventTarget.events
      clearEvents(eventTarget)
      expect(eventTarget.events).toBe(undefined)
    })
  })

  describe('on()', () => {
    it('binds an event to an EventTarget', () => {
      const eventTarget = new EventTarget()
      const spy = createSpy('spy')
      on(eventTarget, 'event', spy)
      dispatch(eventTarget, 'event')
      expect(spy).toHaveBeenCalledWith(any(getWindow().CustomEvent))
    })

    it('binds to multiple events with space or comma separated string', () => {
      const eventTarget = new EventTarget()
      const spy = createSpy('spy')
      on(eventTarget, 'event1 event2, event3', spy)
      dispatch(eventTarget, 'event1')
      dispatch(eventTarget, 'event2')
      dispatch(eventTarget, 'event3')
      expect(spy).toHaveBeenCalledTimes(3)
    })

    it('binds to multiple events passed as array', () => {
      const eventTarget = new EventTarget()
      const spy = createSpy('spy')
      on(eventTarget, ['event1', 'event2', 'event3'], spy)
      dispatch(eventTarget, 'event1')
      dispatch(eventTarget, 'event2')
      dispatch(eventTarget, 'event3')
      expect(spy).toHaveBeenCalledTimes(3)
    })

    it('binds a namespaced event of form event.namespace', () => {
      const eventTarget = new EventTarget()
      const spy = createSpy('spy')
      on(eventTarget, 'event.namespace', spy)
      dispatch(eventTarget, 'event')
      expect(spy).toHaveBeenCalledWith(any(getWindow().CustomEvent))
    })
  })

  describe('off()', () => {
    it('unbinds an event of an EventTarget', () => {
      const eventTarget = new EventTarget()
      const spy = createSpy('spy')
      on(eventTarget, 'event', spy)
      dispatch(eventTarget, 'event')
      off(eventTarget, 'event', spy)
      dispatch(eventTarget, 'event')
      expect(spy).toHaveBeenCalledTimes(1)
    })

    it('unbinds multiple events with space or comma separated string', () => {
      const eventTarget = new EventTarget()
      const spy = createSpy('spy')
      on(eventTarget, 'event1 event2, event3', spy)
      dispatch(eventTarget, 'event1')
      dispatch(eventTarget, 'event2')
      dispatch(eventTarget, 'event3')
      off(eventTarget, 'event1 event2, event3', spy)
      dispatch(eventTarget, 'event1')
      dispatch(eventTarget, 'event2')
      dispatch(eventTarget, 'event3')
      expect(spy).toHaveBeenCalledTimes(3)
    })

    it('unbinds multiple events with space or comma separated string', () => {
      const eventTarget = new EventTarget()
      const spy = createSpy('spy')
      on(eventTarget, ['event1', 'event2', 'event3'], spy)
      dispatch(eventTarget, 'event1')
      dispatch(eventTarget, 'event2')
      dispatch(eventTarget, 'event3')
      off(eventTarget, ['event1', 'event2', 'event3'], spy)
      dispatch(eventTarget, 'event1')
      dispatch(eventTarget, 'event2')
      dispatch(eventTarget, 'event3')
      expect(spy).toHaveBeenCalledTimes(3)
    })

    it('unbinds a namespaced event', () => {
      const eventTarget = new EventTarget()
      const spy = createSpy('spy')
      on(eventTarget, 'event.namespace', spy)
      dispatch(eventTarget, 'event')
      off(eventTarget, 'event.namespace', spy)
      dispatch(eventTarget, 'event')
      expect(spy).toHaveBeenCalledTimes(1)
    })

    it('unbinds all events including namespaced ones when only event is passed', () => {
      const eventTarget = new EventTarget()
      const spy = createSpy('spy')
      on(eventTarget, ['event1.ns1', 'event2.ns2', 'event3'], spy)
      dispatch(eventTarget, 'event1')
      dispatch(eventTarget, 'event2')
      dispatch(eventTarget, 'event3')
      off(eventTarget, ['event1', 'event2', 'event3'])
      dispatch(eventTarget, 'event1')
      dispatch(eventTarget, 'event2')
      dispatch(eventTarget, 'event3')
      expect(spy).toHaveBeenCalledTimes(3)
    })

    it('unbinds with namespace only', () => {
      const eventTarget = new EventTarget()
      const spy1 = createSpy('spy1')
      const spy2 = createSpy('spy2')
      const spy3 = createSpy('spy3')
      on(eventTarget, 'event1.ns1', spy1)
      on(eventTarget, 'event2.ns1', spy2)
      on(eventTarget, 'event3.ns2', spy3)
      dispatch(eventTarget, 'event1')
      dispatch(eventTarget, 'event2')
      dispatch(eventTarget, 'event3')
      off(eventTarget, '.ns1')
      dispatch(eventTarget, 'event1')
      dispatch(eventTarget, 'event2')
      dispatch(eventTarget, 'event3')
      expect(spy1).toHaveBeenCalledTimes(1)
      expect(spy2).toHaveBeenCalledTimes(1)
      expect(spy3).toHaveBeenCalledTimes(2)
    })

    it('unbinds all events when called without event', () => {
      const eventTarget = new EventTarget()
      const spy1 = createSpy('spy1')
      const spy2 = createSpy('spy2')
      const spy3 = createSpy('spy3')
      on(eventTarget, 'event1.ns1', spy1)
      on(eventTarget, 'event2.ns1', spy2)
      on(eventTarget, 'event3.ns2', spy3)
      dispatch(eventTarget, 'event1')
      dispatch(eventTarget, 'event2')
      dispatch(eventTarget, 'event3')
      off(eventTarget)
      dispatch(eventTarget, 'event1')
      dispatch(eventTarget, 'event2')
      dispatch(eventTarget, 'event3')
      expect(spy1).toHaveBeenCalledTimes(1)
      expect(spy2).toHaveBeenCalledTimes(1)
      expect(spy3).toHaveBeenCalledTimes(1)
    })
  })

  describe('dispatch()', () => {
    it('dispatches a custom event on the EventTarget by calling dispatchEvent()', () => {
      const eventTarget = new EventTarget()
      const spy = spyOn(eventTarget, 'dispatchEvent')
      const event = dispatch(
        eventTarget,
        'event',
        { some: 'data' },
        { cancelable: false }
      )
      expect(event).toEqual(any(getWindow().CustomEvent))
      expect(spy).toHaveBeenCalledWith(event)
      expect(event.detail).toEqual({ some: 'data' })
      expect(event.cancelable).toBe(false)
    })

    it('dispatches the passed event directly', () => {
      const eventTarget = new EventTarget()
      const spy = spyOn(eventTarget, 'dispatchEvent')

      const CustomEvent = getWindow().CustomEvent
      const event1 = new CustomEvent('event', { detail: { some: 'data' } })
      const event2 = dispatch(eventTarget, event1)
      expect(event1).toBe(event2)
      expect(spy).toHaveBeenCalledWith(event1)
    })
  })
})
