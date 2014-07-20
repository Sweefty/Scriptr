define(['./test1.js'], function(require,exports,test1){
    exports.name = 'test2';
    QUnit.deepEqual(test1.name, 'test1');
});
