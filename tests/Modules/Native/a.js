define(['b','c'],function(require,exports, b, c){
    exports.name = 'a.js';
    QUnit.strictEqual(b.name, 'b.js');
    QUnit.strictEqual(c.name, 'c.js');
    QUnit.strictEqual(c.a.name, 'a.js');
});
