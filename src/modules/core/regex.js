// Parse unit value
export const numberAndUnit = /^([+-]?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?)([a-z%]*)$/i

// Parse hex value
export const hex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i

// Parse rgb value
export const rgb = /rgb\((\d+),(\d+),(\d+)\)/

// Parse reference id
export const reference = /(#[a-z0-9\-_]+)/i

// splits a transformation chain
export const transforms = /\)\s*,?\s*/

// Whitespace
export const whitespace = /\s/g

// Test hex value
export const isHex = /^#[a-f0-9]{3,6}$/i

// Test rgb value
export const isRgb = /^rgb\(/

// Test css declaration
export const isCss = /[^:]+:[^;]+;?/

// Test for blank string
export const isBlank = /^(\s+)?$/

// Test for numeric string
export const isNumber = /^[+-]?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i

// Test for percent value
export const isPercent = /^-?[\d.]+%$/

// Test for image url
export const isImage = /\.(jpg|jpeg|png|gif|svg)(\?[^=]+.*)?/i

// split at whitespace and comma
export const delimiter = /[\s,]+/

// The following regex are used to parse the d attribute of a path

// Matches all hyphens which are not after an exponent
export const hyphen = /([^e])-/gi

// Replaces and tests for all path letters
export const pathLetters = /[MLHVCSQTAZ]/gi

// yes we need this one, too
export const isPathLetter = /[MLHVCSQTAZ]/i

// matches 0.154.23.45
export const numbersWithDots = /((\d?\.\d+(?:e[+-]?\d+)?)((?:\.\d+(?:e[+-]?\d+)?)+))+/gi

// matches .
export const dots = /\./g
