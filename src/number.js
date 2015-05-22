// Module for unit convertions
SVG.Number = function(value) {

  /* initialize defaults */
  this.value = 0
  this.unit = ''

  /* parse value */
  if (typeof value === 'number') {
    /* ensure a valid numeric value */
    this.value = isNaN(value) ? 0 : !isFinite(value) ? (value < 0 ? -3.4e+38 : +3.4e+38) : value

  } else if (typeof value === 'string') {
    var match = value.match(SVG.regex.unit)

    if (match) {
      /* make value numeric */
      this.value = parseFloat(match[1])
    
      /* normalize percent value */
      if (match[2] == '%')
        this.value /= 100
      else if (match[2] == 's')
        this.value *= 1000
    
      /* store unit */
      this.unit = match[2]
    }

  } else {
    if (value instanceof SVG.Number) {
      this.value = value.value
      this.unit  = value.unit
    }
  }

}

SVG.extend(SVG.Number, {
  // Stringalize
  toString: function() {
    return (
      this.unit == '%' ?
        ~~(this.value * 1e8) / 1e6:
      this.unit == 's' ?
        this.value / 1e3 :
        this.value
    ) + this.unit
  }
, // Convert to primitive
  valueOf: function() {
    return this.value
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
  // Convert to different unit
, to: function(unit) {
    if (typeof unit === 'string')
      this.unit = unit

    return this
  }
  // Make number morphable
, morph: function(number) {
    this.destination = new SVG.Number(number)

    return this
  }
  // Get morphed number at given position
, at: function(pos) {
    /* make sure a destination is defined */
    if (!this.destination) return this

    /* generate new morphed number */
    return new SVG.Number(this.destination)
        .minus(this)
        .times(pos)
        .plus(this)
  }

})