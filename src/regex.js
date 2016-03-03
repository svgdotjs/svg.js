// Storage for regular expressions
SVG.regex = {
  /* parse unit value */
  unit:         /^(-?[\d\.]+)([a-z%]{0,2})$/
  
  /* parse hex value */
, hex:          /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i
  
  /* parse rgb value */
, rgb:          /rgb\((\d+),(\d+),(\d+)\)/
  
  /* parse reference id */
, reference:    /#([a-z0-9\-_]+)/i

  /* test hex value */
, isHex:        /^#[a-f0-9]{3,6}$/i
  
  /* test rgb value */
, isRgb:        /^rgb\(/
  
  /* test css declaration */
, isCss:        /[^:]+:[^;]+;?/
  
  /* test for blank string */
, isBlank:      /^(\s+)?$/
  
  /* test for numeric string */
, isNumber:     /^-?[\d\.]+$/

  /* test for percent value */
, isPercent:    /^-?[\d\.]+%$/

  /* test for image url */
, isImage:      /\.(jpg|jpeg|png|gif)(\?[^=]+.*)?/i
  
  /* test for namespaced event */
, isEvent:      /^[\w]+.[\w]+$/

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