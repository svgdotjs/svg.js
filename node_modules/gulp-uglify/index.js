'use strict';
var through = require('through2'),
	uglify = require('uglify-js'),
	merge = require('deepmerge'),
	uglifyError = require('./lib/error.js'),
	reSourceMapComment = /\n\/\/# sourceMappingURL=.+?$/;

module.exports = function(opt) {

	function minify(file, encoding, callback) {
		/*jshint validthis:true */

		if (file.isNull()) {
			this.push(file);
			return callback();
		}

		if (file.isStream()) {
			return callback(uglifyError('Streaming not supported', {
				fileName: file.path,
				showStack: false
			}));
		}

		var options = merge(opt || {}, {
			fromString: true,
			output: {}
		});

		var mangled,
			originalSourceMap;

		if (file.sourceMap) {
			options.outSourceMap = file.relative;
			if (file.sourceMap.mappings !== '') {
				options.inSourceMap = file.sourceMap;
			}
			originalSourceMap = file.sourceMap;
		}

		if (options.preserveComments === 'all') {
			options.output.comments = true;
		} else if (options.preserveComments === 'some') {
			// preserve comments with directives or that start with a bang (!)
			options.output.comments = /^!|@preserve|@license|@cc_on/i;
		} else if (typeof options.preserveComments === 'function') {
			options.output.comments = options.preserveComments;
		}

		try {
			mangled = uglify.minify(String(file.contents), options);
			file.contents = new Buffer(mangled.code.replace(reSourceMapComment, ''));
		} catch (e) {
			return callback(uglifyError(e.message, {
				fileName: file.path,
				lineNumber: e.line,
				stack: e.stack,
				showStack: false
			}));
		}

		if (file.sourceMap) {
			file.sourceMap = JSON.parse(mangled.map);
			file.sourceMap.sourcesContent = originalSourceMap.sourcesContent;
			file.sourceMap.sources = originalSourceMap.sources;
		}

		this.push(file);

		callback();
	}

	return through.obj(minify);
};
