'use strict'

var svg, xhr = new XMLHttpRequest()
xhr.open('GET', '/base/spec/fixture.svg', false)
xhr.send()
if(xhr.status !== 200)
	console.error('SVG fixture could not be loaded. Tests will fail.')
svg = xhr.responseText
document.body.innerHTML = svg