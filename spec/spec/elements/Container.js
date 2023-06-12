/* globals describe, expect, it, beforeEach, jasmine, container */

import { Container, create, SVG } from '../../../src/main.js'

const { any } = jasmine

describe('Container.js', () => {
  describe('()', () => {
    it('creates a new object of type Container', () => {
      expect(new Container(create('g'))).toEqual(any(Container))
    })
  })

  let canvas
  let rect1
  let group1
  let rect2
  let circle1
  let group2
  let circle2
  let group3
  let line1
  let line2
  let circle3
  let group4
  let rect3

  beforeEach(() => {
    canvas = SVG().addTo(container)
    rect1 = canvas.rect(100, 100).id('rect1')
    group1 = canvas.group().id('group1')
    rect2 = group1.rect(100, 100).id('rect2')
    circle1 = group1.circle(50).id('circle1')
    group2 = group1.group().id('group2')
    circle2 = group2.circle(50).id('circle2')
    group3 = group2.group().id('group3')
    line1 = group3.line(1, 1, 2, 2).id('line1')
    line2 = group3.line(1, 1, 2, 2).id('line2')
    circle3 = group2.circle(50).id('circle3')
    group4 = canvas.group().id('group4')
    rect3 = group4.rect(100, 100).id('rect3')

    /* should be:
        canvas
          rect1
          group1
            rect2
            circle1
            group2
              circle2
              group3
                line1
                line2
              circle3
          group4
            rect3
      */
  })

  describe('flatten()', () => {
    it('flattens the whole document when called on the root', () => {
      canvas.flatten()

      expect(canvas.children()).toEqual([
        rect1,
        rect2,
        circle1,
        circle2,
        line1,
        line2,
        circle3,
        rect3
      ])
    })

    it('flattens a group and places all children into its parent when called on a group - 1', () => {
      group1.flatten()

      /* now should be:
        canvas
          rect1
          group1
            rect2
            circle1
            circle2
            line1
            line2
            circle3
          group4
            rect3
      */

      expect(canvas.children()).toEqual([rect1, group1, group4])
      expect(group1.children()).toEqual([
        rect2,
        circle1,
        circle2,
        line1,
        line2,
        circle3
      ])
    })

    it('flattens a group and places all children into its parent when called on a group - 2', () => {
      group2.flatten()

      /* now should be:
        canvas
          rect1
          group1
            rect2
            circle1
            group2
              circle2
              line1
              line2
              circle3
          group4
            rect3
      */

      expect(group2.children()).toEqual([circle2, line1, line2, circle3])
    })
  })

  describe('ungroup()', () => {
    it('ungroups a group and inserts all children in the correct order in the parent parent of the group', () => {
      group1.ungroup()

      expect(canvas.children()).toEqual([rect1, rect2, circle1, group2, group4])

      group4.ungroup()

      expect(canvas.children()).toEqual([rect1, rect2, circle1, group2, rect3])
    })

    it('ungroups a group into another group and appends the elements to the other group', () => {
      group1.ungroup(group4)
      expect(group4.children()).toEqual([rect3, rect2, circle1, group2])
    })

    it('ungroups a group into another group at the specified position', () => {
      group2.ungroup(group1, 1)
      expect(group1.children()).toEqual([
        rect2,
        circle2,
        group3,
        circle3,
        circle1
      ])
    })
  })
})
