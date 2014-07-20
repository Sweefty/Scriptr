define(function(require, exports){
    exports.name = 'b.js';
    require(['./a.js','./c.js'],function(a,c){
        QUnit.deepEqual(a, {name: 'a.js', counter : 1});
        QUnit.deepEqual(c, {name: 'c.js', name2: 'c.js'});
    });
    
    require('./c.js', function(c2){
        QUnit.deepEqual(c2, {name: 'c.js', name2: 'c.js'});
    });
    
});
