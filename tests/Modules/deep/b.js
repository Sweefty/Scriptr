//define(function(require2,exports){
//    require2('./a.js',function(a){
//        exports.name = 'b.js';
//        exports.a = a;
//    });
//});

define(['./a.js'],function(a){
    this.exports.name = 'b.js';
    this.exports.a = a;
});
