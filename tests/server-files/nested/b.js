define(function(require,exports){
    require('./c.js',function(c){
        exports.c = c;
    });
    exports.name = 'b.js';
});
