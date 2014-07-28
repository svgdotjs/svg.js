var util = require('util'),
    path = require('path'),
    fs  = require('fs');

var minijasminelib = require('./index');
/**
 * A super simple wrapper around minijasminelib.executeSpecs()
 */

var forceExit = false;

var onComplete = function(passed) {
  if (passed) {
    exitCode = 0;
  } else {
    exitCode = 1;
  }
  if (forceExit) {
    process.exit(exitCode);
  }
};

var options = {
  specs: [],
  onComplete: onComplete,
  isVerbose: false,
  showColors: true,
  includeStackTrace: true
};


var args = process.argv.slice(2);

while(args.length) {
  var arg = args.shift();

  switch(arg)
  {
    case '--noColor':
    case '--nocolor':
      options.showColors = false;
      break;
    case '--verbose':
      options.isVerbose = true;
      break;
    case '--forceexit':
        forceExit = true;
        break;
    case '--captureExceptions':
        captureExceptions = true;
        break;
    case '--noStack':
    case '--nostack':
        options.includeStackTrace = false;
        break;
    case '--config':
        var configKey = args.shift();
        var configValue = args.shift();
        process.env[configKey]=configValue;
        break;
    case '-h':
    case '--help':
        help();
    default:
      if (arg.match(/^--params=.*/)) {
        break;
      }
      if (arg.match(/^-/)) {
        help();
      }
      if (arg.match(/^\/.*/)) {
        options.specs.push(arg);
      } else {
        options.specs.push(path.join(process.cwd(), arg));
      }
      break;
  }
}

if (options.specs.length === 0) {
  help();
} else {
  // Check to see if all our files exist
  for (var i = 0; i < options.specs.length; i++) {
    if (!fs.existsSync(options.specs[i])) {
        console.log("File: " + options.specs[i] + " is missing.");
        return;
    }
  }
}

var exitCode = 0;

process.on('uncaughtException', function(e) {
  console.error(e.stack || e);
  exitCode = 1;
  process.exit(exitCode);
});

function onExit() {
  process.removeListener('exit', onExit);
  process.exit(exitCode);
}
process.on('exit', onExit);

minijasminelib.executeSpecs(options);

function help(){
  console.log([
    'USAGE: minijn [--color|--noColor] [--verbose] test1 test2'
  , ''
  , 'Options:'
  , '  --noColor          - do not use color coding for output'
  , '  --verbose          - print extra information per each test run'
  , '  --forceexit        - force exit once tests complete'
  , '  --noStack          - suppress the stack trace generated from a test failure'
  , '  -h, --help         - display this help and exit'
  , ''
  ].join("\n"));

  process.exit(-1);
}
