define(function(require, exports){
    exports.name = 'c.js';
    
    require(['./a.js','./b.js'],function(a,b){
        QUnit.deepEqual(a, {name: 'a.js', counter : 1});
        QUnit.deepEqual(b, {name: 'b.js'});
    });
    
    require('./a.js', function(a){
        exports.name2 = 'c.js';
        QUnit.deepEqual(a, {name: 'a.js', counter : 1});
        require('./b.js', function(b){
            QUnit.deepEqual(b, {name: 'b.js'});
        });
    });
});
