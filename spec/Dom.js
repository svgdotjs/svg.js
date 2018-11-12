let svgdom
if (typeof require === 'function') {
  svgdom = require('svgdom')
} else {
  svgdom = window
}

export default {
  window: svgdom,
  document: svgdom.document
}
