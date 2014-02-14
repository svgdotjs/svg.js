// IMPORTANT!!!
// The native getBBox() on text elements is not accurate to the pixel.
// Therefore some values are treated with the approximately() function.

describe('Text', function() {
  var text
  
  beforeEach(function() {
    text = draw.text(loremIpsum).size(5)
  })
  
  afterEach(function() {
    draw.clear()
  })
  
  describe('x()', function() {
    it('returns the value of x without an argument', function() {
      expect(approximately(text.x())).toBe(approximately(0))
    })
    it('sets the value of x with the first argument', function() {
      text.x(123)
      var box = text.bbox()
      expect(approximately(box.x, 5)).toBe(approximately(123, 5))
    })
    it('sets the value of x based on the anchor with the first argument', function() {
      text.x(123, true)
      var box = text.bbox()
      expect(approximately(box.x, 5)).toBe(approximately(123, 5))
    })
  })
  
  describe('y()', function() {
    it('returns the value of y without an argument', function() {
      expect(text.y()).toBe(0)
    })
    it('sets the value of y with the first argument', function() {
      text.y(345)
      var box = text.bbox()
      expect(approximately(box.y, 5)).toBe(approximately(345, 5))
    })
    it('sets the value of y based on the anchor with the first argument', function() {
      text.y(345, true)
      var box = text.bbox()
      expect(approximately(box.y, 5)).toBe(approximately(345, 5))
    })
  })
  
  describe('cx()', function() {
    it('returns the value of cx without an argument', function() {
      var box = text.bbox()
      expect(approximately(text.cx())).toBe(approximately(box.width / 2))
    })
    it('sets the value of cx with the first argument', function() {
      text.cx(123)
      var box = text.bbox()
      expect(approximately(box.cx, 5)).toBe(approximately(123, 5))
    })
    it('sets the value of cx based on the anchor with the first argument', function() {
      text.cx(123, true)
      var box = text.bbox()
      expect(approximately(box.cx, 5)).toBe(approximately(123, 5))
    })
  })
  
  describe('cy()', function() {
    it('returns the value of cy without an argument', function() {
      var box = text.bbox()
      expect(text.cy()).toBe(box.cy)
    })
    it('sets the value of cy with the first argument', function() {
      text.cy(345)
      var box = text.bbox()
      expect(approximately(box.cy, 5)).toBe(approximately(345, 5))
    })
  })
  
  describe('move()', function() {
    it('sets the x and y position', function() {
      text.move(123,456)
      var box = text.bbox()
      expect(box.x).toBe(123)
      expect(box.y).toBe(456)
    })
  })
  
  describe('center()', function() {
    it('sets the cx and cy position', function() {
      text.center(321,567)
      var box = text.bbox()
      expect(approximately(box.cx, 5)).toBe(approximately(321, 5))
      expect(approximately(box.cy, 6)).toBe(approximately(567, 6))
    })
  })
  
  describe('size()', function() {
    it('should define the width and height of the element', function() {
      text.size(50)
      expect(text.attr('font-size').valueOf()).toBe(50)
    })
  })

  describe('translate()', function() {
    it('sets the translation of an element', function() {
      text.transform({ x: 12, y: 12 })
      expect(text.node.getAttribute('transform')).toBe('translate(12 12)')
    })
  })

  describe('text()', function() {
    it('adds content in a nested tspan', function() {
      text.text('It is a bear!')
      expect(text.node.childNodes[0].nodeType).toBe(1)
      expect(text.node.childNodes[0].childNodes[0].nodeValue).toBe('It is a bear!')
    })
    it('creates multiple lines with a newline separated string', function() {
      text.text('It is\nJUST\na bear!')
      expect(text.node.childNodes.length).toBe(3)
    })
    it('stores a reference to the tspan nodes in a set', function() {
      text.text('It is\nJUST\na bear!')
      expect(text.lines instanceof SVG.Set).toBe(true)
      expect(text.lines.members.length).toBe(3)
    })
    it('stores the text value in the content reference', function() {
      text.text('It is\nJUST\na bear!')
      expect(text.content).toBe('It is\nJUST\na bear!')
    })
    it('gets the given content of a text element without an argument', function() {
      text.text('It is another bear!')
      expect(text.node.childNodes[0].nodeType).toBe(1)
      expect(text.text()).toMatch('It is another bear!')
    })
    it('accepts a block as first arguments', function() {
      text.text(function(add) {
        add.tspan('mastaba')
        add.plain('hut')
      })
      expect(text.node.childNodes[0].nodeType).toBe(1)
      expect(text.node.childNodes[0].childNodes[0].nodeValue).toBe('mastaba')
      expect(text.node.childNodes[1].nodeType).toBe(3)
      expect(text.node.childNodes[1].nodeValue).toBe('hut')
    })
  })

  describe('plain()', function() {
    it('adds content without a tspan', function() {
      text.plain('It is a bear!')
      expect(text.node.childNodes[0].nodeType).toBe(3)
      expect(text.node.childNodes[0].nodeValue).toBe('It is a bear!')
    })
    it('clears content before adding new content', function() {
      text.plain('It is not a bear!')
      expect(text.node.childNodes.length).toBe(1)
      expect(text.node.childNodes[0].nodeValue).toBe('It is not a bear!')
    })
    it('stores the text value in the content reference', function() {
      text.plain('Just plain text!')
      expect(text.content).toBe('Just plain text!')
    })
  })

  describe('tspan()', function() {
    it('adds content in a tspan', function() {
      text.tspan('It is a bear!')
      expect(text.node.childNodes[0].nodeType).toBe(1)
      expect(text.node.childNodes[0].childNodes[0].nodeValue).toBe('It is a bear!')
    })
    it('clears content before adding new content', function() {
      text.tspan('It is not a bear!')
      expect(text.node.childNodes.length).toBe(1)
      expect(text.node.childNodes[0].childNodes[0].nodeValue).toBe('It is not a bear!')
    })
  })

  describe('clear()', function() {
    it('removes all content', function() {
      text.text(function(add) {
        add.tspan('The first.')
        add.tspan('The second.')
        add.tspan('The third.')
      })
      expect(text.node.childNodes.length).toBe(3)
      text.clear()
      expect(text.node.childNodes.length).toBe(0)
    })
    it('initializes a new set for the lines reference', function() {
      var lines = text.lines
      text.clear()
      expect(text.lines instanceof SVG.Set).toBe(true)
      expect(text.lines).not.toBe(lines)
    })
    it('clears the stored content value', function() {
      text.text('Stored locally.')
      expect(text.content).toBe('Stored locally.')
      text.clear()
      expect(text.content).toBe('')
    })
  })
  
  describe('build()', function() {
    it('enables adding multiple plain text nodes when given true', function() {
      text.clear().build(true)
      text.plain('A great piece!')
      text.plain('Another great piece!')
      expect(text.node.childNodes[0].nodeValue).toBe('A great piece!')
      expect(text.node.childNodes[1].nodeValue).toBe('Another great piece!')
    })
    it('enables adding multiple tspan nodes when given true', function() {
      text.clear().build(true)
      text.tspan('A great piece!')
      text.tspan('Another great piece!')
      expect(text.node.childNodes[0].childNodes[0].nodeValue).toBe('A great piece!')
      expect(text.node.childNodes[1].childNodes[0].nodeValue).toBe('Another great piece!')
    })
    it('disables adding multiple plain text nodes when given false', function() {
      text.clear().build(true)
      text.plain('A great piece!')
      text.build(false).plain('Another great piece!')
      expect(text.node.childNodes[0].nodeValue).toBe('Another great piece!')
      expect(text.node.childNodes[1]).toBe(undefined)
    })
    it('disables adding multiple tspan nodes when given false', function() {
      text.clear().build(true)
      text.tspan('A great piece!')
      text.build(false).tspan('Another great piece!')
      expect(text.node.childNodes[0].childNodes[0].nodeValue).toBe('Another great piece!')
      expect(text.node.childNodes[1]).toBe(undefined)
    })
  })
  
})








