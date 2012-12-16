
Object.prototype.include = function(module) {
  
  for (var key in module)
    this.prototype[key] = module[key];
  
  if (module.included != null)
    module.included.apply(this);
  
  return this;
};