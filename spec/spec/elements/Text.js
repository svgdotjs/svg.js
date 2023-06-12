/* globals describe, expect, it, spyOn jasmine, container */

import {
  Text,
  Number as SVGNumber,
  SVG,
  G,
  Path,
  TextPath
} from '../../../src/main.js'

const { any } = jasmine

describe('Text.js', () => {
  describe('()', () => {
    it('creates a new object of type Text', () => {
      expect(new Text()).toEqual(any(Text))
    })

    it('sets passed attributes on the element', () => {
      expect(new Text({ id: 'foo' }).id()).toBe('foo')
    })
  })

  describe('text()', () => {
    it('sets the text content of the tspan and returns itself', () => {
      const text = new Text()
      expect(text.text('Hello World')).toBe(text)
      expect(text.node.textContent).toBe('Hello World')
    })

    it('creates tspans for every line', () => {
      const text = new Text().text('Hello World\nHow is it\ngoing')
      expect(text.children().length).toBe(3)
      expect(text.get(0).node.textContent).toBe('Hello World')
      expect(text.get(1).node.textContent).toBe('How is it')
      expect(text.get(2).node.textContent).toBe('going')
    })

    it('increases dy after empty line', () => {
      const canvas = SVG().addTo(container)
      const text = canvas.text('Hello World\n\nHow is it\ngoing')
      expect(text.children().length).toBe(4)
      expect(text.get(0).node.textContent).toBe('Hello World')
      expect(text.get(1).node.textContent).toBe('')
      expect(text.get(2).node.textContent).toBe('How is it')
      expect(text.get(3).node.textContent).toBe('going')
      expect(text.get(2).dy()).toBe(text.get(3).dy() * 2)
    })

    it('returns the correct text with newlines', () => {
      const text = new Text().text('Hello World\nHow is it\ngoing')
      expect(text.text()).toBe('Hello World\nHow is it\ngoing')
    })

    it('returns the correct text with newlines and skips textPaths', () => {
      const path = new Path()
      const text = new Text()
      const textPath = text.text('Hello World\nHow is it\ngoing').path(path)
      textPath.children().addTo(text)
      text.add(new TextPath(), 3)
      expect(text.text()).toBe('Hello World\nHow is it\ngoing')
    })

    it('executes passed block', () => {
      const text = new Text()
      text.text(function (t) {
        t.tspan('Hello World').newLine()
        t.tspan('How is it').newLine()
        t.tspan('going').newLine()
        expect(this).toBe(text)
        expect(t).toBe(text)
      })
      expect(text.text()).toBe('Hello World\nHow is it\ngoing')
    })

    it('triggers rebuild', () => {
      const text = new Text()
      const spy = spyOn(text, 'rebuild')
      text.text('foo')
      expect(spy).toHaveBeenCalled()
    })
  })

  describe('leading()', () => {
    it('returns the leading value of the text without an argument', () => {
      const text = new Text()
      expect(text.leading() instanceof SVGNumber)
      expect(text.leading().valueOf()).toBe(1.3)
    })

    it('sets the leading value of the text with the first argument', () => {
      const text = new Text()
      expect(text.leading(1.5).dom.leading.valueOf()).toBe(1.5)
    })
  })

  describe('rebuild()', () => {
    it('disables the rebuild if called with false', () => {
      const text = new Text()
      expect(text.rebuild(false)._rebuild).toBeFalse()
    })

    it('enables the rebuild if called with true', () => {
      const text = new Text()
      expect(text.rebuild(true)._rebuild).toBeTrue()
    })

    it('rebuilds the text without an argument given', () => {
      const canvas = SVG().addTo(container)
      const text = new Text().addTo(canvas)
      text.text((t) => {
        t.tspan('Hello World').newLine()
        t.tspan('How is it').newLine()
        t.tspan('going').newLine()
      })

      const dy = text.get(1).dy()
      text.leading(1.7)
      expect(dy).not.toBe(text.get(1).dy())
    })
  })

  describe('setData()', () => {
    it('read all data from the svgjs:data attribute and assign it to el.dom', () => {
      const text = new Text()
      text.attr('svgjs:data', '{"foo":"bar","leading":"3px"}')
      text.setData(JSON.parse(text.attr('svgjs:data')))

      expect(text.dom.foo).toBe('bar')
      expect(text.dom.leading instanceof SVGNumber).toBeTruthy()
      expect(text.dom.leading.value).toBe(3)
      expect(text.dom.leading.unit).toBe('px')
    })

    it('uses a leading of 1.3 when no leading is set or 0', () => {
      const text = new Text()
      text.setData({ leading: 0 })

      expect(text.dom.leading.value).toBe(1.3)
    })
  })

  describe('Container', () => {
    describe('text()', () => {
      it('creates a text element with lines', () => {
        const group = new G()
        const text = group.text('Hello World\nHow is it\ngoing')
        expect(text).toEqual(any(Text))
        expect(text.text()).toBe('Hello World\nHow is it\ngoing')
      })

      it('defaults to empty string', () => {
        const group = new G()
        const text = group.text()
        expect(text).toEqual(any(Text))
        expect(text.text()).toBe('')
      })
    })

    describe('plain()', () => {
      it('creates plain text', () => {
        const group = new G()
        const text = group.plain('A piece')
        expect(text).toEqual(any(Text))
        expect(text.node.childNodes[0].data).toBe('A piece')
      })

      it('defaults to empty string', () => {
        const group = new G()
        const text = group.plain()
        expect(text).toEqual(any(Text))
        expect(text.node.childNodes[0].data).toBe('')
      })
    })
  })
})
