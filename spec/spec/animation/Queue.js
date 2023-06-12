/* globals describe, expect, it */

import { Queue } from '../../../src/main.js'

describe('Queue.js', function () {
  describe('first ()', function () {
    it('returns null if no item in the queue', function () {
      var queue = new Queue()
      expect(queue.first()).toEqual(null)
    })

    it('returns the first value in the queue', function () {
      var queue = new Queue()
      queue.push(1)
      expect(queue.first()).toBe(1)
      queue.push(2)
      expect(queue.first()).toBe(1)
    })
  })

  describe('last ()', function () {
    it('returns null if no item in the queue', function () {
      var queue = new Queue()
      expect(queue.last()).toEqual(null)
    })

    it('returns the last value added', function () {
      var queue = new Queue()
      queue.push(1)
      expect(queue.last()).toBe(1)
      queue.push(2)
      expect(queue.last()).toBe(2)
    })
  })

  describe('push ()', function () {
    it('adds an element to the end of the queue', function () {
      var queue = new Queue()
      queue.push(1)
      queue.push(2)
      queue.push(3)

      expect(queue.first()).toBe(1)
      expect(queue.last()).toBe(3)
    })

    it('adds an item to the end of the queue', function () {
      var queue = new Queue()
      queue.push(1)
      const item = queue.push(2)
      queue.push(3)
      queue.remove(item)
      queue.push(item)

      expect(queue.first()).toBe(1)
      expect(queue.last()).toBe(2)
    })
  })

  describe('remove ()', function () {
    it('removes the given item from the queue', function () {
      var queue = new Queue()
      queue.push(1)
      queue.push(2)
      var item = queue.push(3)

      queue.remove(item)

      expect(queue.last()).toBe(2)
      expect(queue.first()).toBe(1)
    })

    it('removes the given item from the queue', function () {
      var queue = new Queue()
      var item = queue.push(1)
      queue.push(2)
      queue.push(3)

      queue.remove(item)

      expect(queue.last()).toBe(3)
      expect(queue.first()).toBe(2)
    })
  })

  describe('shift ()', function () {
    it('returns nothing if queue is empty', function () {
      var queue = new Queue()
      var val = queue.shift()
      expect(val).toBeFalsy()
    })

    it('returns the first item of the queue and removes it', function () {
      var queue = new Queue()
      queue.push(1)
      queue.push(2)
      queue.push(3)

      var val = queue.shift()

      expect(queue.last()).toBe(3)
      expect(queue.first()).toBe(2)

      expect(val).toBe(1)
    })
  })
})
