define(function(){
    var exports = this.exports;
    
    this.require('./b.js',function(b){
        exports.b = b;
    });
    
    this.exports.name = 'a.js';
});
