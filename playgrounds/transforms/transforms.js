let canvas = SVG('#canvas')

// Make the green rectangle
canvas.rect(200, 400).move(200, 400).attr('opacity', 0.3).addClass('green')

// Make the pink rectangle
let a = canvas
  .rect(200, 400)
  .move(200, 400)
  .attr('opacity', 0.3)
  .addClass('pink')
  .transform({ px: 100, py: 500, origin: 'top-left' })

a.animate().rotate({ rotate: 500, origin: 'top-right' })

// Put an ellipse where we expect the object to be
canvas
  .ellipse(30, 30)
  .center(100, 500)
  .attr('opacity', 0.3)
  .addClass('dark-pink')
