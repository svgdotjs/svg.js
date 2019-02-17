import * as SVGJS from '@svgdotjs/svg.js'
import * as helpers from './helpers'

describe('Container', function () {

  beforeEach(function () {
    helpers.draw.clear()
  })

  describe('rect()', function () {
    it('should increase children by 1', function () {
      var initial = helpers.draw.children().length
      helpers.draw.rect(100, 100)
      expect(helpers.draw.children().length).toBe(initial + 1)
    })
    it('should create a rect', function () {
      expect(helpers.draw.rect(100, 100).type).toBe('rect')
    })
    it('should create an instance of SVG.Rect', function () {
      expect(helpers.draw.rect(100, 100) instanceof SVGJS.Rect).toBe(true)
    })
    it('should be an instance of SVG.Shape', function () {
      expect(helpers.draw.rect(100, 100) instanceof SVGJS.Shape).toBe(true)
    })
    it('should be an instance of SVG.Element', function () {
      expect(helpers.draw.rect(100, 100) instanceof SVGJS.Element).toBe(true)
    })
  })

  describe('ellipse()', function () {
    it('should increase children by 1', function () {
      var initial = helpers.draw.children().length
      helpers.draw.ellipse(100, 100)
      expect(helpers.draw.children().length).toBe(initial + 1)
    })
    it('should create an ellipse', function () {
      expect(helpers.draw.ellipse(100, 100).type).toBe('ellipse')
    })
    it('should create an instance of SVG.Ellipse', function () {
      expect(helpers.draw.ellipse(100, 100) instanceof SVGJS.Ellipse).toBe(true)
    })
    it('should be an instance of SVG.Shape', function () {
      expect(helpers.draw.ellipse(100, 100) instanceof SVGJS.Shape).toBe(true)
    })
    it('should be an instance of SVG.Element', function () {
      expect(helpers.draw.ellipse(100, 100) instanceof SVGJS.Element).toBe(true)
    })
  })

  describe('circle()', function () {
    it('should increase children by 1', function () {
      var initial = helpers.draw.children().length
      helpers.draw.circle(100)
      expect(helpers.draw.children().length).toBe(initial + 1)
    })
    it('should create an circle', function () {
      expect(helpers.draw.circle(100).type).toBe('circle')
    })
    it('should create an instance of SVG.Circle', function () {
      expect(helpers.draw.circle(100) instanceof SVGJS.Circle).toBe(true)
    })
    it('should be an instance of SVG.Shape', function () {
      expect(helpers.draw.circle(100) instanceof SVGJS.Shape).toBe(true)
    })
    it('should be an instance of SVG.Element', function () {
      expect(helpers.draw.circle(100) instanceof SVGJS.Element).toBe(true)
    })
  })

  describe('line()', function () {
    it('should increase children by 1', function () {
      var initial = helpers.draw.children().length
      helpers.draw.line(0, 100, 100, 0)
      expect(helpers.draw.children().length).toBe(initial + 1)
    })
    it('should create a line', function () {
      expect(helpers.draw.line(0, 100, 100, 0).type).toBe('line')
    })
    it('should create an instance of SVG.Line', function () {
      expect(helpers.draw.line(0, 100, 100, 0) instanceof SVGJS.Line).toBe(true)
    })
    it('should be an instance of SVG.Shape', function () {
      expect(helpers.draw.line(0, 100, 100, 0) instanceof SVGJS.Shape).toBe(true)
    })
    it('should be an instance of SVG.Element', function () {
      expect(helpers.draw.line(0, 100, 100, 0) instanceof SVGJS.Element).toBe(true)
    })
  })

  describe('polyline()', function () {
    it('should increase children by 1', function () {
      var initial = helpers.draw.children().length
      helpers.draw.polyline('0,0 100,0 100,100 0,100')
      expect(helpers.draw.children().length).toBe(initial + 1)
    })
    it('should create a polyline', function () {
      expect(helpers.draw.polyline('0,0 100,0 100,100 0,100').type).toBe('polyline')
    })
    it('should be an instance of SVG.Polyline', function () {
      expect(helpers.draw.polyline('0,0 100,0 100,100 0,100') instanceof SVGJS.Polyline).toBe(true)
    })
    it('should be an instance of SVG.Shape', function () {
      expect(helpers.draw.polyline('0,0 100,0 100,100 0,100') instanceof SVGJS.Shape).toBe(true)
    })
    it('should be an instance of SVG.Element', function () {
      expect(helpers.draw.polyline('0,0 100,0 100,100 0,100') instanceof SVGJS.Element).toBe(true)
    })
  })

  describe('polygon()', function () {
    it('should increase children by 1', function () {
      var initial = helpers.draw.children().length
      helpers.draw.polygon('0,0 100,0 100,100 0,100')
      expect(helpers.draw.children().length).toBe(initial + 1)
    })
    it('should create a polygon', function () {
      expect(helpers.draw.polygon('0,0 100,0 100,100 0,100').type).toBe('polygon')
    })
    it('should be an instance of SVG.Polygon', function () {
      expect(helpers.draw.polygon('0,0 100,0 100,100 0,100') instanceof SVGJS.Polygon).toBe(true)
    })
    it('should be an instance of SVG.Shape', function () {
      expect(helpers.draw.polygon('0,0 100,0 100,100 0,100') instanceof SVGJS.Shape).toBe(true)
    })
    it('should be an instance of SVG.Element', function () {
      expect(helpers.draw.polygon('0,0 100,0 100,100 0,100') instanceof SVGJS.Element).toBe(true)
    })
  })

  describe('path()', function () {
    it('should increase children by 1', function () {
      var initial = helpers.draw.children().length
      helpers.draw.path(helpers.svgPath)
      expect(helpers.draw.children().length).toBe(initial + 1)
    })
    it('should create a path', function () {
      expect(helpers.draw.path(helpers.svgPath).type).toBe('path')
    })
    it('should be an instance of SVG.Path', function () {
      expect(helpers.draw.path(helpers.svgPath) instanceof SVGJS.Path).toBe(true)
    })
    it('should be an instance of SVG.Shape', function () {
      expect(helpers.draw.path(helpers.svgPath) instanceof SVGJS.Shape).toBe(true)
    })
    it('should be an instance of SVG.Element', function () {
      expect(helpers.draw.path(helpers.svgPath) instanceof SVGJS.Element).toBe(true)
    })
  })

  describe('image()', function () {
    it('should increase children by 1', function () {
      var initial = helpers.draw.children().length
      helpers.draw.image(helpers.imageUrl)
      expect(helpers.draw.children().length).toBe(initial + 1)
    })
    it('should create a rect', function () {
      expect(helpers.draw.image(helpers.imageUrl).type).toBe('image')
    })
    it('should create an instance of SVG.Rect', function () {
      expect(helpers.draw.image(helpers.imageUrl) instanceof SVGJS.Image).toBe(true)
    })
    it('should be an instance of SVG.Shape', function () {
      expect(helpers.draw.image(helpers.imageUrl) instanceof SVGJS.Shape).toBe(true)
    })
    it('should be an instance of SVG.Element', function () {
      expect(helpers.draw.image(helpers.imageUrl) instanceof SVGJS.Element).toBe(true)
    })
  })

  describe('text()', function () {
    it('increases children by 1', function () {
      var initial = helpers.draw.children().length
      helpers.draw.text(helpers.loremIpsum)
      expect(helpers.draw.children().length).toBe(initial + 1)
    })
    it('creates a text element', function () {
      expect(helpers.draw.text(helpers.loremIpsum).type).toBe('text')
    })
    it('creates an instance of SVG.Text', function () {
      expect(helpers.draw.text(helpers.loremIpsum) instanceof SVGJS.Text).toBe(true)
    })
    it('is an instance of SVG.Shape', function () {
      expect(helpers.draw.text(helpers.loremIpsum) instanceof SVGJS.Shape).toBe(true)
    })
    it('is an instance of SVG.Element', function () {
      expect(helpers.draw.text(helpers.loremIpsum) instanceof SVGJS.Element).toBe(true)
    })
  })

  describe('plain()', function () {
    it('increases children by 1', function () {
      var initial = helpers.draw.children().length
      helpers.draw.plain(helpers.loremIpsum)
      expect(helpers.draw.children().length).toBe(initial + 1)
    })
    it('creates a plain element', function () {
      expect(helpers.draw.plain(helpers.loremIpsum).type).toBe('text')
    })
    it('creates an instance of SVG.Rect', function () {
      expect(helpers.draw.plain(helpers.loremIpsum) instanceof SVGJS.Text).toBe(true)
    })
    it('is an instance of SVG.Parent', function () {
      expect(helpers.draw.plain(helpers.loremIpsum) instanceof SVGJS.Shape).toBe(true)
    })
    it('is an instance of SVG.Element', function () {
      expect(helpers.draw.plain(helpers.loremIpsum) instanceof SVGJS.Element).toBe(true)
    })
  })

  describe('clear()', function () {
    it('removes all children except the parser if present', function () {
      helpers.draw.rect(100, 100)
      helpers.draw.clear()
      expect(helpers.draw.children().length).toBe(0)
    })
    it('creates a new defs node', function () {
      var oldDefs = helpers.draw.defs()
      helpers.draw.rect(100, 100).maskWith(helpers.draw.circle(100, 100))
      helpers.draw.clear()
      expect(helpers.draw.defs()).not.toBe(oldDefs)
    })
    it('clears all children in the defs node', function () {
      helpers.draw.rect(100, 100).maskWith(helpers.draw.circle(100, 100))
      helpers.draw.clear()
      expect(helpers.draw.defs().children().length).toBe(0)
    })
  })

  describe('each()', function () {
    it('should iterate over all children', function () {
      var children: string[] = []

      helpers.draw.rect(100, 100)
      helpers.draw.ellipse(100, 100)
      helpers.draw.polygon()

      helpers.draw.each(function (index: number, cd: SVGJS.Element[]) {
        children.push(cd[index].type)
      })
      expect(children).toEqual([].concat(['rect', 'ellipse', 'polygon']))
    })
    it('should only include its own children', function () {
      var children: SVGJS.Element[] = []
        , group = helpers.draw.group()

      helpers.draw.rect(100, 200)
      helpers.draw.circle(300)

      group.rect(100, 100)
      group.ellipse(100, 100)
      group.polygon()

      group.each(function (index: number, cd: SVGJS.Element[]) {
        children.push(cd[index])
      })

      expect(children).toEqual(group.children())
    })
    it('should traverse recursively when set to deep', function () {
      var children: SVGJS.Element[] = []
        , group = helpers.draw.group()

      helpers.draw.rect(100, 200)
      helpers.draw.circle(300)

      group.rect(100, 100)
      group.ellipse(100, 100)
      group.polygon()

      helpers.draw.each(function (index: number, cd: SVGJS.Element[]) {
        children.push(cd[index])
      }, true)

      expect(children.length).toEqual(helpers.draw.children().length + group.children().length)
    })
  })

  describe('get()', function () {
    it('gets an element at a given index', function () {
      helpers.draw.clear()
      var rect = helpers.draw.rect(100, 100)
      var circle = helpers.draw.circle(100)
      var line = helpers.draw.line(0, 0, 100, 100)
      expect(helpers.draw.get(0)).toBe(rect)
      expect(helpers.draw.get(1)).toBe(circle)
      expect(helpers.draw.get(2)).toBe(line)
      expect(helpers.draw.get(3)).toBeNull()
    })
  })

  describe('first()', function () {
    it('gets the first child', function () {
      helpers.draw.clear()
      var rect = helpers.draw.rect(100, 100)
      var circle = helpers.draw.circle(100)
      var line = helpers.draw.line(0, 0, 100, 100)
      expect(helpers.draw.first()).toBe(rect)
    })
  })

  describe('last()', function () {
    it('gets the last child', function () {
      helpers.draw.clear()
      var rect = helpers.draw.rect(100, 100)
      var circle = helpers.draw.circle(100)
      var line = helpers.draw.line(0, 0, 100, 100)
      expect(helpers.draw.last()).toBe(line)
    })
  })

  describe('has()', function () {
    it('determines if a given element is a child of the parent', function () {
      var rect = helpers.draw.rect(100, 100)
      var circle = helpers.draw.circle(100)
      var group = helpers.draw.group()
      var line = group.line(0, 0, 100, 100)
      expect(helpers.draw.has(rect)).toBe(true)
      expect(helpers.draw.has(circle)).toBe(true)
      expect(helpers.draw.has(group)).toBe(true)
      expect(helpers.draw.has(line)).toBe(false)
      expect(group.has(line)).toBe(true)
    })
  })

  describe('index()', function () {
    it('determines the index of given element', function () {
      var rect = helpers.draw.rect(100, 100)
      var circle = helpers.draw.circle(100)
      var group = helpers.draw.group()
      var line = group.line(0, 0, 100, 100)
      expect(helpers.draw.index(rect)).toBe(0)
      expect(helpers.draw.index(circle)).toBe(1)
      expect(helpers.draw.index(group)).toBe(2)
      expect(helpers.draw.index(line)).toBe(-1)
      expect(group.index(line)).toBe(0)
    })
  })

  describe('parent()', function () {
    it('returns the parent element instance', function () {
      var rect = helpers.draw.rect(100, 100)
      expect(rect.parent()).toBe((rect.node.parentNode as any).instance)
    })
  })

  describe('add()', function () {
    it('adds element at the end of the parent element when no position given', function () {
      var rect = helpers.draw.rect(100, 100)
      var line = helpers.draw.line(100, 100, 50, 50)
      var group = helpers.draw.group()
      group.circle(10, 10)

      expect(group.add(rect)).toBe(group)
      expect(rect.position()).toBe(1)
    })
    it('adds element at the given position', function () {
      var rect = helpers.draw.rect(100, 100)
      var line = helpers.draw.line(100, 100, 50, 50)
      var group = helpers.draw.group()
      group.circle(10, 10)

      expect(group.add(rect)).toBe(group)
      expect(group.add(line, 1)).toBe(group)
      expect(line.position()).toBe(1)
    })
  })

  describe('put()', function () {
    it('calls add() but returns added element', function () {
      var rect = helpers.draw.rect(100, 100)
      var group = helpers.draw.group()

      spyOn(group, 'add')

      expect(group.put(rect, 0)).toBe(rect)
      expect(group.add).toHaveBeenCalledWith(rect, 0)
    })
  })

})
