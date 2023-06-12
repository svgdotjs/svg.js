/* globals describe, expect, it, beforeEach, spyOn, jasmine */

import { Element, create, Text } from '../../../../src/main.js'
import { registerAttrHook } from '../../../../src/modules/core/attr.js'

const { objectContaining } = jasmine

describe('attr.js', () => {
  describe('attr()', () => {
    let element

    beforeEach(() => {
      element = new Element(create('rect'))
    })

    it('returns itself as setter', () => {
      expect(element.attr('fill', '#ff0066')).toBe(element)
    })

    it('sets one attribute when two arguments are given', () => {
      element.attr('fill', '#ff0066')
      expect(element.node.getAttribute('fill')).toBe('#ff0066')
    })

    it('sets various attributes when an object is given', () => {
      element.attr({ fill: '#00ff66', stroke: '#ff2233', 'stroke-width': 10 })
      expect(element.node.getAttribute('fill')).toBe('#00ff66')
      expect(element.node.getAttribute('stroke')).toBe('#ff2233')
      expect(element.node.getAttribute('stroke-width')).toBe('10')
    })

    it('gets the value of the string value given as first argument', () => {
      element.attr('fill', '#ff0066')
      expect(element.attr('fill')).toEqual('#ff0066')
    })

    it('gets an object with all attributes without any arguments', () => {
      element.attr({ fill: '#00ff66', stroke: '#ff2233' })
      var attr = element.attr()
      expect(attr.fill).toBe('#00ff66')
      expect(attr.stroke).toBe('#ff2233')
    })

    it('removes an attribute if the second argument is explicitly set to null', () => {
      element.attr('stroke-width', 10)
      expect(element.node.getAttribute('stroke-width')).toBe('10')
      element.attr('stroke-width', null)
      expect(element.node.getAttribute('stroke-width')).toBe(null)
    })

    it('correctly parses numeric values as a getter', () => {
      element.attr('stroke-width', 11)
      expect(element.node.getAttribute('stroke-width')).toBe('11')
      expect(element.attr('stroke-width')).toBe(11)
    })

    it('correctly parses negative numeric values as a getter', () => {
      element.attr('x', -120)
      expect(element.node.getAttribute('x')).toBe('-120')
      expect(element.attr('x')).toBe(-120)
    })

    it('falls back on default values if attribute is not present', () => {
      expect(element.attr('stroke-linejoin')).toBe('miter')
    })

    it('gets the "style" attribute as a string', () => {
      element.css('cursor', 'pointer')
      expect(element.attr('style')).toBe('cursor: pointer;')
    })

    it('sets the style attribute correctly', () => {
      element.attr('style', 'cursor:move;')
      expect(element.node.style.cursor).toBe('move')
    })

    it('acts as getter for an array of values passed', () => {
      element.attr({
        x: 1,
        y: 2,
        width: 20,
        'fill-opacity': 0.5
      })

      const ret = element.attr(['x', 'fill-opacity'])

      expect(ret).toEqual({ x: 1, 'fill-opacity': 0.5 })
    })

    it('correctly creates SVG.Array if array given', () => {
      element.attr('something', [2, 3, 4])
      expect(element.attr('something')).toBe('2 3 4')
    })

    it('redirects to the leading() method when setting leading', () => {
      const text = new Text().text('Hello World')
      const spy = spyOn(text, 'leading')

      text.attr('leading', 2)
      expect(spy).toHaveBeenCalledWith(objectContaining({ value: 2 }))
    })

    it('ignores leading if no leading method is available', () => {
      const frozen = Object.freeze(element)
      expect(frozen.attr('leading', 2)).toBe(frozen)
    })

    it('executes registered hooks', () => {
      registerAttrHook((attr, val, el) => {
        if (el.node.id === 'somethingVeryRandom' && attr === 'name') {
          throw new Error('This hook should only be executed in one test')
        }
        return val
      })

      element.id('somethingVeryRandom')

      const throwingFn = () => {
        element.attr('name', 'Bob')
      }

      expect(throwingFn).toThrowError(
        'This hook should only be executed in one test'
      )
    })
  })
})
