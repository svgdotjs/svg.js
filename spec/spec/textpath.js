describe('TextPath', function() {
  var text
    , path
    , txt = 'We go up, then we go down, then up again'
    , data = 'M 100 200 C 200 100 300  0 400 100 C 500 200 600 300 700 200 C 800 100 900 100 900 100'

  beforeEach(function() {
    text = draw.text(txt)
    path = draw.path(data)
  })

  afterEach(function() {
    draw.clear()
  })

  describe('text().path()', function() {
    it('returns an instance of TextPath', function() {
      expect(text.path(data) instanceof SVG.TextPath).toBe(true)
    })
    it('creates a textPath node in the text element', function() {
      text.path(data)
      expect(text.node.querySelector('textPath')).not.toBe(null)
    })
  })

  describe('path().text()', function() {
    it('returns an instance of TextPath', function() {
      expect(path.text(txt) instanceof SVG.TextPath).toBe(true)
    })
    it('creates a text with textPath node and inserts it after the path', function() {
      var instance = path.text(txt)
      expect(instance.parent() instanceof SVG.Text).toBe(true)
      expect(SVG.adopt(path.node.nextSibling) instanceof SVG.Text).toBe(true)
    })
  })

  describe('textPath()', function() {
    it('returns all textPath elements in a text', function() {
      text.path(data)
      expect(text.textPath().length).toBe(1)
      expect(text.textPath()[0] instanceof SVG.TextPath).toBe(true)
    })
  })

  describe('track()', function() {
    it('returns the referenced path instance', function() {
      expect(text.path(data).track() instanceof SVG.Path).toBe(true)
    })
  })

  describe('array()', function() {
    it('return the path array of the underlying path', function() {
      expect(text.path(data).array()).toEqual(new SVG.PathArray(data))
    })
    it('return null if there is no underlying path', function () {
      expect(text.path(data).attr('href', null, SVG.xlink).array()).toBe(null)
    })
  })

  describe('plot()', function() {
    it('change the array of the underlying path when a string is passed', function() {
      expect(text.path().plot(data).array()).toEqual(new SVG.PathArray(data))
    })
    it('return the path array of the underlying path when no arguments is passed', function () {
      var textPath = text.path(data)
      expect(textPath.plot()).toBe(textPath.array())
      expect(textPath.plot()).not.toBe(null)
    })
  })
})
