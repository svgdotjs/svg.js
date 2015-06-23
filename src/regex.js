// Storage for regular expressions
SVG.regex = {
  // Parse unit value
  unit:             /^(-?[\d\.]+)([a-z%]{0,2})$/
  
  // Parse hex value
, hex:              /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i
  
  // Parse rgb value
, rgb:              /rgb\((\d+),(\d+),(\d+)\)/
  
  // Parse reference id
, reference:        /#([a-z0-9\-_]+)/i
  
  // Parse matrix wrapper
, matrix:           /matrix\(|\)/g
  
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
, isNumber:         /^-?[\d\.]+$/

  // Test for percent value
, isPercent:        /^-?[\d\.]+%$/

  // Test for image url
, isImage:          /\.(jpg|jpeg|png|gif|svg)(\?[^=]+.*)?/i

}