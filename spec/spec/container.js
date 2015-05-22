describe('Container', function() {

  beforeEach(function() {
    draw.clear()
  })
  
  describe('rect()', function() {
    it('should increase children by 1', function() {
      var initial = draw.children().length
      draw.rect(100,100)
      expect(draw.children().length).toBe(initial + 1)
    })
    it('should create a rect', function() {
      expect(draw.rect(100,100).type).toBe('rect')
    })
    it('should create an instance of SVG.Rect', function() {
      expect(draw.rect(100,100) instanceof SVG.Rect).toBe(true)
    })
    it('should be an instance of SVG.Shape', function() {
      expect(draw.rect(100,100) instanceof SVG.Shape).toBe(true)
    })
    it('should be an instance of SVG.Element', function() {
      expect(draw.rect(100,100) instanceof SVG.Element).toBe(true)
    })
  })
  
  describe('ellipse()', function() {
    it('should increase children by 1', function() {
      var initial = draw.children().length
      draw.ellipse(100,100)
      expect(draw.children().length).toBe(initial + 1)
    })
    it('should create an ellipse', function() {
      expect(draw.ellipse(100,100).type).toBe('ellipse')
    })
    it('should create an instance of SVG.Ellipse', function() {
      expect(draw.ellipse(100,100) instanceof SVG.Ellipse).toBe(true)
    })
    it('should be an instance of SVG.Shape', function() {
      expect(draw.ellipse(100,100) instanceof SVG.Shape).toBe(true)
    })
    it('should be an instance of SVG.Element', function() {
      expect(draw.ellipse(100,100) instanceof SVG.Element).toBe(true)
    })
  })
  
  describe('circle()', function() {
    it('should increase children by 1', function() {
      var initial = draw.children().length
      draw.circle(100)
      expect(draw.children().length).toBe(initial + 1)
    })
    it('should create an ellipse', function() {
      expect(draw.circle(100).type).toBe('ellipse')
    })
    it('should create an instance of SVG.Ellipse', function() {
      expect(draw.circle(100) instanceof SVG.Ellipse).toBe(true)
    })
    it('should be an instance of SVG.Shape', function() {
      expect(draw.circle(100) instanceof SVG.Shape).toBe(true)
    })
    it('should be an instance of SVG.Element', function() {
      expect(draw.circle(100) instanceof SVG.Element).toBe(true)
    })
  })
  
  describe('line()', function() {
    it('should increase children by 1', function() {
      var initial = draw.children().length
      draw.line(0,100,100,0)
      expect(draw.children().length).toBe(initial + 1)
    })
    it('should create a line', function() {
      expect(draw.line(0,100,100,0).type).toBe('line')
    })
    it('should create an instance of SVG.Line', function() {
      expect(draw.line(0,100,100,0) instanceof SVG.Line).toBe(true)
    })
    it('should be an instance of SVG.Shape', function() {
      expect(draw.line(0,100,100,0) instanceof SVG.Shape).toBe(true)
    })
    it('should be an instance of SVG.Element', function() {
      expect(draw.line(0,100,100,0) instanceof SVG.Element).toBe(true)
    })
  })
  
  describe('polyline()', function() {
    it('should increase children by 1', function() {
      var initial = draw.children().length
      draw.polyline('0,0 100,0 100,100 0,100')
      expect(draw.children().length).toBe(initial + 1)
    })
    it('should create a polyline', function() {
      expect(draw.polyline('0,0 100,0 100,100 0,100').type).toBe('polyline')
    })
    it('should be an instance of SVG.Polyline', function() {
      expect(draw.polyline('0,0 100,0 100,100 0,100') instanceof SVG.Polyline).toBe(true)
    })
    it('should be an instance of SVG.Shape', function() {
      expect(draw.polyline('0,0 100,0 100,100 0,100') instanceof SVG.Shape).toBe(true)
    })
    it('should be an instance of SVG.Element', function() {
      expect(draw.polyline('0,0 100,0 100,100 0,100') instanceof SVG.Element).toBe(true)
    })
  })
  
  describe('polygon()', function() {
    it('should increase children by 1', function() {
      var initial = draw.children().length
      draw.polygon('0,0 100,0 100,100 0,100')
      expect(draw.children().length).toBe(initial + 1)
    })
    it('should create a polygon', function() {
      expect(draw.polygon('0,0 100,0 100,100 0,100').type).toBe('polygon')
    })
    it('should be an instance of SVG.Polygon', function() {
      expect(draw.polygon('0,0 100,0 100,100 0,100') instanceof SVG.Polygon).toBe(true)
    })
    it('should be an instance of SVG.Shape', function() {
      expect(draw.polygon('0,0 100,0 100,100 0,100') instanceof SVG.Shape).toBe(true)
    })
    it('should be an instance of SVG.Element', function() {
      expect(draw.polygon('0,0 100,0 100,100 0,100') instanceof SVG.Element).toBe(true)
    })
  })
  
  describe('path()', function() {
    it('should increase children by 1', function() {
      var initial = draw.children().length
      draw.path(svgPath)
      expect(draw.children().length).toBe(initial + 1)
    })
    it('should create a path', function() {
      expect(draw.path(svgPath).type).toBe('path')
    })
    it('should be an instance of SVG.Path', function() {
      expect(draw.path(svgPath) instanceof SVG.Path).toBe(true)
    })
    it('should be an instance of SVG.Shape', function() {
      expect(draw.path(svgPath) instanceof SVG.Shape).toBe(true)
    })
    it('should be an instance of SVG.Element', function() {
      expect(draw.path(svgPath) instanceof SVG.Element).toBe(true)
    })
  })
  
  describe('image()', function() {
    it('should increase children by 1', function() {
      var initial = draw.children().length
      draw.image(imageUrl, 100, 100)
      expect(draw.children().length).toBe(initial + 1)
    })
    it('should create a rect', function() {
      expect(draw.image(imageUrl, 100, 100).type).toBe('image')
    })
    it('should create an instance of SVG.Rect', function() {
      expect(draw.image(imageUrl, 100, 100) instanceof SVG.Image).toBe(true)
    })
    it('should be an instance of SVG.Shape', function() {
      expect(draw.image(imageUrl, 100, 100) instanceof SVG.Shape).toBe(true)
    })
    it('should be an instance of SVG.Element', function() {
      expect(draw.image(imageUrl, 100, 100) instanceof SVG.Element).toBe(true)
    })
  })
  
  describe('text()', function() {
    it('increases children by 1', function() {
      var initial = draw.children().length
      draw.text(loremIpsum)
      expect(draw.children().length).toBe(initial + 1)
    })
    it('creates a text element', function() {
      expect(draw.text(loremIpsum).type).toBe('text')
    })
    it('creates an instance of SVG.Rect', function() {
      expect(draw.text(loremIpsum) instanceof SVG.Text).toBe(true)
    })
    it('is an instance of SVG.Shape', function() {
      expect(draw.text(loremIpsum) instanceof SVG.Shape).toBe(true)
    })
    it('is an instance of SVG.Element', function() {
      expect(draw.text(loremIpsum) instanceof SVG.Element).toBe(true)
    })
  })

  describe('plain()', function() {
    it('increases children by 1', function() {
      var initial = draw.children().length
      draw.plain(loremIpsum)
      expect(draw.children().length).toBe(initial + 1)
    })
    it('creates a plain element', function() {
      expect(draw.plain(loremIpsum).type).toBe('text')
    })
    it('creates an instance of SVG.Rect', function() {
      expect(draw.plain(loremIpsum) instanceof SVG.Text).toBe(true)
    })
    it('is an instance of SVG.Shape', function() {
      expect(draw.plain(loremIpsum) instanceof SVG.Shape).toBe(true)
    })
    it('is an instance of SVG.Element', function() {
      expect(draw.plain(loremIpsum) instanceof SVG.Element).toBe(true)
    })
  })
  
  describe('clear()', function() {
    it('removes all children', function() {
      draw.rect(100,100)
      draw.clear()
      expect(draw.children().length).toBe(0)
    })
    it('keeps the defs node', function() {
      var oldDefs = draw.defs()
      draw.rect(100,100).maskWith(draw.circle(100, 100))
      draw.clear()
      expect(draw.defs()).toBe(oldDefs)
    })
    it('clears all children in the defs node', function() {
      draw.rect(100,100).maskWith(draw.circle(100, 100))
      draw.clear()
      expect(draw.defs().children().length).toBe(0)
    })
  })
  
  describe('each()', function() {
    it('should iterate over all children', function() {
      var children = []
      
      draw.rect(100,100)
      draw.ellipse(100, 100)
      draw.polygon()
      
      draw.each(function() {
        children.push(this.type)
      })
      expect(children).toEqual(['rect', 'ellipse', 'polygon'])
    })
    it('should only include the its own children', function() {
      var children = []
        , group = draw.group()
      
      draw.rect(100,200)
      draw.circle(300)
      
      group.rect(100,100)
      group.ellipse(100, 100)
      group.polygon()
      
      group.each(function() {
        children.push(this)
      })
      
      expect(children).toEqual(group.children())
    })
    it('should traverse recursively when set to deep', function() {
      var children = []
        , group = draw.group()
      
      draw.rect(100,200)
      draw.circle(300)
      
      group.rect(100,100)
      group.ellipse(100, 100)
      group.polygon()
      
      draw.each(function() {
        children.push(this)
      }, true)
      
      expect(children.length).toEqual(draw.children().length + group.children().length)
    })
  })
  
  describe('viewbox()', function() {
    it('should set the viewbox when four arguments are provided', function() {
      draw.viewbox(0,0,100,100)
      expect(draw.node.getAttribute('viewBox')).toBe('0 0 100 100')
    })
    it('should set the viewbox when an object is provided as first argument', function() {
      draw.viewbox({ x: 0, y: 0, width: 50, height: 50, zoom: 1 })
      expect(draw.node.getAttribute('viewBox')).toBe('0 0 50 50')
    })
    it('should accept negative values', function() {
      draw.size(100,100).viewbox(-100,-100,50,50)
      expect(draw.node.getAttribute('viewBox')).toEqual('-100 -100 50 50')
    })
    it('should get the viewbox if no arguments are given', function() {
      draw.viewbox(0,0,100,100)
      expect(draw.viewbox()).toEqual({ x: 0, y: 0, width: 100, height: 100, zoom: 1 })
    })
    it('should define the zoom of the viewbox in relation to the canvas size', function() {
      draw.size(100,100).viewbox(0,0,50,50)
      expect(draw.viewbox().zoom).toEqual(100 / 50)
    })
  })

  describe('get()', function() {
    it('gets an element at a given index', function() {
      draw.clear()
      var rect = draw.rect(100,100)
      var circle = draw.circle(100)
      var line = draw.line(0,0,100,100)
      expect(draw.get(0)).toBe(rect)
      expect(draw.get(1)).toBe(circle)
      expect(draw.get(2)).toBe(line)
      expect(draw.get(3)).toBe(undefined)
    })
  })

  describe('has()', function() {
    it('determines if a given element is a child of the parent', function() {
      var rect = draw.rect(100,100)
      var circle = draw.circle(100)
      var group = draw.group()
      var line = group.line(0,0,100,100)
      expect(draw.has(rect)).toBe(true)
      expect(draw.has(circle)).toBe(true)
      expect(draw.has(group)).toBe(true)
      expect(draw.has(line)).toBe(false)
      expect(group.has(line)).toBe(true)
    })
  })
  
  describe('index()', function() {
    it('determines the index of given element', function() {
      var rect = draw.rect(100,100)
      var circle = draw.circle(100)
      var group = draw.group()
      var line = group.line(0,0,100,100)
      expect(draw.index(rect)).toBe(0)
      expect(draw.index(circle)).toBe(1)
      expect(draw.index(group)).toBe(2)
      expect(draw.index(line)).toBe(-1)
      expect(group.index(line)).toBe(0)
    })
  })
  
})











