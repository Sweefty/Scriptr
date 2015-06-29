define(function(){
	var require = this.require;
    var exports = this.exports;

    require("../a.js",function(a){
        exports.c = a.number;
    });
    
    exports.file = 'c.js';
});
