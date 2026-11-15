/* globals describe, expect, it, beforeEach, afterEach, jasmine */

import { Animator, Queue } from '../../../src/main.js'
import { getWindow } from '../../../src/utils/window.js'

describe('Animator.js', () => {
  beforeEach(() => {
    jasmine.RequestAnimationFrame.install(getWindow())
    Animator.timeouts = new Queue()
    Animator.frames = new Queue()
    Animator.immediates = new Queue()
    Animator.nextDraw = null
  })

  afterEach(() => {
    jasmine.RequestAnimationFrame.uninstall(getWindow())
  })

  describe('timeout()', () => {
    it('calls a function after a specific time', () => {
      var spy = jasmine.createSpy('tester')
      Animator.timeout(spy, 100)

      jasmine.RequestAnimationFrame.tick(99)
      expect(spy).not.toHaveBeenCalled()
      jasmine.RequestAnimationFrame.tick()
      expect(spy).toHaveBeenCalled()
    })

    it('preserves execution order across multiple timeouts', () => {
      const order = []
      Animator.timeout(() => order.push('t2'), 100)
      Animator.timeout(() => order.push('t1'), 50)
      Animator.timeout(() => order.push('t3'), 150)

      jasmine.RequestAnimationFrame.tick(60)
      expect(order).toEqual(['t1'])
      jasmine.RequestAnimationFrame.tick(50)
      expect(order).toEqual(['t1', 't2'])
      jasmine.RequestAnimationFrame.tick(50)
      expect(order).toEqual(['t1', 't2', 't3'])
    })

    it('does not synchronously execute timeouts added during the current draw loop', () => {
      const nestedSpy = jasmine.createSpy('nested')
      Animator.timeout(() => {
        Animator.timeout(nestedSpy, 0)
      }, 0)

      jasmine.RequestAnimationFrame.tick(1)
      expect(nestedSpy).not.toHaveBeenCalled()

      jasmine.RequestAnimationFrame.tick(1)
      expect(nestedSpy).toHaveBeenCalled()
    })
  })

  describe('cancelTimeout()', () => {
    it('cancels a timeout which was created with timeout()', () => {
      var spy = jasmine.createSpy('tester')
      var id = Animator.timeout(spy, 100)
      Animator.clearTimeout(id)

      expect(spy).not.toHaveBeenCalled()
      jasmine.RequestAnimationFrame.tick(100)
      expect(spy).not.toHaveBeenCalled()
    })

    it('cancels a timeout after an intermediate animation frame has rendered', () => {
      const spy = jasmine.createSpy('tester')
      const id = Animator.timeout(spy, 100)

      jasmine.RequestAnimationFrame.tick(50)
      expect(spy).not.toHaveBeenCalled()

      Animator.clearTimeout(id)

      jasmine.RequestAnimationFrame.tick(60)
      expect(spy).not.toHaveBeenCalled()
    })

    it('preserves the queue node instance across requeues', () => {
      const id = Animator.timeout(() => {}, 100)
      jasmine.RequestAnimationFrame.tick(50)

      expect(Animator.timeouts._first).toBe(id)
    })

    it('does not loop infinitely when an earlier callback cancels the last timeout in the batch', () => {
      let t3
      let shifts = 0
      const maxShifts = 10
      const originalShiftNode = Animator.timeouts.shiftNode.bind(
        Animator.timeouts
      )

      spyOn(Animator.timeouts, 'shiftNode').and.callFake(() => {
        if (++shifts > maxShifts) {
          throw new Error(
            'Timeout processing exceeded maximum expected iterations'
          )
        }
        return originalShiftNode()
      })

      const t1Spy = jasmine.createSpy('t1').and.callFake(() => {
        Animator.clearTimeout(t3)
      })
      const t2Spy = jasmine.createSpy('t2')
      const t3Spy = jasmine.createSpy('t3')

      Animator.timeout(t1Spy, 0)
      Animator.timeout(t2Spy, 100)
      t3 = Animator.timeout(t3Spy, 100)

      jasmine.RequestAnimationFrame.tick(1)

      expect(shifts).toBeLessThanOrEqual(maxShifts)
      expect(t1Spy).toHaveBeenCalled()
      expect(t2Spy).not.toHaveBeenCalled()
      expect(t3Spy).not.toHaveBeenCalled()

      jasmine.RequestAnimationFrame.tick(100)
      expect(t2Spy).toHaveBeenCalled()
      expect(t3Spy).not.toHaveBeenCalled()
    })
  })

  describe('frame()', () => {
    it('calls a function at the next animationFrame', () => {
      var spy = jasmine.createSpy('tester')

      Animator.frame(spy)
      expect(spy).not.toHaveBeenCalled()
      jasmine.RequestAnimationFrame.tick()
      expect(spy).toHaveBeenCalled()
    })
  })

  describe('cancelFrame()', () => {
    it('cancels a single frame which was created with frame()', () => {
      var spy = jasmine.createSpy('tester')

      const id = Animator.frame(spy)
      Animator.cancelFrame(id)

      expect(spy).not.toHaveBeenCalled()
      jasmine.RequestAnimationFrame.tick()
      expect(spy).not.toHaveBeenCalled()
    })
  })

  describe('immediate()', () => {
    it('calls a function at the next animationFrame but after all frames are processed', () => {
      var spy = jasmine.createSpy('tester')

      Animator.immediate(spy)

      expect(spy).not.toHaveBeenCalled()
      jasmine.RequestAnimationFrame.tick()
      expect(spy).toHaveBeenCalled()
    })
  })

  describe('cancelImmediate()', () => {
    it('cancels an immediate cakk which was created with immediate()', () => {
      var spy = jasmine.createSpy('tester')

      const id = Animator.immediate(spy)
      Animator.cancelImmediate(id)

      expect(spy).not.toHaveBeenCalled()
      jasmine.RequestAnimationFrame.tick()
      expect(spy).not.toHaveBeenCalled()
    })
  })

  describe('callback errors', () => {
    const callbackTypes = {
      timeout: (callback) => Animator.timeout(callback),
      frame: (callback) => Animator.frame(callback),
      immediate: (callback) => Animator.immediate(callback)
    }

    for (const [type, schedule] of Object.entries(callbackTypes)) {
      it(`continues scheduled work after a ${type} callback throws`, () => {
        const laterCallback = jasmine.createSpy('later callback')

        schedule(() => {
          schedule(laterCallback)
          throw new Error(`${type} failed`)
        })

        expect(() => jasmine.RequestAnimationFrame.tick()).toThrowError(
          `${type} failed`
        )
        expect(laterCallback).not.toHaveBeenCalled()

        jasmine.RequestAnimationFrame.tick()
        expect(laterCallback).toHaveBeenCalled()
      })
    }

    it('keeps timeout, frame, and immediate callback ordering', () => {
      const order = []

      Animator.timeout(() => order.push('timeout'))
      Animator.frame(() => order.push('frame'))
      Animator.immediate(() => order.push('immediate'))

      jasmine.RequestAnimationFrame.tick()
      expect(order).toEqual(['timeout', 'frame', 'immediate'])
    })
  })
})
