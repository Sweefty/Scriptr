define(function (require) {
    var a = require('a.js');
    this.exports = {
        name: 'c',
        aName: a.name
    };
});
