define([
    './deps/a.js',
    './deps/b.js',
],function(a, b){
    this.exports._from_b_from_c_from_d_from_a = b._from_c_from_d_from_a;
    this.exports.aFile = a.file;
    this.exports.bFile = b.file;
    this.exports.cFile = b.cfile;
});
