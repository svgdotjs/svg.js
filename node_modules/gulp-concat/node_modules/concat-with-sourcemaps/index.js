'use strict';
var SourceMapGenerator = require('source-map').SourceMapGenerator;
var SourceMapConsumer = require('source-map').SourceMapConsumer;

function Concat(generateSourceMap, fileName, separator) {
  this.separator = separator;
  this.lineOffset = 0;
  this.columnOffset = 0;
  this.sourceMapping = generateSourceMap;
  this.content = '';

  if (separator === undefined) {
    this.separator = '\n';
  }

  if (this.sourceMapping) {
    this._sourceMap = new SourceMapGenerator({file: fileName});
    this.separatorLineOffset = 0;
    this.separatorColumnOffset = 0;
    for (var i = 0; i < this.separator.length; i++) {
      this.separatorColumnOffset++;
      if (this.separator[i] === '\n') {
        this.separatorLineOffset++;
        this.separatorColumnOffset = 0;
      }
    }
  }
}

Concat.prototype.add = function(filePath, content, sourceMap) {
  if (this.content !== '') {
    this.content += this.separator;
  }
  this.content += content;

  if (this.sourceMapping) {
    var lines = content.split('\n').length;

    if (Object.prototype.toString.call(sourceMap) === '[object String]')
      sourceMap = JSON.parse(sourceMap);

    if (sourceMap && sourceMap.mappings && sourceMap.mappings.length > 0) {
      var upstreamSM = new SourceMapConsumer(sourceMap);
      var _this = this;
      upstreamSM.eachMapping(function(mapping) {
        if (mapping.source) {
          _this._sourceMap.addMapping({
            generated: {
              line: _this.lineOffset + mapping.generatedLine,
              column: (mapping.generatedLine === 1 ? _this.columnOffset : 0) + mapping.generatedColumn
            },
            original: {
              line: mapping.originalLine,
              column: mapping.originalColumn
            },
            source: mapping.source,
            name: mapping.name
          });
        }
      });
      if (upstreamSM.sourcesContent) {
        upstreamSM.sourcesContent.forEach(function(sourceContent, i) {
          _this._sourceMap.setSourceContent(upstreamSM.sources[i], sourceContent);
        });
      }
    } else {
      for (var i = 1; i <= lines; i++) {
        this._sourceMap.addMapping({
          generated: {
            line: this.lineOffset + i,
            column: (i === 1 ? this.columnOffset : 0)
          },
          original: {
            line: i,
            column: 0
          },
          source: filePath
        });
      }
      if (sourceMap && sourceMap.sourcesContent)
        this._sourceMap.setSourceContent(filePath, sourceMap.sourcesContent[0]);
    }
    if (lines > 1)
      this.columnOffset = 0;
    if (this.separatorLineOffset === 0)
      this.columnOffset += content.length - Math.max(0, content.lastIndexOf('\n')+1);
    this.columnOffset += this.separatorColumnOffset;
    this.lineOffset += lines - 1 + this.separatorLineOffset;
  }
};

Object.defineProperty(Concat.prototype, 'sourceMap', {
  get: function sourceMap() {
    return this._sourceMap ? this._sourceMap.toString() : undefined;
  }
});

module.exports = Concat;
