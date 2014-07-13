gulp-wrapper
============
[![Build Status](https://travis-ci.org/AntouanK/gulp-wrapper.png?branch=master)](https://travis-ci.org/AntouanK/gulp-wrapper) [![NPM version](https://badge.fury.io/js/gulp-wrapper.png)](http://badge.fury.io/js/gulp-wrapper)

> A [Gulp](https://github.com/wearefractal/gulp) plugin for wrapping files with custom strings.
Basically `gulp-header` & `gulp-footer` together.
With the addition that the filename is revealed to the user ( with ${filename} ).

##Usage
For example, on build I can wrap an HTML file with `<script>` template tags and specify the filename id. ( angular templates are a good use case )

sample template file

```
<div>
  <span>my template HTML is here</span>
</div>
```

so in my `gulpfile.js` I can do

```javascript

var gulp    = require('gulp'),
    wrapper = require('gulp-wrapper');

// ...
gulp.src('template.html')
    .pipe(wrapper({
       header: '<script type="text/ng-template" id="${filename}">\n',
       footer: '</script>\n'
    }))
    .pipe(gulp.dest('out'));
```

the result is :
```
<script type="text/ng-template" id="template.html">
<div>
  <span>my template HTML is here</span>
</div>
</script>
```


##API
---
###wrapper(options)

####options.header
Type: `String`

The string you want to prepend to the file. The file name is available through interpolation `${filename}`

```javascript
//...
gulp.src('script/*.js')
    .pipe(wrapper({ header: '/* ${filename} MyCompany 2014 */'}))
```

####options.footer
Type: `String`

The string you want to append to the file. The file name is available through interpolation `${filename}`

```javascript
//...
gulp.src('script/*.js')
	.pipe(wrapper({ footer: '/* ${filename} MyCompany 2014 */'}))
```
