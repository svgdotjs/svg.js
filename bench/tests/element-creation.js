;(function(bench) {
  
  bench.test('generate 10000 rects', function() {
    for (var i = 0; i < 10000; i++)
      bench.draw.rect(100,100)
  })

  bench.test('generate 10000 rects with fill', function() {
    for (var i = 0; i < 10000; i++)
      bench.draw.rect(100,100).fill('#f06')
  })

  bench.test('generate 10000 rects with position and fill', function() {
    for (var i = 0; i < 10000; i++)
      bench.draw.rect(100,100).move(50,50).fill('#f06')
  })

})(SVG.bench);