// Storage for regular expressions
SVG.regex = {
  
  unit:   /^([\d\.]+)([a-z%]{0,2})$/
  
, hex:    /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i

, rgb:    /rgb\((\d+),(\d+),(\d+),([\d\.]+)\)/

, hsb:    /hsb\((\d+),(\d+),(\d+),([\d\.]+)\)/

, isHex:  /^#/i

, isRgb:  /^rgb\(/
  
, isHsb:  /^hsb\(/
  
}