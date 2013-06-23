// Module for unit convertions
SVG.Number = function(value) {

  /* initialize defaults */
  this.value = 0
  this.unit = ''

  /* parse value */
  switch(typeof value) {
    case 'number':
      this.value = value
    break
    case 'string':
      var match = value.match(SVG.regex.unit)

      /* make valu numeric */
      this.value = parseFloat(match[1])
  
      /* normalize percent value */
      if (match[2] == '%')
        this.value /= 100
  
      /* store unit */
      this.unit = match[2]

    break
    default:
      if (value instanceof SVG.Number) {
        this.value = value.value
        this.unit  = value.unit
      }
    break
  }
}

SVG.extend(SVG.Number, {
  // Stringalize
  toString: function() {
    return (this.unit == '%' ? ~~(this.value * 100) : this.value) + this.unit
  }
, // Convert to primitive
  valueOf: function() {
    return this.value
  }
  // Convert to different unit
, to: function(unit) {
    if (typeof unit === 'string')
      this.unit = unit

    return this
  }
  // Add number
, plus: function(number) {
    this.value = this + new SVG.Number(number)

    return this
  }
  // Subtract number
, minus: function(number) {
    return this.plus(-new SVG.Number(number))
  }
  // Multiply number
, times: function(number) {
    this.value = this * new SVG.Number(number)

    return this
  }
  // Divide number
, divide: function(number) {
    this.value = this / new SVG.Number(number)

    return this
  }

})