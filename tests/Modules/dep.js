define([
    './deps/a.js',
    './deps/b.js',
],function(require,exports,a,b){
    exports._from_b_from_c_from_d_from_a = b._from_c_from_d_from_a;
    exports.aFile = a.file;
    exports.bFile = b.file;
    exports.cFile = b.cfile;
});
