describe('Element', function() {
  
  afterEach(function() {
    draw.clear()
  })
  
  it('should create a circular reference on the node', function() {
    var rect = draw.rect(100,100)
    expect(rect.node.instance).toBe(rect)
  })
  
  describe('attr()', function() {
    var rect
    
    beforeEach(function() {
      rect = draw.rect(100,100)
    })
    
    it('should set one attribute when two arguments are given', function() {
      rect.attr('fill', '#ff0066')
      expect(rect.node.getAttribute('fill')).toBe('#ff0066')
    })
    it('should set various attributes when an object is given', function() {
      rect.attr({ fill: '#00ff66', stroke: '#ff2233', 'stroke-width': 10 })
      expect(rect.node.getAttribute('fill')).toBe('#00ff66')
      expect(rect.node.getAttribute('stroke')).toBe('#ff2233')
      expect(rect.node.getAttribute('stroke-width')).toBe('10')
    })
    it('should get the value of the string value given as first argument', function() {
      rect.attr('fill', '#ff0066')
      expect(rect.attr('fill')).toEqual('#ff0066')
    })
    it('should get an object with all attributes without any arguments', function() {
      rect.attr({ fill: '#00ff66', stroke: '#ff2233' })
      var attr = rect.attr()
      expect(attr.fill).toBe('#00ff66')
      expect(attr.stroke).toBe('#ff2233')
    })
    it('should remove an attribute if the second argument is explicitly set to null', function() {
      rect.attr('stroke-width', 10)
      expect(rect.node.getAttribute('stroke-width')).toBe('10')
      rect.attr('stroke-width', null)
      expect(rect.node.getAttribute('stroke-width')).toBe(null)
    })
    it('should correctly parse numeric values as a getter', function() {
      rect.attr('stroke-width', 11)
      expect(rect.node.getAttribute('stroke-width')).toBe('11')
      expect(rect.attr('stroke-width')).toBe(11)
    })
    it('should correctly parse negative numeric values as a getter', function() {
      rect.attr('x', -120)
      expect(rect.node.getAttribute('x')).toBe('-120')
      expect(rect.attr('x')).toBe(-120)
    })
    it('should get the "style" attribute as a string', function() {
      rect.style('cursor', 'pointer')
      expect(rect.attr('style')).toBe('cursor:pointer;')
    })
    it('should redirect to the style() method when setting a style string', function() {
      rect.attr('style', 'cursor:move;')
      expect(rect.node.getAttribute('style')).toBe('cursor:move;')
    })
    it('should remove style attribute on node if the style is empty', function() {
      rect.style('style', '')
      expect(rect.node.getAttribute('style')).toBe(null)
    })
    it('should act as a global getter when no arguments are given', function() {
      rect.fill('#ff0066')
      expect(rect.attr().fill).toBe('#ff0066')
    })
    it('should correctly parse numeric values as a global getter', function() {
      rect.stroke({ width: 20 })
      expect(rect.attr()['stroke-width']).toBe(20)
    })
    it('should correctly parse negative numeric values as a global getter', function() {
      rect.x(-30)
      expect(rect.attr().x).toBe(-30)
    })
    it('should leave unit values alone as a global getter', function() {
      rect.attr('x', '69%')
      expect(rect.attr().x).toBe('69%')
    })
  })
  
  describe('style()', function() {
    it('should set the style with key and value arguments', function() {
      var rect = draw.rect(100,100).style('cursor', 'crosshair')
      expect(rect.node.getAttribute('style')).toBe('cursor:crosshair;')
    })
    it('should set multiple styles with an object as the first argument', function() {
      var rect = draw.rect(100,100).style({ cursor: 'help', display: 'block' })
      expect(rect.node.getAttribute('style')).toBe('cursor:help;display:block;')
    })
    it('should get a style with a string key as the fists argument', function() {
      var rect = draw.rect(100,100).style({ cursor: 'progress', display: 'block' })
      expect(rect.style('cursor')).toBe('progress')
    })
    it('should get a style with a string key as the fists argument', function() {
      var rect = draw.rect(100,100).style({ cursor: 's-resize', display: 'none' })
      expect(rect.style()).toBe('cursor:s-resize;display:none;')
    })
    it('should remove a style if the value is an empty string', function() {
      var rect = draw.rect(100,100).style({ cursor: 'n-resize', display: '' })
      expect(rect.style()).toBe('cursor:n-resize;')
    })
    it('should remove a style if the value explicitly set to null', function() {
      var rect = draw.rect(100,100).style('cursor', 'w-resize')
      expect(rect.style()).toBe('cursor:w-resize;')
      rect.style('cursor', null)
      expect(rect.style()).toBe('')
    })
  })
  
  describe('transform()', function() {
    it('should set the translation of and element', function() {
      var rect = draw.rect(100,100).transform({ x: 10, y: 10 })
      expect(rect.node.getAttribute('transform')).toBe('translate(10,10)')
    })
    it('should set the scaleX of and element', function() {
      var rect = draw.rect(100,100).transform({ scaleX: 0.1 })
      expect(rect.node.getAttribute('transform')).toBe('scale(0.1,1)')
    })
    it('should set the scaleY of and element', function() {
      var rect = draw.rect(100,100).transform({ scaleY: 10 })
      expect(rect.node.getAttribute('transform')).toBe('scale(1,10)')
    })
    it('should set the skewX of and element', function() {
      var rect = draw.rect(100,100).transform({ skewX: 0.1 })
      expect(rect.node.getAttribute('transform')).toBe('skewX(0.1)')
    })
    it('should set the skewY of and element', function() {
      var rect = draw.rect(100,100).transform({ skewY: 10 })
      expect(rect.node.getAttribute('transform')).toBe('skewY(10)')
    })
    it('should rotate the element around its centre if no rotation point is given', function() {
      var rect = draw.rect(100,100).transform({ rotation: 45 })
      expect(rect.node.getAttribute('transform')).toBe('rotate(45,50,50)')
    })
    it('should rotate the element around the given rotation point', function() {
      var rect = draw.rect(100,100).transform({ rotation: 55, cx: 80, cy:2 })
      expect(rect.node.getAttribute('transform')).toBe('rotate(55,80,2)')
    })
    it('should transform element using a matrix', function() {
      var rect = draw.rect(100,100).transform({ a: 0.5, c: 0.5 })
      expect(rect.node.getAttribute('transform')).toBe('matrix(0.5,0,0.5,1,0,0)')
    })
  })
  
  describe('data()', function() {
    it('should set a data attribute and convert value to json', function() {
      var rect = draw.rect(100,100).data('test', 'value')
      expect(rect.node.getAttribute('data-test')).toBe('value')
    })
    it('should set a data attribute and not convert value to json if flagged raw', function() {
      var rect = draw.rect(100,100).data('test', 'value', true)
      expect(rect.node.getAttribute('data-test')).toBe('value')
    })
    it('should get data value in ony one argument is passed', function() {
      var rect = draw.rect(100,100).data('test', 101)
      expect(rect.data('test')).toBe(101)
    })
    it('should maintain data type for a number', function() {
      var rect = draw.rect(100,100).data('test', 101)
      expect(typeof rect.data('test')).toBe('number')
    })
    it('should maintain data type for an object', function() {
      var rect = draw.rect(100,100).data('test', { string: 'value', array: [1,2,3] })
      expect(typeof rect.data('test')).toBe('object')
      expect(Array.isArray(rect.data('test').array)).toBe(true) 
    })
  })
  
  describe('remove()', function() {
    it('should remove an element and return it', function() {
      var rect = draw.rect(100,100)
      expect(rect.remove()).toBe(rect)
    })
    it('should remove an element from its parent', function() {
      var rect = draw.rect(100,100)
      rect.remove()
      expect(draw.has(rect)).toBe(false)
    })
  })
  
  describe('bbox()', function() {
    it('should return an instance of SVG.BBox', function() {
      var rect = draw.rect(100,100)
      expect(rect.bbox() instanceof SVG.BBox).toBe(true)
    })
    it('should return the correct bounding box', function() {
      var rect = draw.rect(105,210).move(2,12)
      var box = rect.bbox()
      expect(box.x).toBe(2)
      expect(box.y).toBe(12)
      expect(box.cx).toBe(54.5)
      expect(box.cy).toBe(117)
      expect(box.width).toBe(105)
      expect(box.height).toBe(210)
    })
    it('should return the correct bounding within a viewbox', function() {
      var rect = draw.size(300,200).viewbox(150,100).rect(105,210).move(2,12)
      var box = rect.bbox()
      expect(box.x).toBe(2)
      expect(box.y).toBe(12)
      expect(box.cx).toBe(54.5)
      expect(box.cy).toBe(117)
      expect(box.width).toBe(105)
      expect(box.height).toBe(210)
    })
  })
  
  describe('rbox()', function() {
    it('should return an instance of SVG.RBox', function() {
      var rect = draw.rect(100,100)
      expect(rect.rbox() instanceof SVG.RBox).toBe(true)
    })
    it('should return the correct rectangular box', function() {
      var rect = draw.size(200,150).viewbox(0,0,200,150).rect(105,210).move(2,12)
      var box = rect.rbox()
      expect(box.x).toBe(2)
      expect(box.y).toBe(12)
      expect(box.cx).toBe(54.5)
      expect(box.cy).toBe(117)
      expect(box.width).toBe(105)
      expect(box.height).toBe(210)
    })
    it('should return the correct rectangular box within a viewbox', function() {
      var rect = draw.size(200,150).viewbox(0,0,100,75).rect(105,210).move(2,12)
      var box = rect.rbox()
      expect(box.x).toBe(1)
      expect(box.y).toBe(6)
      expect(box.cx).toBe(27.25)
      expect(box.cy).toBe(58.5)
      expect(box.width).toBe(52.5)
      expect(box.height).toBe(105)
    })
  })
  
  describe('doc()', function() {
    it('should return the parent document', function() {
      var rect = draw.rect(100,100)
      expect(rect.doc()).toBe(draw)
    })
  })
  
  describe('parent', function() {
    it('should contain the parent svg', function() {
      var rect = draw.rect(100,100)
      expect(rect.parent).toBe(draw)
    })
    it('should contain the parent group when in a group', function() {
      var group = draw.group()
        , rect = group.rect(100,100)
      expect(rect.parent).toBe(group)
    })
  })
  
  describe('clone()', function() {
    it('should make an exact copy of the element', function() {
      var rect = draw.rect(100,100).center(321,567).fill('#f06')
      clone = rect.clone()
      expect(rect.attr('id', null).attr()).toEqual(clone.attr('id', null).attr())
    })
    it('should assign a new id to the cloned element', function() {
      var rect = draw.rect(100,100).center(321,567).fill('#f06')
      clone = rect.clone()
      expect(rect.attr('id')).not.toEqual(clone.attr('id'))
    })
  })
  
})