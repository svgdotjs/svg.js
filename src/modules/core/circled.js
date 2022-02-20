import SVGNumber from '../../types/SVGNumber.js'

// Radius x value
export function rx (rxValue) {
  return this.attr('rx', rxValue)
}

// Radius y value
export function ry (ryValue) {
  return this.attr('ry', ryValue)
}

// Move over x-axis
export function x (xValue) {
  return xValue == null
    ? this.cx() - this.rx()
    : this.cx(xValue + this.rx())
}

// Move over y-axis
export function y (yValue) {
  return yValue == null
    ? this.cy() - this.ry()
    : this.cy(yValue + this.ry())
}

// Move by center over x-axis
export function cx (x) {
  return this.attr('cx', x)
}

// Move by center over y-axis
export function cy (y) {
  return this.attr('cy', y)
}

// Set width of element
export function width (widthValue) {
  return widthValue == null
    ? this.rx() * 2
    : this.rx(new SVGNumber(widthValue).divide(2))
}

// Set height of element
export function height (heightValue) {
  return heightValue == null
    ? this.ry() * 2
    : this.ry(new SVGNumber(heightValue).divide(2))
}
