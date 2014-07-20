define(function(require,exports){
    exports.name = 'c.js';
    require(['./sub/d.js'], function(d){
        var a = require('a');
        exports.a = a;
        QUnit.deepEqual(d, {name : 'd.js'});
    });
});
