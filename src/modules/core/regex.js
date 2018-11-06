// Parse unit value
export let numberAndUnit = /^([+-]?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?)([a-z%]*)$/i

// Parse hex value
export let hex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i

// Parse rgb value
export let rgb = /rgb\((\d+),(\d+),(\d+)\)/

// Parse reference id
export let reference = /(#[a-z0-9\-_]+)/i

// splits a transformation chain
export let transforms = /\)\s*,?\s*/

// Whitespace
export let whitespace = /\s/g

// Test hex value
export let isHex = /^#[a-f0-9]{3,6}$/i

// Test rgb value
export let isRgb = /^rgb\(/

// Test css declaration
export let isCss = /[^:]+:[^;]+;?/

// Test for blank string
export let isBlank = /^(\s+)?$/

// Test for numeric string
export let isNumber = /^[+-]?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i

// Test for percent value
export let isPercent = /^-?[\d.]+%$/

// Test for image url
export let isImage = /\.(jpg|jpeg|png|gif|svg)(\?[^=]+.*)?/i

// split at whitespace and comma
export let delimiter = /[\s,]+/

// The following regex are used to parse the d attribute of a path

// Matches all hyphens which are not after an exponent
export let hyphen = /([^e])-/gi

// Replaces and tests for all path letters
export let pathLetters = /[MLHVCSQTAZ]/gi

// yes we need this one, too
export let isPathLetter = /[MLHVCSQTAZ]/i

// matches 0.154.23.45
export let numbersWithDots = /((\d?\.\d+(?:e[+-]?\d+)?)((?:\.\d+(?:e[+-]?\d+)?)+))+/gi

// matches .
export let dots = /\./g
