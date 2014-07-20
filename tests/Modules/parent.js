define(function(require,exports){
    exports.file = 'parent.js';
    require('./child.js', function(){
        
    });
});
