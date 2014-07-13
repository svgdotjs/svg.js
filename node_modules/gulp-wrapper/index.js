
// gulp-wrapper
//
//  A plugin used to wrap files with custom strings



var through2 = require('through2'),
    gutil = require('gulp-util'),
    PluginError = gutil.PluginError;

module.exports = function(opt) {

  'use strict';

  if(typeof opt !== 'object'){
    opt = {};
  }

  if(typeof opt.header !== 'string'){
    opt.header = '';
  }
  if(typeof opt.footer !== 'string'){
    opt.footer = '';
  }

  return through2.obj(function (file, enc, callback) {

    //  check if file is there
    if (file.isNull()) {
        this.push(file);
        return callback();
      }

    if (file.isStream()){
        return this.emit('error', new PluginError('gulp-wrapper',  'Streaming not supported'));
      }

        //  get the file's name
    var fileName = file.path.replace(file.base,''),  //  replace front slash from windowsLand
        //  set the new contents
        newContentString = file.contents.toString();

    //  normalize windows platform slashes
    if(process.platform.match(/^win/)){
      fileName = fileName.replace(/\\/g, '/');
    }
        //  inject the file name if needed
    var header = opt.header.replace(/\${filename}/g,fileName),
        footer = opt.footer.replace(/\${filename}/g,fileName);

    //  wrap the contents
    newContentString = header + newContentString + footer;

    //  change the file contents
    file.contents = new Buffer(newContentString);

    //  push the file into the output
    this.push(file);
    callback();
  });
};
