describe('Morphing', function () {
  var morphing

  describe('constructors', function () {

    it(`Creates a morphable out of an SVG.Number`, function () {
      var morpher = new SVG.Number(5).to(10)

      expect(morpher instanceof SVG.Morphable).toBe(true)
      expect(morpher.type()).toBe(SVG.Number)
      expect(morpher.at(0.5) instanceof SVG.Number).toBe(true)
      expect(morpher.at(0.5).valueOf()).toBe(7.5)
    })

    it(`Creates a morphable out of an SVG.Color`, function () {
      var morpher = new SVG.Color('#fff').to('#000')

      expect(morpher instanceof SVG.Morphable).toBe(true)
      expect(morpher.type()).toBe(SVG.Color)
      expect(morpher.at(0.5) instanceof SVG.Color).toBe(true)
      expect(morpher.at(0.5).toHex()).toBe('#808080')
    })

    it(`Creates a morphable out of an SVG.Box`, function () {
      var morpher = new SVG.Box(1, 2, 3, 4).to([5, 6, 7, 8])

      expect(morpher instanceof SVG.Morphable).toBe(true)
      expect(morpher.type()).toBe(SVG.Box)
      expect(morpher.at(0.5) instanceof SVG.Box).toBe(true)
      expect(morpher.at(0.5)).toEqual(jasmine.objectContaining({x: 3, y: 4, width: 5, height: 6}))
    })

    it(`Creates a morphable out of an SVG.Matrix`, function () {
      var morpher = new SVG.Matrix(1, 2, 3, 4, 5, 6).to([3, 4, 5, 6, 7, 8])

      expect(morpher instanceof SVG.Morphable).toBe(true)
      expect(morpher.type()).toBe(SVG.Matrix)
      expect(morpher.at(0.5) instanceof SVG.Matrix).toBe(true)
      expect(morpher.at(0.5)).toEqual(jasmine.objectContaining(new SVG.Matrix(2, 3, 4, 5, 6, 7)))
    })

    it(`Creates a morphable out of an SVG.Array`, function () {
      var morpher = new SVG.Array([1,2,3,4,5,6]).to([3,4,5,6,7,8])

      expect(morpher instanceof SVG.Morphable).toBe(true)
      expect(morpher.type()).toBe(SVG.Array)
      expect(morpher.at(0.5) instanceof SVG.Array).toBe(true)
      expect(morpher.at(0.5).toArray()).toEqual(jasmine.arrayContaining([2, 3, 4, 5, 6, 7]))
    })

    it(`Creates a morphable out of an SVG.PointArray`, function () {
      var morpher = new SVG.PointArray([1, 2, 3, 4, 5, 6]).to([3, 4, 5, 6, 7, 8])

      expect(morpher instanceof SVG.Morphable).toBe(true)
      expect(morpher.type()).toBe(SVG.PointArray)
      expect(morpher.at(0.5) instanceof SVG.PointArray).toBe(true)
      expect(morpher.at(0.5).toArray()).toEqual(jasmine.arrayContaining([2, 3, 4, 5, 6, 7]))
    })

    it(`Creates a morphable out of an SVG.PathArray`, function () {
      var morpher = new SVG.PathArray(['M', 1, 2, 'L', 3, 4, 'L', 5, 6]).to(['M', 3, 4, 'L', 5, 6, 'L', 7, 8])

      expect(morpher instanceof SVG.Morphable).toBe(true)
      expect(morpher.type()).toBe(SVG.PathArray)
      expect(morpher.at(0.5) instanceof SVG.PathArray).toBe(true)
      expect(morpher.at(0.5).toArray()).toEqual(jasmine.arrayContaining(['M', 2, 3, 'L', 4, 5, 'L', 6, 7]))
    })

    it(`Creates a morphable out of an SVG.Morphable.NonMorphable`, function () {
      var morpher = new SVG.Morphable.NonMorphable('foo').to('bar')

      expect(morpher instanceof SVG.Morphable).toBe(true)
      expect(morpher.type()).toBe(SVG.Morphable.NonMorphable)
      expect(morpher.at(0.5) instanceof SVG.Morphable.NonMorphable).toBe(true)
      expect(morpher.at(0.5).valueOf()).toBe('foo')
      expect(morpher.at(1).valueOf()).toBe('bar')
    })

    it(`Creates a morphable out of an SVG.Morphable.TransformBag`, function () {
      var morpher = new SVG.Morphable.TransformBag({}).to({rotate: 50, translateX: 20})

      // FIXME: SVG.Matrix does now allow translateX to be passed but decompose returns it!!!!!
      console.log(new SVG.Morphable.TransformBag({rotate: 50, tx: 20}).valueOf().decompose())

      expect(morpher instanceof SVG.Morphable).toBe(true)
      expect(morpher.type()).toBe(SVG.Morphable.TransformBag)
      expect(morpher.at(0.5) instanceof SVG.Morphable.TransformBag).toBe(true)

      // TODO: This fails because of roundingerrors and the FIXME above
      expect(morpher.at(0.5).valueOf().decompose()).toBe(jasmine.objectContaining({rotate: 25, translateX: 10}))
    })

    it(`Creates a morphable out of an SVG.Morphable.ObjectBag`, function () {
      var morpher = new SVG.Morphable.ObjectBag({a:5, b: 10}).to({a: 10, b: 20})

      expect(morpher instanceof SVG.Morphable).toBe(true)
      expect(morpher.type()).toBe(SVG.Morphable.ObjectBag)
      expect(morpher.at(0.5) instanceof Object).toBe(true)
      expect(morpher.at(0.5).valueOf()).toEqual(jasmine.objectContaining({a: 7.5, b: 15}))
    })
  })
})
