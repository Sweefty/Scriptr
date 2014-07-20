define(function(require,exports){
    
    require('./b.js',function(b){
        exports.b = b;
    });
    
    exports.name = 'a.js';
});
