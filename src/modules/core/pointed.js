import PointArray from '../../types/PointArray.js'

export const MorphArray = PointArray

// Move by left top corner over x-axis
export function x (xValue) {
  return xValue == null ? this.bbox().x : this.move(xValue, this.bbox().y)
}

// Move by left top corner over y-axis
export function y (yValue) {
  return yValue == null ? this.bbox().y : this.move(this.bbox().x, yValue)
}

// Set width of element
export function width (widthValue) {
  const b = this.bbox()
  return widthValue == null ? b.width : this.size(widthValue, b.height)
}

// Set height of element
export function height (heightValue) {
  const b = this.bbox()
  return heightValue == null ? b.height : this.size(b.width, heightValue)
}
