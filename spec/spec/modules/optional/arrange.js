/* globals describe, expect, it */

import { G, Line } from '../../../../src/main.js'

describe('arrange.js', () => {
  describe('Dom', () => {
    describe('siblings()', () => {
      it('returns all siblings including the node itself', () => {
        const g = new G()
        const rect = g.rect(100, 100)
        const circle = g.circle(100)
        const line = g.line(1, 2, 3, 4)

        expect(circle.siblings()).toEqual([rect, circle, line])
      })
    })

    describe('position()', () => {
      it('returns the position in the parent', () => {
        const g = new G()
        const rect = g.rect(100, 100)
        const circle = g.circle(100)
        const line = g.line(1, 2, 3, 4)

        expect(rect.position()).toBe(0)
        expect(circle.position()).toBe(1)
        expect(line.position()).toBe(2)
      })
    })

    describe('next()', () => {
      it('returns the next sibling', () => {
        const g = new G()
        const rect = g.rect(100, 100)
        const circle = g.circle(100)

        expect(rect.next()).toBe(circle)
      })

      it('returns undefined if there is no sibling', () => {
        const g = new G()
        const rect = g.rect(100, 100)

        expect(rect.next()).toBe(undefined)
      })
    })

    describe('prev()', () => {
      it('returns the next sibling', () => {
        const g = new G()
        const rect = g.rect(100, 100)
        const circle = g.circle(100)

        expect(circle.prev()).toBe(rect)
      })

      it('returns undefined if there is no sibling', () => {
        const g = new G()
        const rect = g.rect(100, 100)

        expect(rect.prev()).toBe(undefined)
      })
    })

    describe('forward()', () => {
      it('returns itself', () => {
        const g = new G()
        const rect = g.rect(100, 100)
        expect(rect.forward()).toBe(rect)
      })

      it('moves an element one step forward', () => {
        const g = new G()
        const rect = g.rect(100, 100)
        const circle = g.circle(100)
        const line = g.line(1, 2, 3, 4)

        rect.forward()

        expect(g.children()).toEqual([circle, rect, line])
      })

      it('does nothing when the element is already the last one', () => {
        const g = new G()
        const rect = g.rect(100, 100)
        const circle = g.circle(100)
        const line = g.line(1, 2, 3, 4)

        line.forward()

        expect(g.children()).toEqual([rect, circle, line])
      })
    })

    describe('backward()', () => {
      it('returns itself', () => {
        const g = new G()
        const rect = g.rect(100, 100)
        expect(rect.backward()).toBe(rect)
      })

      it('moves an element one step backward', () => {
        const g = new G()
        const rect = g.rect(100, 100)
        const circle = g.circle(100)
        const line = g.line(1, 2, 3, 4)

        line.backward()

        expect(g.children()).toEqual([rect, line, circle])
      })

      it('does nothing when the element is already the first one', () => {
        const g = new G()
        const rect = g.rect(100, 100)
        const circle = g.circle(100)
        const line = g.line(1, 2, 3, 4)

        rect.backward()

        expect(g.children()).toEqual([rect, circle, line])
      })
    })

    describe('front()', () => {
      it('returns itself', () => {
        const g = new G()
        const rect = g.rect(100, 100)
        expect(rect.front()).toBe(rect)
      })

      it('moves an element to the front', () => {
        const g = new G()
        const rect = g.rect(100, 100)
        const circle = g.circle(100)
        const line = g.line(1, 2, 3, 4)

        rect.front()

        expect(g.children()).toEqual([circle, line, rect])
      })

      it('does nothing when the element is already the last one', () => {
        const g = new G()
        const rect = g.rect(100, 100)
        const circle = g.circle(100)
        const line = g.line(1, 2, 3, 4)

        line.front()

        expect(g.children()).toEqual([rect, circle, line])
      })
    })

    describe('back()', () => {
      it('returns itself', () => {
        const g = new G()
        const rect = g.rect(100, 100)
        expect(rect.back()).toBe(rect)
      })

      it('moves an element to the back', () => {
        const g = new G()
        const rect = g.rect(100, 100)
        const circle = g.circle(100)
        const line = g.line(1, 2, 3, 4)

        line.back()

        expect(g.children()).toEqual([line, rect, circle])
      })

      it('does nothing when the element is already the first one', () => {
        const g = new G()
        const rect = g.rect(100, 100)
        const circle = g.circle(100)
        const line = g.line(1, 2, 3, 4)

        rect.back()

        expect(g.children()).toEqual([rect, circle, line])
      })
    })

    describe('before()', () => {
      it('inserts an element before this one', () => {
        const g = new G()
        const rect = g.rect(100, 100)
        const circle = g.circle(100)

        const line = new Line()
        circle.before(line)

        expect(g.children()).toEqual([rect, line, circle])
      })
    })

    describe('after()', () => {
      it('inserts an element after this one', () => {
        const g = new G()
        const rect = g.rect(100, 100)
        const circle = g.circle(100)

        const line = new Line()
        rect.after(line)

        expect(g.children()).toEqual([rect, line, circle])
      })
    })

    describe('insertBefore()', () => {
      it('inserts the current element before another one', () => {
        const g = new G()
        const rect = g.rect(100, 100)
        const circle = g.circle(100)

        const line = new Line().insertBefore(circle)

        expect(g.children()).toEqual([rect, line, circle])
      })
    })

    describe('insertAfter()', () => {
      it('inserts the current element after another one', () => {
        const g = new G()
        const rect = g.rect(100, 100)
        const circle = g.circle(100)

        const line = new Line().insertAfter(rect)

        expect(g.children()).toEqual([rect, line, circle])
      })
    })
  })
})
