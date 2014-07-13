'use strict';

var gutil = require('gulp-util');
var through = require('through2');
var rimraf = require('rimraf');
var path = require('path');

var PLUGIN_NAME = 'gulp-rimraf';

module.exports = function(options){
	if (!options) {
		options = {};
	}

	if (options.force && typeof options.force !== 'boolean') {
		options.force = false;
	}

	function del(file, encoding, cb){
		//jshint validthis:true

		var cwd = file.cwd || process.cwd();
		// For safety always resolve paths
		var filepath = path.resolve(cwd, file.path);
		var relativeFromCwd = path.relative(cwd, filepath);

		if (relativeFromCwd === '') {
			this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Cannot delete the current working directory: ' + filepath));
			this.push(file);
			return cb();
		}

		if (!options.force && relativeFromCwd.substr(0, 2) === '..') {
			this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Cannot delete files or folders outside the current working directory: ' + filepath));
			this.push(file);
			return cb();
		}

		if (options.verbose) {
			gutil.log('gulp-rimraf: removed '+filepath);
		}

		rimraf(filepath, function (err) {
			if (err) {
				this.emit('error', new gutil.PluginError(PLUGIN_NAME, err));
			}
			this.push(file);
			cb();
		}.bind(this));
	}

	return through.obj(del);
};
