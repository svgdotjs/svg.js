// Storage for regular expressions
SVG.regex = {
  // Parse unit value
  numberAndUnit:    /^([+-]?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?)([a-z%]*)$/i

  // Parse hex value
, hex:              /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i

  // Parse rgb value
, rgb:              /rgb\((\d+),(\d+),(\d+)\)/

  // Parse reference id
, reference:        /#([a-z0-9\-_]+)/i

  // Parse matrix wrapper
, matrix:           /matrix\(|\)/g

  // Elements of a matrix
, matrixElements:   /,*\s+|,/

  // Whitespace
, whitespace:       /\s/g

  // Test hex value
, isHex:            /^#[a-f0-9]{3,6}$/i

  // Test rgb value
, isRgb:            /^rgb\(/

  // Test css declaration
, isCss:            /[^:]+:[^;]+;?/

  // Test for blank string
, isBlank:          /^(\s+)?$/

  // Test for numeric string
, isNumber:         /^[+-]?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i

  // Test for percent value
, isPercent:        /^-?[\d\.]+%$/

  // Test for image url
, isImage:          /\.(jpg|jpeg|png|gif|svg)(\?[^=]+.*)?/i

  // The following regex are used to parse the d attribute of a path

  // Replaces all negative exponents
, negExp:           /e\-/gi

  // Replaces all comma
, comma:            /,/g

  // Replaces all hyphens
, hyphen:           /\-/g

  // Replaces and tests for all path letters
, pathLetters:      /[MLHVCSQTAZ]/gi

  // yes we need this one, too
, isPathLetter:     /[MLHVCSQTAZ]/i

  // split at whitespaces
, whitespaces:      /\s+/

  // matches X
, X:                /X/g
}
