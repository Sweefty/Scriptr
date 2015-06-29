define(['exports', 'require'], function(exports, require){
    require('./sub/c.js',function(e){
        exports.b = e.c;
    });
    
    exports.file = 'b.js';
});
