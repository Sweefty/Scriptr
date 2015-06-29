define(function(){
	var require = this.require;
	var exports = this.exports;

    exports.name = 'c.js';
    require(['./sub/d.js'], function(d){
        var a = require('a');
        exports.a = a;
        QUnit.deepEqual(d, {name : 'd.js'});
    });
});
