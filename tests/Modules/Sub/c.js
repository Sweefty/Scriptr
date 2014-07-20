define(function(require,exports){
    require("../a.js",function(a){
        exports.c = a.number;
    });
    
    exports.file = 'c.js';
});
