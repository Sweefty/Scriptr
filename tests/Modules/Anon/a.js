define(function () {
    var b = this.require("./sub/b.js");
    this.exports = {
        name: "a",
        bName: b.f()
    };
});
