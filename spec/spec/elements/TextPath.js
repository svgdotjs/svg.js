/* globals describe, expect, it, beforeEach, jasmine, container */

import { Text, SVG, TextPath, Path } from '../../../src/main.js'

const { any } = jasmine

describe('TextPath.js', () => {
  var canvas, text, path
  var txt = 'We go up, then we go down, then up again'
  var data =
    'M 100 200 C 200 100 300  0 400 100 C 500 200 600 300 700 200 C 800 100 900 100 900 100'

  beforeEach(() => {
    canvas = new SVG().addTo(container)
    text = canvas.text(txt)
    path = canvas.path(data)
  })

  describe('()', () => {
    it('creates a new object of type TextPath', () => {
      expect(new TextPath()).toEqual(any(TextPath))
    })

    it('sets passed attributes on the element', () => {
      expect(new TextPath({ id: 'foo' }).id()).toBe('foo')
    })
  })

  describe('track()', () => {
    it('returns the referenced path instance', () => {
      const textPath = text.path(path)
      expect(textPath.track()).toBe(path)
    })
  })

  describe('array()', () => {
    it('returns the path array of the underlying path', () => {
      expect(text.path(path).array()).toEqual(path.array())
    })

    it('returns null if there is no underlying path', () => {
      const textPath = new TextPath()
      expect(textPath.array()).toBe(null)
    })
  })

  describe('plot()', () => {
    it('changes the array of the underlying path', () => {
      expect(text.path().plot(path.array()).array()).toEqual(path.array())
    })

    it('return the path array of the underlying path when no arguments is passed', () => {
      const textPath = text.path(path)
      expect(textPath.plot()).toBe(textPath.array())
      expect(textPath.plot()).not.toBe(null)
    })

    it('does nothing if no path is attached as track', () => {
      const textPath = Object.freeze(new TextPath())
      expect(textPath.plot('M0 0')).toBe(textPath)
    })
  })

  describe('Container', () => {
    describe('textPath()', () => {
      it('creates a textPath from string text and string path', () => {
        const textPath = canvas.textPath(txt, data)
        expect(textPath).toEqual(any(TextPath))
        expect(textPath.parent()).toEqual(any(Text))
        expect(textPath.track()).toEqual(any(Path))
        expect(textPath.track().parent()).toBe(canvas.defs())
      })

      it('creates a textPath from Text and Path', () => {
        const textPath = canvas.textPath(text, path)
        expect(textPath.parent()).toEqual(text)
        expect(textPath.track()).toEqual(path)
      })

      it('passes the text into textPath and not text', () => {
        const tspan = text.first()
        const textPath = canvas.textPath(text, path)
        expect(textPath.first()).toBe(tspan)
        expect(text.first()).toBe(textPath)
      })
    })
  })

  describe('Text', () => {
    describe('path()', () => {
      it('returns an instance of TextPath', () => {
        expect(text.path(data)).toEqual(any(TextPath))
      })

      it('creates a textPath node in the text element', () => {
        text.path(data)
        expect(text.node.querySelector('textPath')).not.toBe(null)
      })

      it('references the passed path', () => {
        const textPath = text.path(path)
        expect(textPath.reference('href')).toBe(path)
      })

      it('imports all nodes from the text by default', () => {
        const children = text.children()
        const textPath = text.path(path)
        expect(textPath.children()).toEqual(children)
      })

      it('does not import all nodes from the text when second parameter false', () => {
        const textPath = text.path(path, false)
        expect(textPath.children()).toEqual([])
      })
    })

    describe('textPath()', () => {
      it('returns the textPath element of this text', () => {
        const textPath = text.path(path)
        expect(text.textPath()).toBe(textPath)
      })
    })
  })

  describe('Path', () => {
    describe('text()', () => {
      it('returns an instance of TextPath', () => {
        expect(path.text(txt)).toEqual(any(TextPath))
      })

      it('creates a text with textPath node and inserts it after the path', () => {
        var textPath = path.text(txt)
        expect(textPath.parent()).toEqual(any(Text))
        expect(SVG(path.node.nextSibling)).toBe(textPath.parent())
      })

      it('transplants the node from text to textPath', () => {
        const nodesInText = [].slice.call(text.node.childNodes)
        var textPath = path.text(text)
        const nodesInTextPath = [].slice.call(textPath.node.childNodes)
        expect(nodesInText).toEqual(nodesInTextPath)
      })
    })

    describe('targets', () => {
      it('returns all elements referencing this path with href', () => {
        const textPath = text.path(path)
        expect(path.targets()).toEqual([textPath])
      })
    })
  })
})
