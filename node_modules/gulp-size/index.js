'use strict';
var gutil = require('gulp-util');
var through = require('through2');
var chalk = require('chalk');
var prettyBytes = require('pretty-bytes');
var gzipSize = require('gzip-size');

function log(title, what, size, gzip) {
	title = title ? ('\'' + chalk.cyan(title) + '\' ') : '';
	gutil.log('gulp-size: ' + title + what + ' ' + chalk.magenta(prettyBytes(size)) +
		(gzip ? chalk.gray(' (gzipped)') : ''));
}

module.exports = function (options) {
	options = options || {};

	var totalSize = 0;
	var fileCount = 0;

	return through.obj(function (file, enc, cb) {
		if (file.isNull()) {
			this.push(file);
			return cb();
		}

		if (file.isStream()) {
			this.emit('error', new gutil.PluginError('gulp-size', 'Streaming not supported'));
			return cb();
		}

		var finish = function (err, size) {
			totalSize += size;

			if (options.showFiles === true && size > 0) {
				log(options.title, chalk.blue(file.relative), size, options.gzip);
			}

			fileCount++;
			this.push(file);
			cb();
		}.bind(this);

		if (options.gzip) {
			gzipSize(file.contents, finish);
		} else {
			finish(null, file.contents.length);
		}
	}, function (cb) {
		if (fileCount === 1 && options.showFiles === true && totalSize > 0) {
			return cb();
		}

		log(options.title, chalk.green('total'), totalSize, options.gzip);
		cb();
	});
};
