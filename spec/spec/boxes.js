describe('Box', function() {
  describe('initialization', function() {
    var box

    it('creates a new box with default values', function() {
      box = new SVG.Box

      expect(box instanceof SVG.Box).toBe(true)
      expect(box).toEqual(jasmine.objectContaining({
        x:0, y:0, cx:0, cy:0, width:0, height:0
      }))
    })

    it('creates a new box from parsed string', function() {
      box = new SVG.Box('10. 100 200 300')
      expect(box.x).toBe(10)
      expect(box.y).toBe(100)
      expect(box.width).toBe(200)
      expect(box.height).toBe(300)
      expect(box.cx).toBe(110)
      expect(box.cy).toBe(250)
      expect(box.x2).toBe(210)
      expect(box.y2).toBe(400)
    })

    it('creates a new box from parsed string with comma as delimiter', function() {
      box = new SVG.Box('10,100, 200  , 300')
      expect(box.x).toBe(10)
      expect(box.y).toBe(100)
      expect(box.width).toBe(200)
      expect(box.height).toBe(300)
    })

    it('creates a new box from array', function() {
      box = new SVG.Box([10, 100, 200, 300])

      expect(box.x).toBe(10)
      expect(box.y).toBe(100)
      expect(box.width).toBe(200)
      expect(box.height).toBe(300)
    })

    it('creates a new box from object', function() {
      box = new SVG.Box({x:10, y:100, width:200, height:300})

      expect(box.x).toBe(10)
      expect(box.y).toBe(100)
      expect(box.width).toBe(200)
      expect(box.height).toBe(300)
    })

    it('creates a new box from object width left and top instead of x and y', function() {
      box = new SVG.Box({left:10, top:100, width:200, height:300})

      expect(box.x).toBe(10)
      expect(box.y).toBe(100)
      expect(box.width).toBe(200)
      expect(box.height).toBe(300)
    })

    it('creates a new viewbox from 4 arguments', function() {
      box = new SVG.Box(10, 100, 200, 300)

      expect(box.x).toBe(10)
      expect(box.y).toBe(100)
      expect(box.width).toBe(200)
      expect(box.height).toBe(300)
    })

    it('creates a new box from parsed string with exponential values', function() {
      box = new SVG.Box('-1.12e1 1e-2 +2e2 +.3e+4')

      expect(box.x).toBe(-11.2)
      expect(box.y).toBe(0.01)
      expect(box.width).toBe(200)
      expect(box.height).toBe(3000)
    })

  })

  describe('merge()', function() {
    it('merges various bounding boxes', function() {
      var box1 = new SVG.Box(50, 50, 100, 100)
      var box2 = new SVG.Box(300, 400, 100, 100)
      var box3 = new SVG.Box(500, 100, 100, 100)
      var merged = box1.merge(box2).merge(box3)

      expect(merged).toEqual(jasmine.objectContaining({
        x: 50, y: 50, cx: 325, cy: 275, width: 550, height: 450
      }))
    })
    it('returns a new instance', function() {
      var box1 = new SVG.Box(50, 50, 100, 100)
      var box2 = new SVG.Box(300, 400, 100, 100)
      var merged = box1.merge(box2)
      expect(box1).not.toBe(merged)
      expect(box2).not.toBe(merged)

      expect(merged instanceof SVG.Box).toBe(true)
    })
  })

  describe('transform()', function() {
    it('transforms the box with given matrix', function() {
      var box1 = new SVG.Box(50, 50, 100, 100).transform(new SVG.Matrix(1,0,0,1,20,20))
      var box2 = new SVG.Box(50, 50, 100, 100).transform(new SVG.Matrix(2,0,0,2,0,0))
      var box3 = new SVG.Box(-200, -200, 100, 100).transform(new SVG.Matrix(1,0,0,1,-20,-20))

      expect(box1).toEqual(jasmine.objectContaining({
        x: 70, y: 70, cx: 120, cy: 120, width: 100, height: 100
      }))

      expect(box2).toEqual(jasmine.objectContaining({
        x: 100, y: 100, cx: 200, cy: 200, width: 200, height: 200
      }))

      expect(box3).toEqual(jasmine.objectContaining({
        x: -220, y: -220, cx: -170, cy: -170, width: 100, height: 100
      }))
    })
  })
})


