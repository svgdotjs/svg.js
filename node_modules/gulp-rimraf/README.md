gulp-rimraf ![status](https://secure.travis-ci.org/robrich/gulp-rimraf.png?branch=master)
===========

[rimraf](https://github.com/isaacs/rimraf) plugin for [gulp](https://github.com/gulpjs/gulp)

Usage
-----

1. Delete a folder: use [rimraf](https://github.com/isaacs/rimraf) directly:

```javascript
var rimraf = require('rimraf'); // rimraf directly
gulp.task('task', function (cb) {
	rimraf('./folder', cb);
});
```

2. Delete some files in a folder: use gulp-rimraf

```javascript
var ignore = require('gulp-ignore');
var rimraf = require('gulp-rimraf');

gulp.task('task', function() {
  return gulp.src('./**/*.js', { read: false }) // much faster
    .pipe(ignore('node_modules/**'))
    .pipe(rimraf());
});
```
Setting option `read` to false prevents gulp to read the contents of the files and makes this task much faster.

Files and folders outside the current working directory can be removed with `force` option.

```javascript
var rimraf = require('gulp-rimraf');

gulp.task('task', function() {
  return gulp.src('../temp/*.js', { read: false })
    .pipe(rimraf({ force: true }));
});
```

LICENSE
-------

(MIT License)

Copyright (c) 2014 [Richardson & Sons, LLC](http://richardsonandsons.com/)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
