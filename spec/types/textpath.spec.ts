import * as SVGJS from '@svgdotjs/svg.js'
import * as helpers from './helpers'

describe('TextPath', function () {
  var text: SVGJS.Text
    , path: SVGJS.Path
    , txt = 'We go up, then we go down, then up again'
    , data = 'M 100 200 C 200 100 300  0 400 100 C 500 200 600 300 700 200 C 800 100 900 100 900 100'

  beforeEach(function () {
    text = helpers.draw.text(txt)
    path = helpers.draw.path(data)
  })

  afterEach(function () {
    helpers.draw.clear()
  })

  describe('textPath()', function () {
    it('creates a new textPath and uses text and path', function () {
      expect(helpers.draw.textPath(txt, data)).toEqual(jasmine.any(SVGJS.TextPath))
    })

    it('reuses text and path instances if possible', function () {
      const textPath = helpers.draw.textPath(text, path)
      expect(text.find('textPath')[0]).toBe(textPath)
      expect(textPath.reference('href')).toBe(path)
    })

    it('passes the text into textPath and not text', function () {
      const tspan = text.first()
      const textPath = helpers.draw.textPath(text, path)
      expect(textPath.first()).toBe(tspan)
      expect(text.first()).toBe(textPath)
    })
  })

  describe('text().path()', function () {
    it('returns an instance of TextPath', function () {
      expect(text.path(data) instanceof SVGJS.TextPath).toBe(true)
    })
    it('creates a textPath node in the text element', function () {
      text.path(data)
      expect(text.node.querySelector('textPath')).not.toBe(null)
    })
    it('references the passed path', function () {
      const textPath = text.path(path)
      expect(textPath.reference('href')).toBe(path)
    })
  })

  describe('path().text()', function () {
    it('returns an instance of TextPath', function () {
      expect(path.text(txt) instanceof SVGJS.TextPath).toBe(true)
    })
    it('creates a text with textPath node and inserts it after the path', function () {
      var textPath = path.text(txt)
      expect(textPath.parent() instanceof SVGJS.Text).toBe(true)
      expect(SVGJS.adopt((path.node as any).nextSibling) instanceof SVGJS.Text).toBe(true)
    })
    it('transplants the node from text to textPath', function () {
      let nodesInText = [].slice.call(text.node.childNodes)
      var textPath = path.text(txt)
      let nodesInTextPath = [].slice.call(textPath.node.childNodes)
      expect(nodesInText).toEqual(nodesInTextPath)
    })
  })

  describe('text.textPath()', function () {
    it('returns only the first textPath element in a text', function () {
      text.path(data)
      expect(text.textPath() instanceof SVGJS.TextPath).toBe(true)
    })
  })

  describe('track()', function () {
    it('returns the referenced path instance', function () {
      expect(text.path(data).track() instanceof SVGJS.Path).toBe(true)
    })
  })

  describe('array()', function () {
    it('return the path array of the underlying path', function () {
      expect(text.path(data).array()).toEqual(new SVGJS.PathArray(data))
    })
    it('return null if there is no underlying path', function () {
      expect(text.path(data).attr('href', null, SVGJS.namespaces.xlink).array()).toBe(null)
    })
  })

  describe('plot()', function () {
    it('change the array of the underlying path when a string is passed', function () {
      expect(text.path().plot(data).array()).toEqual(new SVGJS.PathArray(data))
    })
    it('return the path array of the underlying path when no arguments is passed', function () {
      var textPath = text.path(data)
      expect(textPath.plot()).toBe(textPath.array())
      expect(textPath.plot()).not.toBe(null)
    })
  })
})
