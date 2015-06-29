define(function () {
    var a = this.require('a.js');
    this.exports = {
        name: 'c',
        aName: a.name
    };
});
