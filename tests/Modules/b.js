define(function(require,exports){
    require('./sub/c.js',function(e){
        exports.b = e.c;
    });
    
    exports.file = 'b.js';
});
