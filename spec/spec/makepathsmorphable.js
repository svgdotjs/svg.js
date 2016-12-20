describe('makePathsMorphable()', function(){
  describe('when converting to cubic Bezier curves', function() {
    describe('for an arc', function() {
      it('should be able to convert it to cubic Bezier curves when the large-arc-flag and the sweep-flag are not set', function() {
        var input = new SVG.PathArray('M 273 61 A 67 90 0 0 0 333 155')
          , expected = new SVG.PathArray('M 273 61 C 271.2271728515625 108.77223205566406 297.5823059082031 150.06198120117188 333 155')

        // use input as the value for the two parameters so that the others parts of the algorithm don't interfere with the results of the conversion
        expect(SVG.utils.makePathsMorphable(input, input)[0]).toEqual(expected)
      })
      it('should be able to convert it to cubic Bezier curves when the sweep-flag is set', function() {
        var input = new SVG.PathArray('M 273 215 A 67 90 0 0 1 333 309')
          , expected = new SVG.PathArray('M 273 215 C 308.4176940917969 219.93800354003906 334.7728271484375 261.2277526855469 333 309')

        // use input as the value for the two parameters so that the others parts of the algorithm don't interfere with the results of the conversion
        expect(SVG.utils.makePathsMorphable(input, input)[0]).toEqual(expected)
      })
      it('should be able to convert it to cubic Bezier curves when the large-arc-flag is set', function() {
        var input = new SVG.PathArray('M 273 419 A 67 90 0 1 0 333 513')
          , expected = new SVG.PathArray('M 273 419 C 245.72036743164062 415.19659423828125 219.46961975097656 434.1106262207031 206.7387237548828 466.7421875 C 194.0078125 499.3737487792969 197.3677215576172 539.1329345703125 215.21971130371094 567.1010131835938 C 233.07171630859375 595.0692138671875 261.8105773925781 605.59814453125 287.7614440917969 593.6778564453125 C 313.71234130859375 581.7576293945312 331.6344909667969 549.7954711914062 333 513')

        // use input as the value for the two parameters so that the others parts of the algorithm don't interfere with the results of the conversion
        expect(SVG.utils.makePathsMorphable(input, input)[0]).toEqual(expected)
      })
      it('should be able to convert it to cubic Bezier curves when the large-arc-flag and the sweep-flag are set', function() {
        var input = new SVG.PathArray('M 273 558 A 67 90 0 1 1 333 652')
          , expected = new SVG.PathArray('M 273 558 C 274.3655090332031 521.20458984375 292.2876281738281 489.242431640625 318.238525390625 477.3221740722656 C 344.1894226074219 465.40191650390625 372.92828369140625 475.9308776855469 390.7802734375 503.8990173339844 C 408.63226318359375 531.8671264648438 411.9921875 571.6262817382812 399.26129150390625 604.2578735351562 C 386.5303649902344 636.889404296875 360.2796325683594 655.803466796875 333 652.0000610351562')

        // use input as the value for the two parameters so that the others parts of the algorithm don't interfere with the results of the conversion
        expect(SVG.utils.makePathsMorphable(input, input)[0]).toEqual(expected)
      })
      it('should be able to convert it to cubic Bezier curves when a x-axis-rotation is provided', function() {
        var input = new SVG.PathArray('M 71 61 A 67 90 40 0 0 131 155')
          , expected = new SVG.PathArray('M 71.00001525878906 61.00000762939453 C 59.933311462402344 86.95011138916016 60.439640045166016 113.46055603027344 72.35859680175781 132.13360595703125 C 84.2775650024414 150.806640625 106.13235473632812 159.32861328125 131.00001525878906 155.00001525878906')

        // use input as the value for the two parameters so that the others parts of the algorithm don't interfere with the results of the conversion
        expect(SVG.utils.makePathsMorphable(input, input)[0]).toEqual(expected)
      })
      it('should be able to convert it to cubic Bezier curves even when the radii are not large enough', function() {
        var input = new SVG.PathArray('M 528 61 A 1 2 0 1 0 588 155')
          , expected = new SVG.PathArray('M 528 61.000003814697266 C 515.0213012695312 94.1370849609375 517.9314575195312 142.04261779785156 534.5000610351562 168.00001525878906 C 551.0685424804688 193.95738220214844 575.0213012695312 188.1370849609375 588 155.00001525878906')

        // use input as the value for the two parameters so that the others parts of the algorithm don't interfere with the results of the conversion
        expect(SVG.utils.makePathsMorphable(input, input)[0]).toEqual(expected)
      })
    })

    it('should be able to convert a line to a cubic Bezier curve', function() {
      var input = new SVG.PathArray('M 98 753 L 543 515')
        , expected = new SVG.PathArray('M 98 753 C 98 753 543 515 543 515')

      // use input as the value for the two parameters so that the others parts of the algorithm don't interfere with the results of the conversion
      expect(SVG.utils.makePathsMorphable(input, input)[0]).toEqual(expected)
    })

    it('should be able to convert a horizontal line to a cubic Bezier curve', function() {
      var input = new SVG.PathArray('M 104 220 H 367')
        , expected = new SVG.PathArray('M 104 220 C 104 220 367 220 367 220')

      // use input as the value for the two parameters so that the others parts of the algorithm don't interfere with the results of the conversion
      expect(SVG.utils.makePathsMorphable(input, input)[0]).toEqual(expected)
    })

    it('should be able to convert a vertical line to a cubic Bezier curve', function() {
      var input = new SVG.PathArray('M 290 449 V 307')
        , expected = new SVG.PathArray('M 290 449 C 290 449 290 307 290 307')

      // use input as the value for the two parameters so that the others parts of the algorithm don't interfere with the results of the conversion
      expect(SVG.utils.makePathsMorphable(input, input)[0]).toEqual(expected)
    })

    it('should be able to convert a quadratic Bezier curve to a cubic Bezier curve', function() {
      var input = new SVG.PathArray('M 98 457 Q 224 316 543 219')
        , expected = new SVG.PathArray('M 98 457 C 181.99999999999997 363 330.3333333333333 283.66666666666663 543 219')

      // use input as the value for the two parameters so that the others parts of the algorithm don't interfere with the results of the conversion
      expect(SVG.utils.makePathsMorphable(input, input)[0]).toEqual(expected)
    })

    it('should be able to convert a smooth quadratic Bezier curve to a cubic Bezier curve', function() {
      var input = new SVG.PathArray('M 98 753 Q 224 612 543 515 T 723 800')
        , expected = new SVG.PathArray('M 98 753 C 181.99999999999997 659 330.3333333333333 579.6666666666666 543 515 C 755.6666666666666 450.33333333333326 815.6666666666666 545.3333333333333 723 800')

      // use input as the value for the two parameters so that the others parts of the algorithm don't interfere with the results of the conversion
      expect(SVG.utils.makePathsMorphable(input, input)[0]).toEqual(expected)
    })

    it('should convert a cubic Bezier curve to the same cubic Bezier curve', function() {
      var input = new SVG.PathArray('M 66 350 C 304 -90 246 429 511 112')
        , expected = input

      // use input as the value for the two parameters so that the others parts of the algorithm don't interfere with the results of the conversion
      expect(SVG.utils.makePathsMorphable(input, input)[0]).toEqual(expected)
    })

    it('should be able to convert a smooth cubic Bezier curve to a cubic Bezier curve', function() {
      var input = new SVG.PathArray('M 19 685 C 257 245 199 764 463 447 S 686 485 787 405')
        , expected = new SVG.PathArray('M 19 685 C 257 245 199 764 463 447 C 727 130 686 485 787 405')

      // use input as the value for the two parameters so that the others parts of the algorithm don't interfere with the results of the conversion
      expect(SVG.utils.makePathsMorphable(input, input)[0]).toEqual(expected)
    })

    describe('when the path end with a closepath command', function() {
      it('should make a line between the starpoint and endpoint if they do not have the same coordinates', function() {
        var input = new SVG.PathArray('M 147 225 L 281 90 C 281 90 558 157 217 252 Z')
          , expected = new SVG.PathArray('M 147 225 C 147 225 281 90 281 90 C 281 90 558 157 217 252 C 217 252 147 225 147 225')

        // use input as the value for the two parameters so that the others parts of the algorithm don't interfere with the results of the conversion
        expect(SVG.utils.makePathsMorphable(input, input)[0]).toEqual(expected)
      })
      it('should not make a line between the starpoint and endpoint if they have the same coordinates', function() {
        var input = new SVG.PathArray('M 187 473 C 187 473 428 313 424 432 C 420 550 187 473 187 473 Z')
          , expected = new SVG.PathArray('M 187 473 C 187 473 428 313 424 432 C 420 550 187 473 187 473')

        // use input as the value for the two parameters so that the others parts of the algorithm don't interfere with the results of the conversion
        expect(SVG.utils.makePathsMorphable(input, input)[0]).toEqual(expected)
      })
    })

    it('should be able to convert path that have subpaths', function() {
      var input = new SVG.PathArray('M 205 246 C 205 246 64 232 392 356 C 520 404 385 324 385 324 M 220 224 A 117 87 0 0 1 331 234 A 117 87 0 0 1 379 310')
        , expected = new SVG.PathArray('M 205 246 C 205 246 64 232 392 356 C 520 404 385 324 385 324 M 220.00001525878906 224.00001525878906 C 256.886474609375 213.12060546875 298.6747131347656 216.88531494140625 331.00006103515625 233.99998474121094 C 363.4692077636719 251.53590393066406 381.58673095703125 280.2220153808594 379.0000305175781 310')

      // use input as the value for the two parameters so that the others parts of the algorithm don't interfere with the results of the conversion
      expect(SVG.utils.makePathsMorphable(input, input)[0]).toEqual(expected)
    })
  })


  it('should return two path arrays that use the same commands', function() {
    var input1 = new SVG.PathArray('M 52 196 C 52 196 196 151 139 31 C 139 31 246 135 139 196')
      , input2 = new SVG.PathArray('M 325 213 L 389 196 L 442 226 L 508 188')
      , pathsMorphable = SVG.utils.makePathsMorphable(input1, input2)

    expect(pathsMorphable[0].haveSameCommands(pathsMorphable[1])).toBe(true)
  })

  it('should return two path arrays that use only moveto and curveto commands', function() {
    var input1 = new SVG.PathArray('M 73 96 L 104 66 L 91 88 M 69 24 A 63 29 0 0 1 130 27 A 63 29 0 0 1 156 52 C 66 61 69 24 69 24 Z')
      , input2 = new SVG.PathArray('M 239 70 C 239 70 292 96 354 61 M 264 52 L 243 31 L 318 31 L 333 46 Z')
      , pathsMorphable = SVG.utils.makePathsMorphable(input1, input2)
      , i, il, j, jl, array

    for(i = 0, il = pathsMorphable.length; i < il; i++) {
      array = pathsMorphable[i].value
      for(j = 0, jl = array.length; j < jl; j++) {
        expect(array[j][0] === 'M' || array[j][0] === 'C').toBe(true)
      }
    }
  })

  it('should return two path arrays that have the same number of subpath as the passed path array that had the most', function() {
     // input1 have one subpath
    var input1 = new SVG.PathArray('M 40 125 L 108 35 C 108 35 96 120 133 126 C 67 126 40 125 40 125 Z')
     // input2 have two subpath
      , input2 = new SVG.PathArray('M 197 139 C 197 139 232 131 229 90 C 279 125 243 142 346 145 M 191 79 L 225 22 L 268 98 L 344 73')
      , numberOfSubpath = 0, expectedNumberOfSubpath = 2
      , pathsMorphable = SVG.utils.makePathsMorphable(input1, input2)
      , i, il, j, jl, array

    for(i = 0, il = pathsMorphable.length; i < il; i++) {
      array = pathsMorphable[i].value
      numberOfSubpath = 0
      for(j = 0, jl = array.length; j < jl; j++) {
        if(array[j][0] === 'M') {
          numberOfSubpath++
        }
      }
      expect(numberOfSubpath).toBe(expectedNumberOfSubpath)
    }
  })

  describe('should return two path arrays that have segment points at the same position relative to the total length of their respective path', function(){
    it('when the two passed path arrays have only one subpath', function(){
      var input1 = new SVG.PathArray('M 52 196 C 52 196 196 151 139 31 C 139 31 246 135 139 196')
        , input2 = new SVG.PathArray('M 325 213 L 389 196 L 442 226 L 508 188')
        , expected1 = new SVG.PathArray('M 52 196 C 52 196 131.15503639355302 171.26405112701468 148.8625627168421 109.56584499288604 C 155.03864060691558 88.04658138682134 153.7396697998047 62.0308837890625 139 31 C 139 31 152.83611273037968 44.44818433606997 165.58209533253495 64.50917076455009 C 188.28137256170157 100.23571352270665 207.52320098876953 156.93537139892578 139 196')
        , expected2 = new SVG.PathArray('M 325 213 C 325 213 389 196 389 196 C 389 196 408.3452686788514 206.95015208236873 423.66066663010764 215.61924526232508 C 433.6953197000548 221.29923756606877 442 226 442 226 C 442 226 508 188 508 188')
        , pathsMorphable = SVG.utils.makePathsMorphable(input1, input2)

        expect(pathsMorphable[0]).toEqual(expected1)
        expect(pathsMorphable[1]).toEqual(expected2)
    })

    it('when one of the two passed path arrays have more then one subpath', function(){
      var input1 = new SVG.PathArray('M 40 125 L 108 35 C 108 35 96 120 133 126 C 67 126 40 125 40 125 Z')
       // input2 have more than one subpath
        , input2 = new SVG.PathArray('M 197 139 C 197 139 232 131 229 90 C 279 125 243 142 346 145 M 191 79 L 225 22 L 268 98 L 344 73')
        , expected1 = new SVG.PathArray('M 40 125 C 40 125 52.79324022307992 108.06777029298246 67.28167847620784 88.8918961344308 C 86.19626173004508 63.85788888670504 108 35 108 35 C 108 35 106.15418140310794 48.07454839465208 106.14249059903192 64.33001882474106 M 106.14249059903192 64.33001882474106 C 106.13151259113593 79.59438229998497 107.73782459669037 97.66360673509575 114.00847226966519 110.34563496202313 C 118.08668296727907 118.59358411812049 124.13779022684321 124.56288490165025 133 126 C 119.25033569335938 126 107.19329706928693 125.95659934147261 96.72038513043016 125.88788119064324 C 56.92209243844263 125.62674416438676 40 125 40 125')
        , expected2 = new SVG.PathArray('M 197 139 C 197 139 232 131 229 90 C 270.5576934814453 119.09038543701172 252.7051460329676 135.74606928403955 304.63173695701465 142.26375161757144 C 315.18045033159433 143.58779699739534 328.60884857177734 144.49346160888672 346 145 M 191 79 C 191 79 225 22 225 22 C 225 22 233.41753200814128 36.87749843299389 242.8040255255205 53.467579998594374 C 254.63263889029622 74.37396641075611 268 98 268 98 C 268 98 344 73 344 73')
        , pathsMorphable = SVG.utils.makePathsMorphable(input1, input2)

        expect(pathsMorphable[0]).toEqual(expected1)
        expect(pathsMorphable[1]).toEqual(expected2)
    })

    it('when the two passed path arrays have more then one subpath', function(){
      var input1 = new SVG.PathArray('M 73 96 L 104 66 L 91 88 M 69 24 A 63 29 0 0 1 130 27 A 63 29 0 0 1 156 52 C 66 61 69 24 69 24 Z')
        , input2 = new SVG.PathArray('M 239 70 C 239 70 292 96 354 61 M 264 52 L 243 31 L 318 31 L 333 46 Z')
        , expected1 = new SVG.PathArray('M 73 96 C 73 96 104 66 104 66 C 104 66 91 88 91 88 M 69.00000762939453 24 C 79.7054945146665 21.904410892981105 91.26029182381859 21.247896750676198 102.41745719843816 21.96913231193544 M 102.41745719843816 21.96913231193544 C 111.20621436239367 22.537266241395347 119.74823784121546 23.96030449827539 127.43403682459561 26.208272013673316 C 128.30054227911958 26.461710350780116 129.15616464399147 26.725633997668268 130.00003051757812 27 C 147.31700134277344 32.76412582397461 157.10549926757812 42.1761589050293 156 52 C 147.66000366210938 52.83399963378906 140.1186079562176 53.27299250336364 133.2994220425104 53.3830248556465 C 126.57319294537638 53.49155728443149 120.5496180078558 53.28003662293028 115.1553879999344 52.81184480959273 C 67.00277496042524 48.632442154755466 69 24 69 24')
        , expected2 = new SVG.PathArray('M 239 70 C 239 70 258.71147435647435 79.66977987298742 288.15472192097485 79.27674871180326 C 297.18432917449667 79.15621455482503 307.12922550607357 78.08925667452031 317.7015604164671 75.50671612921313 M 317.7015604164671 75.50671612921313 C 329.183864565392 72.70189427392025 341.4062637425959 68.10936724208295 354 61 M 264 52 C 264 52 243 31 243 31 C 243 31 244.13948627840728 31 246.1375515428337 31 C 253.8394970695019 31 274.29883165997177 31 291.42632264236624 31 C 305.90338310220073 31 318 31 318 31 C 318 31 333 46 333 46 C 333 46 264 52 264 52')
        , pathsMorphable = SVG.utils.makePathsMorphable(input1, input2)

        expect(pathsMorphable[0]).toEqual(expected1)
        expect(pathsMorphable[1]).toEqual(expected2)
    })
  })

  it('should not duplicate segment points because of the imprecise nature of floating point number', function() {
    // The two inputs represent the same path but translated
    var input1 = new SVG.PathArray('M 29.294424 49.280734 C 29.294424 49.280734 39.901025 -8.803036499999997 45.96194 17.460929000000004 C 52.022856 43.724895000000004 34.345186 69.988861 46.972093 75.039624 C 59.599 80.090387 21.213203 74.534548 35.860415 93.22237')
      , input2 = new SVG.PathArray('M 98.994949 110.39496 C 98.994949 110.39496 109.60155 52.311192 115.66247000000001 78.575158 C 121.72338000000002 104.83912000000001 104.04571000000001 131.10309 116.67262000000001 136.15385 C 129.29953 141.20462 90.913728 135.64878000000002 105.56094000000002 154.3366')
      , pathsMorphable = SVG.utils.makePathsMorphable(input1, input2)

    // Since the two inputs represent the same path, the algorithm shouldn't
    // add new segments points as the ones on the two passed path are already at
    // the same position relative to the total length of their respective path
    // But, because of imprecision introduced by floating point arithmetic,
    // the segment points don't end up at the exact same position so the
    // algorithm must take that into account when comparing their position
    expect(pathsMorphable[0].haveSameCommands(input1)).toBe(true)
    expect(pathsMorphable[1].haveSameCommands(input1)).toBe(true)
  })
})
