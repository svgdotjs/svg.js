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
})
