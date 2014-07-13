# gulp-uglify changelog

## 0.3.1

- Fixed homepage URL in npm metadata
- Removes UglifyJS-inserted sourceMappingURL comment [Fixes #39]
- Don’t pass input source map to UglifyJS if there are no mappings
- Added installation instructions

## 0.3.0

- Removed support for old style source maps
- Added support for gulp-sourcemap
- Updated tape development dependency
- Dropped support for Node 0.9
- UglifyJS errors are no longer swallowed

## 0.2.1

- Correct source map output
- Remove `gulp` dependency by using `vinyl` in testing
- Passthrough null files correctly
- Report error if attempting to use a stream-backed file

## 0.2.0

- Dropped support for Node versions less than 0.9
- Switched to using Streams2
- Add support for generating source maps
- Add option for preserving comments
