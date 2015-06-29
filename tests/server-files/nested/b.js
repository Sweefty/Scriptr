define(function(){
	var exports = this.exports;

    this.require('./c.js',function(c){
        exports.c = c;
    });
    exports.name = 'b.js';
});
