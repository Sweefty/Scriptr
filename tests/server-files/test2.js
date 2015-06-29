define(['./test1.js'], function(test1){
    this.exports.name = 'test2';
    QUnit.deepEqual(test1.name, 'test1');
});
