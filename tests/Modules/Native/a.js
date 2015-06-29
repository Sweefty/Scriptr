define(['b','c'],function(b, c){
    this.exports.name = 'a.js';
    QUnit.strictEqual(b.name, 'b.js');
    QUnit.strictEqual(c.name, 'c.js');
    QUnit.strictEqual(c.a.name, 'a.js');
});
