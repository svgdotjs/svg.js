
//SVG.Object = function Object() {};
//
//Object.prototype.include = function(module) {
//  
//  for (var key in module)
//    this.prototype[key] = module[key];
//  
//  if (module.included != null)
//    module.included.apply(this);
//  
//  return this;
//};

//SVG.Object = function Object() {};
//
//SVG.Object.moduleKeywords = ['included', 'extended'];
//
//SVG.Object.include = function(module) {
//  var key, value, _ref;
//  for (key in module) {
//    value = module[key];
//    if (Array.prototype.indexOf.call(this.moduleKeywords, key) < 0) {
//      this.prototype[key] = value;
//    }
//  }
//  if ((_ref = module.included) != null) {
//    _ref.apply(this);
//  }
//  return this;
//};