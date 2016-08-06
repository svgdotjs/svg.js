SVG.bench.describe('Generate 10000 rects', function(bench) {
  bench.test('using svg.js v2.3.4', function() {
    for (var i = 0; i < 10000; i++)
      bench.draw.rect(100,100)
  })
  bench.test('using vanilla js', function() {
    for (var i = 0; i < 10000; i++) {
      var rect = document.createElementNS(SVG.ns, 'rect')
      rect.setAttributeNS(null, 'height', 100)
      rect.setAttributeNS(null, 'width', 100)
      bench.raw.appendChild(rect)
    }
  })
  bench.test('using Snap.svg v0.41', function() {
    for (var i = 0; i < 10000; i++)
      bench.snap.rect(50, 50, 100, 100)
  })
})

SVG.bench.describe('Generate 10000 rects with fill', function(bench) {
  bench.test('using svg.js v2.3.4', function() {
    for (var i = 0; i < 10000; i++)
      bench.draw.rect(100,100).fill('#f06')
  })
  bench.test('using vanilla js', function() {
    for (var i = 0; i < 10000; i++) {
      var rect = document.createElementNS(SVG.ns, 'rect')
      rect.setAttributeNS(null, 'height', 100)
      rect.setAttributeNS(null, 'width', 100)
      rect.setAttributeNS(null, 'fill', '#f06')
      bench.raw.appendChild(rect)
    }
  })
  bench.test('using Snap.svg v0.41', function() {
    for (var i = 0; i < 10000; i++)
      bench.snap.rect(50, 50, 100, 100).attr('fill', '#f06')
  })
})

SVG.bench.describe('Generate 10000 rects with position and fill', function(bench) {
  bench.test('using svg.js v2.3.4', function() {
    for (var i = 0; i < 10000; i++)
      bench.draw.rect(100,100).move(50,50).fill('#f06')
  })
  bench.test('using vanilla js', function() {
    for (var i = 0; i < 10000; i++) {
      var rect = document.createElementNS(SVG.ns, 'rect')
      rect.setAttributeNS(null, 'height', 100)
      rect.setAttributeNS(null, 'width', 100)
      rect.setAttributeNS(null, 'fill', '#f06')
      rect.setAttributeNS(null, 'x', 50)
      rect.setAttributeNS(null, 'y', 50)
      bench.raw.appendChild(rect)
    }
  })
  bench.test('using Snap.svg v0.41', function() {
    for (var i = 0; i < 10000; i++)
      bench.snap.rect(50, 50, 100, 100).attr('fill', '#f06')
  })
})