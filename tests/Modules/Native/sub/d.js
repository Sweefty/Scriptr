define(function(){
    this.exports.name = 'd.js';
    this.require(['a','b'], function(a,b){
        QUnit.strictEqual(a.name, 'a.js');
        QUnit.strictEqual(b.name, 'b.js');
    });
});
