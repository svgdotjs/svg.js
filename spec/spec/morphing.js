describe('Morphing', function () {
  var morphing

  describe('constructors', function () {

    it(`Creates a morphable out of a SVG.Number`, function () {
      var morpher = new SVG.Number(5).to(10)

      expect(morpher instanceof SVG.Morphable).toBe(true)
      expect(morpher.type()).toBe(SVG.Number)
      expect(morpher.at(0.5) instanceof SVG.Number).toBe(true)
      expect(morpher.at(0.5).valueOf()).toBe(7.5)
    })

    it(`Creates a morphable out of a SVG.Color`, function () {
      var morpher = new SVG.Color('#fff').to('#000')

      expect(morpher instanceof SVG.Morphable).toBe(true)
      expect(morpher.type()).toBe(SVG.Color)
      expect(morpher.at(0.5) instanceof SVG.Color).toBe(true)
      expect(morpher.at(0.5).toHex()).toBe('#888')
    })

    it(`Creates a morphable out of a SVG.Box`, function () {
      var morpher = new SVG.Box(1,2,3,4).to(5,6,7,8)

      expect(morpher instanceof SVG.Morphable).toBe(true)
      expect(morpher.type()).toBe(SVG.Box)
      expect(morpher.at(0.5) instanceof SVG.Box).toBe(true)
      expect(morpher.at(0.5)).toEqual(jasmine.objectContaining({x: 3, y: 4, width: 5, height: 6}))
    })

    it(`Creates a morphable out of a SVG.Matrix`, function () {
      var morpher = new SVG.Matrix(1,2,3,4,5,6).to(3,4,5,6,7,8)

      expect(morpher instanceof SVG.Morphable).toBe(true)
      expect(morpher.type()).toBe(SVG.Matrix)
      expect(morpher.at(0.5) instanceof SVG.Matrix).toBe(true)
      expect(morpher.at(0.5).toBe(jasmine.objectContaining({a: 2, b: 3, c: 4, d: 5, e: 6, f: 7}))
    })

    it(`Creates a morphable out of a SVG.Morphable.NonMorphable`, function () {
      var morpher = new SVG.Morphable.NonMorphable('foo').to('bar')

      expect(morpher instanceof SVG.Morphable).toBe(true)
      expect(morpher.type()).toBe(SVG.Morphable.NonMorphable)
      expect(morpher.at(0.5) instanceof SVG.Morphable.NonMorphable).toBe(true)
      expect(morpher.at(0.5).valueOf()).toBe('foo')
      expect(morpher.at(1).valueOf()).toBe('bar')
    })

    it(`Creates a morphable out of a SVG.Morphable.TransformBag`, function () {
      var morpher = new SVG.Morphable.TransformBag({}).to({rotation: 50, tx: 20})

      expect(morpher instanceof SVG.Morphable).toBe(true)
      expect(morpher.type()).toBe(SVG.Morphable.TransformBag)
      expect(morpher.at(0.5) instanceof SVG.Morphable.TransformBag).toBe(true)
      expect(morpher.at(0.5).valueOf()).toBe(jasmine.objectContaining({rotation: 25, tx: 10}))
    })

    it(`Creates a morphable out of a SVG.Morphable.ObjectBag`, function () {
      var morpher = new SVG.Morphable.ObjectBag({a:5, b: 10}).to({a: 10, b: 20})

      expect(morpher instanceof SVG.Morphable).toBe(true)
      expect(morpher.type()).toBe(SVG.Morphable.ObjectBag)
      expect(morpher.at(0.5) instanceof SVG.Morphable.ObjectBag).toBe(true)
      expect(morpher.at(0.5).valueOf()).toBe(jasmine.objectContaining({a: 7.5, b: 15}))
    })
  })
})
