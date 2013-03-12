// Storage for regular expressions
SVG.regex = {
  /* parse unit value */
  unit:         /^([\d\.]+)([a-z%]{0,2})$/
  
  /* parse hex value */
, hex:          /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i
  
  /* parse rgb value */
, rgb:          /rgb\((\d+),(\d+),(\d+),([\d\.]+)\)/
  
  /* parse hsb value */
, hsb:          /hsb\((\d+),(\d+),(\d+),([\d\.]+)\)/
  
  /* test hex value */
, isHex:        /^#[a-f0-9]{3,6}$/i
  
  /* test rgb value */
, isRgb:        /^rgb\(/
  
  /* test hsb value */
, isHsb:        /^hsb\(/
  
  /* test css declaration */
, isCss:        /[^:]+:[^;]+;?/
  
  /* test css property */
, isStyle:      /^font|text|leading|cursor/
  
  /* test for blank string */
, isBlank:      /^(\s+)?$/
  
}