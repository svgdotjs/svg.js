let canvas = SVG('#canvas').group().translate(-150, 230)

// Make a bunch of rectangles
function rectangles(method = 'Vibrant') {
  // Make a group
  let group = canvas.group()
  group.text(method).attr('font-size', 50).move(-230, 20)

  // Add the squares
  for (let i = 0; i < 20; i++) {
    let color = SVG.Color.random(method.toLowerCase()).toHex()
    let rect = group
      .rect(100, 100)
      .x(20 + 100 * i)
      .fill(color)
  }
  return group
}

rectangles('Vibrant').translate(0, 100)
rectangles('Sine').translate(0, 220)
rectangles('Pastel').translate(0, 340)
rectangles('Dark').translate(0, 460)
rectangles('RGB').translate(0, 580)
rectangles('LAB').translate(0, 700)
rectangles('Grey').translate(0, 820)
