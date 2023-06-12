/* globals describe, expect, it, beforeEach, spyOn, jasmine, container */

import { Ellipse, SVG } from '../../../../src/main.js'

const { objectContaining } = jasmine

describe('circled.js', () => {
  let element

  beforeEach(() => {
    element = new Ellipse().size(50, 50)
  })

  describe('rx()', () => {
    it('calls attribute with rx and returns itself', () => {
      const spy = spyOn(element, 'attr').and.callThrough()
      expect(element.rx(50)).toBe(element)
      expect(spy).toHaveBeenCalledWith('rx', 50)
    })
  })

  describe('ry()', () => {
    it('calls attribute with ry and returns itself', () => {
      const spy = spyOn(element, 'attr').and.callThrough()
      expect(element.ry(50)).toBe(element)
      expect(spy).toHaveBeenCalledWith('ry', 50)
    })
  })

  describe('x()', () => {
    it('sets x position and returns itself', () => {
      element = SVG().addTo(container).ellipse(50, 50)
      expect(element.x(50)).toBe(element)
      expect(element.bbox().x).toBe(50)
    })

    it('gets the x position', () => {
      element.x(50)
      expect(element.x()).toBe(50)
    })
  })

  describe('y()', () => {
    it('sets y position and returns itself', () => {
      element = SVG().addTo(container).ellipse(50, 50)
      expect(element.y(50)).toBe(element)
      expect(element.bbox().y).toBe(50)
    })

    it('gets the y position', () => {
      element.y(50)
      expect(element.y()).toBe(50)
    })
  })

  describe('cx()', () => {
    it('calls attribute with cx and returns itself', () => {
      const spy = spyOn(element, 'attr').and.callThrough()
      expect(element.cx(50)).toBe(element)
      expect(spy).toHaveBeenCalledWith('cx', 50)
    })
  })

  describe('cy()', () => {
    it('calls attribute with cy and returns itself', () => {
      const spy = spyOn(element, 'attr').and.callThrough()
      expect(element.cy(50)).toBe(element)
      expect(spy).toHaveBeenCalledWith('cy', 50)
    })
  })

  describe('width()', () => {
    it('sets rx by half the given width', () => {
      const spy = spyOn(element, 'rx').and.callThrough()
      expect(element.width(50)).toBe(element)
      expect(spy).toHaveBeenCalledWith(objectContaining({ value: 25 }))
    })

    it('gets the width of the element', () => {
      element.width(100)
      expect(element.width()).toBe(100)
    })
  })

  describe('height()', () => {
    it('sets ry by half the given height', () => {
      const spy = spyOn(element, 'ry').and.callThrough()
      expect(element.height(50)).toBe(element)
      expect(spy).toHaveBeenCalledWith(objectContaining({ value: 25 }))
    })

    it('gets the height of the element', () => {
      element.height(100)
      expect(element.height()).toBe(100)
    })
  })
})
