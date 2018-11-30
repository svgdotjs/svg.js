describe('Morphing', function () {
  describe('constructors', function () {

    it('SVG.Morphable with Number', function () {
      var morpher = new SVG.Morphable().from(10).to(5)

      expect(morpher instanceof SVG.Morphable).toBe(true)
      expect(morpher.type()).toBe(SVG.Number)
      expect(morpher.at(0.5) instanceof SVG.Number).toBe(true)
      expect(morpher.at(0.5).valueOf()).toBe(7.5)
    })

    it('SVG.Morphable with String', function () {
      var morpher = new SVG.Morphable().from('foo').to('bar')

      expect(morpher instanceof SVG.Morphable).toBe(true)
      expect(morpher.type()).toBe(SVG.NonMorphable)
      expect(morpher.at(0.5) instanceof SVG.NonMorphable).toBe(true)
      expect(morpher.at(0.5).valueOf()).toBe('foo')
      expect(morpher.at(1).valueOf()).toBe('bar')
    })

    it('SVG.Morphable with Object', function () {
      var morpher = new SVG.Morphable().from({a:5, b: 10}).to({a: 10, b: 20})

      expect(morpher instanceof SVG.Morphable).toBe(true)
      expect(morpher.type()).toBe(SVG.ObjectBag)
      expect(morpher.at(0.5) instanceof Object).toBe(true)
      expect(morpher.at(0.5).valueOf()).toEqual(jasmine.objectContaining({a: 7.5, b: 15}))
    })

    it('Creates a morphable out of an SVG.Number', function () {
      var morpher = new SVG.Number(5).to(10)

      expect(morpher instanceof SVG.Morphable).toBe(true)
      expect(morpher.type()).toBe(SVG.Number)
      expect(morpher.at(0.5) instanceof SVG.Number).toBe(true)
      expect(morpher.at(0.5).valueOf()).toBe(7.5)
    })

    it('Creates a morphable out of an SVG.Color', function () {
      var morpher = new SVG.Color('#fff').to('#000')

      expect(morpher instanceof SVG.Morphable).toBe(true)
      expect(morpher.type()).toBe(SVG.Color)
      expect(morpher.at(0.5) instanceof SVG.Color).toBe(true)
      expect(morpher.at(0.5).toHex()).toBe('#808080')
    })

    it('Creates a morphable out of an SVG.Box', function () {
      var morpher = new SVG.Box(1, 2, 3, 4).to([5, 6, 7, 8])

      expect(morpher instanceof SVG.Morphable).toBe(true)
      expect(morpher.type()).toBe(SVG.Box)
      expect(morpher.at(0.5) instanceof SVG.Box).toBe(true)
      expect(morpher.at(0.5)).toEqual(jasmine.objectContaining({x: 3, y: 4, width: 5, height: 6}))
    })

    it('Creates a morphable out of an SVG.Matrix', function () {
      var morpher = new SVG.Matrix(1, 2, 3, 4, 5, 6).to([3, 4, 5, 6, 7, 8])

      expect(morpher instanceof SVG.Morphable).toBe(true)
      expect(morpher.type()).toBe(SVG.Matrix)
      expect(morpher.at(0.5) instanceof SVG.Matrix).toBe(true)
      expect(morpher.at(0.5)).toEqual(jasmine.objectContaining(new SVG.Matrix(2, 3, 4, 5, 6, 7)))
    })

    it('Creates a morphable out of an SVG.Array', function () {
      var morpher = new SVG.Array([1,2,3,4,5,6]).to([3,4,5,6,7,8])

      expect(morpher instanceof SVG.Morphable).toBe(true)
      expect(morpher.type()).toBe(SVG.Array)
      expect(morpher.at(0.5) instanceof SVG.Array).toBe(true)
      expect(morpher.at(0.5).toArray()).toEqual(jasmine.arrayContaining([2, 3, 4, 5, 6, 7]))
    })

    it('Creates a morphable out of an SVG.PointArray', function () {
      var morpher = new SVG.PointArray([1, 2, 3, 4, 5, 6]).to([3, 4, 5, 6, 7, 8])

      expect(morpher instanceof SVG.Morphable).toBe(true)
      expect(morpher.type()).toBe(SVG.PointArray)
      expect(morpher.at(0.5) instanceof SVG.PointArray).toBe(true)
      expect(morpher.at(0.5).toArray()).toEqual(jasmine.arrayContaining([2, 3, 4, 5, 6, 7]))
    })

    it('Creates a morphable out of an SVG.PathArray', function () {
      var morpher = new SVG.PathArray(['M', 1, 2, 'L', 3, 4, 'L', 5, 6]).to(['M', 3, 4, 'L', 5, 6, 'L', 7, 8])

      expect(morpher instanceof SVG.Morphable).toBe(true)
      expect(morpher.type()).toBe(SVG.PathArray)
      expect(morpher.at(0.5) instanceof SVG.PathArray).toBe(true)
      expect(morpher.at(0.5).toArray()).toEqual(jasmine.arrayContaining(['M', 2, 3, 'L', 4, 5, 'L', 6, 7]))
    })

    it('Creates a morphable out of an SVG.NonMorphable', function () {
      var morpher = new SVG.NonMorphable('foo').to('bar')

      expect(morpher instanceof SVG.Morphable).toBe(true)
      expect(morpher.type()).toBe(SVG.NonMorphable)
      expect(morpher.at(0.5) instanceof SVG.NonMorphable).toBe(true)
      expect(morpher.at(0.5).valueOf()).toBe('foo')
      expect(morpher.at(1).valueOf()).toBe('bar')
    })

    it('Creates a morphable out of an SVG.TransformBag', function () {
      var morpher = new SVG.TransformBag({rotate: 0, translateX: 0})
        .to({rotate: 50, translateX: 20})

      expect(morpher instanceof SVG.Morphable).toBe(true)
      expect(morpher.type()).toBe(SVG.TransformBag)
      expect(morpher.at(0.5) instanceof SVG.TransformBag).toBe(true)

      expect(morpher.at(0.5)).toEqual(jasmine.objectContaining({rotate: 25, translateX: 10}))
    })

    it('Creates a morphable out of an SVG.ObjectBag', function () {
      var morpher = new SVG.ObjectBag({a:5, b: 10}).to({a: 10, b: 20})

      expect(morpher instanceof SVG.Morphable).toBe(true)
      expect(morpher.type()).toBe(SVG.ObjectBag)
      expect(morpher.at(0.5) instanceof Object).toBe(true)
      expect(morpher.at(0.5).valueOf()).toEqual(jasmine.objectContaining({a: 7.5, b: 15}))
    })
  })

  describe('from()', function () {
    it('sets the type of the runner', function () {
      var morpher = new SVG.Morphable().from(5)
      expect(morpher.type()).toBe(SVG.Number)
    })

    it('sets the from attribute to an array representation of the morphable type', function () {
      var morpher = new SVG.Morphable().from(5)
      expect(morpher.from()).toEqual(jasmine.arrayContaining([5]))
    })
  })

  describe('type()', function () {
    it('sets the type of the runner', function () {
      var morpher = new SVG.Morphable().type(SVG.Number)
      expect(morpher._type).toBe(SVG.Number)
    })

    it('gets the type of the runner', function () {
      var morpher = new SVG.Morphable().type(SVG.Number)
      expect(morpher.type()).toBe(SVG.Number)
    })
  })

  describe('to()', function () {
    it('sets the type of the runner', function () {
      var morpher = new SVG.Morphable().to(5)
      expect(morpher.type()).toBe(SVG.Number)
    })

    it('sets the from attribute to an array representation of the morphable type', function () {
      var morpher = new SVG.Morphable().to(5)
      expect(morpher.to()).toEqual(jasmine.arrayContaining([5]))
    })
  })
})
