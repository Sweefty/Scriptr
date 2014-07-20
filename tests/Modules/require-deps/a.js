define(function(require, exports){
    GLOBAL_COUNTER++;
    exports.name = 'a.js';
    exports.counter = GLOBAL_COUNTER;
});