describe('Boxes', function() {
  var rect, nested, offset

  beforeEach(function() {
    offset = draw.screenCTM()
    draw.viewbox(100,100, 200, 200)
    nested = draw.nested().size(200, 200).move(100,100).viewbox(0, 0, 100, 100)
    rect = nested.rect(50, 180).stroke({width:0}).move(25, 90).transform({scale: 2, origin: [0, 0]}).relative(10, 10)
  })
  afterEach(function() {
    draw.clear().attr('viewBox', null)
  })

  describe('bbox()', function() {
    it('returns an instance of SVG.Box', function() {
      expect(rect.bbox() instanceof SVG.Box).toBeTruthy()
    })
    it('matches the size of the target element, ignoring transformations', function() {
      var box = rect.bbox()

      expect(box).toEqual(jasmine.objectContaining({
        x: 25, y: 90, cx: 50, cy: 180, width: 50, height: 180
      }))
    })
    it('returns a box even if the element is not in the dom', function() {
      var line = new SVG.Line().plot(0, 0, 50, 50)
      var box = line.bbox()

      expect(box).toEqual(jasmine.objectContaining({
        x: 0, y: 0, width: 50, height: 50
      }))

      expect('Should not result into infinite loop').toBe('Should not result into infinite loop')
    })
    it('returns a box even if the element is not in the dom and invisible', function() {
      var line = new SVG.Line().plot(0, 0, 50, 50).hide()
      var box = line.bbox()

      expect(box).toEqual(jasmine.objectContaining({
        x: 0, y: 0, width: 50, height: 50
      }))

      expect('Should not result into infinite loop').toBe('Should not result into infinite loop')
    })
  })

  describe('rbox()', function() {
    it('returns an instance of SVG.Box', function() {
      expect(rect.rbox() instanceof SVG.Box).toBeTruthy()
    })

    it('returns the elements box in absolute screen coordinates by default', function() {
      var box = rect.rbox()

      expect(window.roundBox(box)).toEqual(jasmine.objectContaining(window.roundBox({
        x: 70 + offset.e, y: 200 + offset.f, width: 100, height: 360
      })))

    })

    it('returns the elements box in coordinates of given element (root)', function() {
      var box = rect.rbox(draw)

      expect(window.roundBox(box)).toEqual(jasmine.objectContaining({
        x: 240, y: 500, width: 200, height: 720
      }))
    })

    it('returns the elements box in coordinates of given element (nested)', function() {
      var box = rect.rbox(nested)

      expect(window.roundBox(box)).toEqual(jasmine.objectContaining({
        x: 70, y: 200, width: 100, height: 360
      }))
    })
  })

  describe('viewbox()', function() {

    beforeEach(function() {
      draw.attr('viewBox', null)
    })

    it('should set the viewbox when four arguments are provided', function() {
      draw.viewbox(0,0,100,100)
      expect(draw.node.getAttribute('viewBox')).toBe('0 0 100 100')
    })
    it('should set the viewbox when an object is provided as first argument', function() {
      draw.viewbox({ x: 0, y: 0, width: 50, height: 50 })
      expect(draw.node.getAttribute('viewBox')).toBe('0 0 50 50')
    })
    it('should set the viewbox when a string is provided as first argument', function() {
      draw.viewbox('0 0 50 50')
      expect(draw.node.getAttribute('viewBox')).toBe('0 0 50 50')
    })
    it('should set the viewbox when an array is provided as first argument', function() {
      draw.viewbox([0, 0, 50, 50])
      expect(draw.node.getAttribute('viewBox')).toBe('0 0 50 50')
    })
    it('should accept negative values', function() {
      draw.size(100,100).viewbox(-100, -100, 50, 50)
      expect(draw.node.getAttribute('viewBox')).toEqual('-100 -100 50 50')
    })
    it('should get the viewbox if no arguments are given', function() {
      draw.viewbox(0, 0, 100, 100)
      expect(draw.viewbox()).toEqual(new SVG.Box(0,0,100,100))
    })
    it('should get a nulled viewbox when no viewbox attribute is set', function() {
      expect(draw.viewbox()).toEqual(new SVG.Box())
    })
  })

})
