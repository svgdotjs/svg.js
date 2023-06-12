/* globals describe, expect, it, beforeEach, spyOn, container */

import { SVG, Box, Tspan } from '../../../../src/main.js'

describe('textable.js', () => {
  var canvas, text, tspan

  beforeEach(() => {
    canvas = SVG().addTo(container)
    text = canvas.text('Hello World\nIn two lines')
    tspan = text.get(0)
  })

  describe('x()', () => {
    it('returns the value of x without an argument on a text', () => {
      expect(text.x(0).x()).toBe(0)
    })

    it('sets the x value of the bbox with the first argument on a text', () => {
      text.x(123)
      expect(text.bbox().x).toBe(123)
    })

    it('sets the value of all lines', () => {
      text.x(200)
      text.each(function () {
        expect(this.x()).toBe(text.x())
      })
    })

    it('returns the value of x without an argument on a tspan', () => {
      expect(tspan.x(10).x()).toBe(10)
    })

    it('sets the x value of the bbox with the first argument on a tspan', () => {
      tspan.x(123)
      expect(tspan.bbox().x).toBe(123)
    })
  })

  describe('y()', () => {
    it('returns the value of y without an argument on a text', () => {
      expect(text.y(0).y()).toBe(0)
    })

    it('sets the y value of the bbox with the first argument on a text', () => {
      text.y(123)
      expect(text.bbox().y).toBe(123)
    })

    it('sets the y position of first line', () => {
      text.y(200)
      expect(text.first().y()).toBe(text.y())
    })

    it('returns the value of y without an argument on a tspan', () => {
      expect(tspan.y(10).y()).toBe(10)
    })

    it('sets the y value of the bbox with the first argument on a tspan', () => {
      tspan.y(123)
      expect(tspan.bbox().y).toBe(123)
    })
  })

  describe('move()', () => {
    it('calls x() and y() with parameters on text', () => {
      const spyX = spyOn(text, 'x').and.callThrough()
      const spyY = spyOn(text, 'y').and.callThrough()
      const box = new Box()
      text.move(1, 2, box)
      expect(spyX).toHaveBeenCalledWith(1, box)
      expect(spyY).toHaveBeenCalledWith(2, box)
    })

    it('calls x() and y() with parameters on tspan', () => {
      const spyX = spyOn(tspan, 'x').and.callThrough()
      const spyY = spyOn(tspan, 'y').and.callThrough()
      const box = new Box()
      tspan.move(1, 2, box)
      expect(spyX).toHaveBeenCalledWith(1, box)
      expect(spyY).toHaveBeenCalledWith(2, box)
    })
  })

  describe('ax()', () => {
    it('sets the value of x with a percent value with Text', () => {
      text.ax('40%')
      expect(text.node.getAttribute('x')).toBe('40%')
    })

    it('returns the value of x when x is a percentual value with Text', () => {
      expect(text.ax('40%').ax()).toBe('40%')
    })

    it('sets the value of x with a percent value with Tspan', () => {
      tspan.ax('40%')
      expect(tspan.node.getAttribute('x')).toBe('40%')
    })

    it('returns the value of x when x is a percentual value with Tspan', () => {
      tspan.ax('40%')
      expect(tspan.ax()).toBe('40%')
    })
  })

  describe('ay()', () => {
    it('sets the value of y with a percent value with Text', () => {
      text.ay('40%')
      expect(text.node.getAttribute('y')).toBe('40%')
    })

    it('returns the value of y when y is a percentual value with Tspan', () => {
      expect(text.ay('45%').ay()).toBe('45%')
    })

    it('sets the value of y with a percent value with Text', () => {
      tspan.ay('40%')
      expect(tspan.node.getAttribute('y')).toBe('40%')
    })

    it('returns the value of y when y is a percentual value with Tspan', () => {
      tspan.ay('40%')
      expect(tspan.ay()).toBe('40%')
    })
  })

  describe('move()', () => {
    it('calls ax() and ay() with parameters on text', () => {
      const spyX = spyOn(text, 'ax').and.callThrough()
      const spyY = spyOn(text, 'ay').and.callThrough()
      text.amove(1, 2)
      expect(spyX).toHaveBeenCalledWith(1)
      expect(spyY).toHaveBeenCalledWith(2)
    })

    it('calls ax() and ay() with parameters on tspan', () => {
      const spyX = spyOn(tspan, 'ax').and.callThrough()
      const spyY = spyOn(tspan, 'ay').and.callThrough()
      tspan.amove(1, 2)
      expect(spyX).toHaveBeenCalledWith(1)
      expect(spyY).toHaveBeenCalledWith(2)
    })
  })

  // this is a hackish. It should not be neccessary to use toBeCloseTo but bbox with text is a thing...
  describe('cx()', () => {
    it('returns the value of cx without an argument with Text', () => {
      var box = text.bbox()
      expect(text.cx()).toBeCloseTo(box.x + box.width / 2)
    })

    it('sets the value of cx with the first argument with Text', () => {
      text.cx(123)
      var box = text.bbox()
      expect(box.cx).toBeCloseTo(box.x + box.width / 2)
    })

    it('returns the value of cx without an argument with Tspan', () => {
      var box = tspan.bbox()
      expect(tspan.cx()).toBeCloseTo(box.x + box.width / 2)
    })

    it('sets the value of cx with the first argument with Tspan', () => {
      tspan.cx(123)
      var box = tspan.bbox()
      expect(box.cx).toBeCloseTo(box.x + box.width / 2)
    })
  })

  describe('cy()', () => {
    it('returns the value of cy without an argument with Tspan', () => {
      var box = tspan.bbox()
      expect(tspan.cy()).toBe(box.cy)
    })

    it('sets the value of cy with the first argument with Tspan', () => {
      tspan.cy(345)
      var box = tspan.bbox()
      expect(Math.round(box.cy * 10) / 10).toBe(345)
    })

    it('returns the value of cy without an argument with Tspan', () => {
      var box = tspan.bbox()
      expect(tspan.cy()).toBe(box.cy)
    })

    it('sets the value of cy with the first argument with Tspan', () => {
      tspan.cy(345)
      var box = tspan.bbox()
      expect(Math.round(box.cy * 10) / 10).toBe(345)
    })
  })

  describe('center()', () => {
    it('calls cx() and cy() with parameters on Text', () => {
      const spyX = spyOn(text, 'cx').and.callThrough()
      const spyY = spyOn(text, 'cy').and.callThrough()
      const box = new Box()
      text.center(1, 2, box)
      expect(spyX).toHaveBeenCalledWith(1, box)
      expect(spyY).toHaveBeenCalledWith(2, box)
    })

    it('calls cx() and cy() with parameters on Tspan', () => {
      const spyX = spyOn(tspan, 'cx').and.callThrough()
      const spyY = spyOn(tspan, 'cy').and.callThrough()
      const box = new Box()
      tspan.center(1, 2, box)
      expect(spyX).toHaveBeenCalledWith(1, box)
      expect(spyY).toHaveBeenCalledWith(2, box)
    })
  })

  describe('plain()', () => {
    it('adds content without a tspan with Text', () => {
      text.plain('It is a bear!')
      expect(text.node.childNodes[0].nodeType).toBe(3)
      expect(text.node.childNodes[0].data).toBe('It is a bear!')
    })

    it('clears content before adding new content with Text', () => {
      text.plain('It is not a bear!')
      expect(text.node.childNodes.length).toBe(1)
      expect(text.node.childNodes[0].data).toBe('It is not a bear!')
    })

    it('restores the content from the dom with Text', () => {
      text.plain('Just plain text!')
      expect(text.text()).toBe('Just plain text!')
    })

    it('adds content without a tspan with Tspan', () => {
      tspan.plain('It is a bear!')
      expect(tspan.node.childNodes[0].nodeType).toBe(3)
      expect(tspan.node.childNodes[0].data).toBe('It is a bear!')
    })

    it('clears content before adding new content with Tspan', () => {
      tspan.plain('It is not a bear!')
      expect(tspan.node.childNodes.length).toBe(1)
      expect(tspan.node.childNodes[0].data).toBe('It is not a bear!')
    })

    it('restores the content from the dom with Tspan', () => {
      // We create a new Tspan here because the one used before was part of text creation
      // and therefore is marked as newline and that is not what we want to test
      const tspan = new Tspan().plain('Just plain text!')
      expect(tspan.text()).toBe('Just plain text!')
    })
  })

  describe('length()', () => {
    it('gets total length of text', () => {
      text.text(function (add) {
        add.tspan('The first.')
        add.tspan('The second.')
        add.tspan('The third.')
      })
      expect(text.length()).toBeCloseTo(
        text.get(0).length() + text.get(1).length() + text.get(2).length(),
        3
      )
    })

    it('gets total length of tspan', () => {
      tspan.text(function (add) {
        add.tspan('The first.')
        add.tspan('The second.')
        add.tspan('The third.')
      })
      expect(tspan.length()).toBeCloseTo(
        tspan.get(0).length() + tspan.get(1).length() + tspan.get(2).length(),
        3
      )
    })
  })

  describe('build()', () => {
    it('enables adding multiple plain text nodes when given true for Text', () => {
      text.clear().build(true)
      text.plain('A great piece!')
      text.plain('Another great piece!')
      expect(text.node.childNodes[0].data).toBe('A great piece!')
      expect(text.node.childNodes[1].data).toBe('Another great piece!')
    })

    it('enables adding multiple tspan nodes when given true for Text', () => {
      text.clear().build(true)
      text.tspan('A great piece!')
      text.tspan('Another great piece!')
      expect(text.node.childNodes[0].childNodes[0].data).toBe('A great piece!')
      expect(text.node.childNodes[1].childNodes[0].data).toBe(
        'Another great piece!'
      )
    })

    it('disables adding multiple plain text nodes when given false for Text', () => {
      text.clear().build(true)
      text.plain('A great piece!')
      text.build(false).plain('Another great piece!')
      expect(text.node.childNodes[0].data).toBe('Another great piece!')
      expect(text.node.childNodes[1]).toBe(undefined)
    })

    it('disables adding multiple tspan nodes when given false for Text', () => {
      text.clear().build(true)
      text.tspan('A great piece!')
      text.build(false).tspan('Another great piece!')
      expect(text.node.childNodes[0].childNodes[0].data).toBe(
        'Another great piece!'
      )
      expect(text.node.childNodes[1]).toBe(undefined)
    })

    it('enables adding multiple plain text nodes when given true for Tspan', () => {
      tspan.clear().build(true)
      tspan.plain('A great piece!')
      tspan.plain('Another great piece!')
      expect(tspan.node.childNodes[0].data).toBe('A great piece!')
      expect(tspan.node.childNodes[1].data).toBe('Another great piece!')
    })

    it('enables adding multiple text nodes when given true for Tspan', () => {
      tspan.clear().build(true)
      tspan.tspan('A great piece!')
      tspan.tspan('Another great piece!')
      expect(tspan.node.childNodes[0].childNodes[0].data).toBe('A great piece!')
      expect(tspan.node.childNodes[1].childNodes[0].data).toBe(
        'Another great piece!'
      )
    })

    it('disables adding multiple plain text nodes when given false for Tspan', () => {
      tspan.clear().build(true)
      tspan.plain('A great piece!')
      tspan.build(false).plain('Another great piece!')
      expect(tspan.node.childNodes[0].data).toBe('Another great piece!')
      expect(tspan.node.childNodes[1]).toBe(undefined)
    })

    it('disables adding multiple tspan nodes when given false for Tspan', () => {
      tspan.clear().build(true)
      tspan.tspan('A great piece!')
      tspan.build(false).tspan('Another great piece!')
      expect(tspan.node.childNodes[0].childNodes[0].data).toBe(
        'Another great piece!'
      )
      expect(tspan.node.childNodes[1]).toBe(undefined)
    })
  })
})
