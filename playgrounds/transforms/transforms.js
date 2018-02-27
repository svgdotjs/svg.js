
let mover = SVG.select("#new")[0]

console.log(mover.transform());
mover.transform({
  position: [30, 50]
})
