const glob = require('glob')
const path = require('path')

glob('./spec/*/**/*.js', (err, tests) => {
  if (err) {
    throw err
  }

  glob('./src/**/*.js', (err, files) => {
    if (err) {
      throw err
    }

    files = files.map((e) => path.basename(e))
    tests = tests.map((e) => path.basename(e))
    const difference = files.filter((x) => !tests.includes(x))

    if (difference.length) {
      console.error(
        'The following files dont have a test file:\n\t' +
          difference.join('\n\t')
      )
    } else {
      console.info('All src files are covered by tests')
    }
  })
})
