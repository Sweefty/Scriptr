define(function(require,exports){
    exports.name = 'd.js';
    require(['a','b'], function(a,b){
        QUnit.strictEqual(a.name, 'a.js');
        QUnit.strictEqual(b.name, 'b.js');
    });
});
