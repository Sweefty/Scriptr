define(function(){
    this.exports.file = 'parent.js';
    this.require('./child.js', function(){
        
    });
});
