'use strict'

if(process.platform === 'linux') {
	const child_process = require('child_process') 
	const exec = child_process.exec
	const execSync = bind2(child_process.execSync, { encoding: 'utf8' })//spawnSync
	const browsers = ['google-chrome', 'chromium-browser']

	const findBrowser = msg => {
		console.log(msg)
		const browserString = /\/(.*)$/
		const browser = msg.match(browserString)
		console.log(browsers)
		if(browsers[browser]) browsers[browser] = true
	}

	const tryCompose = (f, parameter) => {
		//FIXME:
		const x = f.splice(0, 1)[0]
		if(Array.isArray(f) && f.length > 0) return tryCompose(f, parameter)
		//

		try {
			return x(parameter)
		}
		catch(e) {
			console.warn(e.message)
		}
	}
	
	tryCompose([findBrowser, execSync], 'which google-chrome')
	//findBrowser(execSync('which chromium-browser'))

	if(browsers[0]) return
	if(!browsers[0] && browsers[1]) exec('export CHROME_BIN=chromium-browser')
	if(browsers.every(b => !b)) console.warn('You need to install either Chrome or Chromium to run the test suite.')
	
}

function bind2(f, bound) {
	return (parameter) => f(parameter, bound)
}