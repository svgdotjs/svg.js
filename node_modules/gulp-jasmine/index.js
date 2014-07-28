'use strict';
var path = require('path');
var gutil = require('gulp-util');
var through = require('through2');
var requireUncached = require('require-uncached');

module.exports = function (options) {
	options = options || {};

	var miniJasmineLib = requireUncached('minijasminenode2');
	var color = process.argv.indexOf('--no-color') === -1;
	var reporter = options.reporter;

	if (reporter) {
		(Array.isArray(reporter) ? reporter : [reporter]).forEach(function (el) {
			miniJasmineLib.addReporter(el);
		});
	}

	return through.obj(function (file, enc, cb) {
		if (file.isNull()) {
			this.push(file);
			cb();
			return;
		}

		if (file.isStream()) {
			this.emit('error', new gutil.PluginError('gulp-jasmine', 'Streaming not supported'));
			cb();
			return;
		}

		delete require.cache[require.resolve(path.resolve(file.path))];
		miniJasmineLib.addSpecs(file.path);

		this.push(file);
		cb();
	}, function (cb) {
		try {
			miniJasmineLib.executeSpecs({
				isVerbose: options.verbose,
				includeStackTrace: options.includeStackTrace,
				defaultTimeoutInterval: options.timeout,
				showColors: color,
				onComplete: function (passed) {
					if (!passed) {
						this.emit('error', new gutil.PluginError('gulp-jasmine', 'Tests failed'));
					}

					cb();
				}.bind(this)
			});
		} catch (err) {
			this.emit('error', new gutil.PluginError('gulp-jasmine', err));
			cb();
		}
	});
};
