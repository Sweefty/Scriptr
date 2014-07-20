define(function (require,exports) {
    var b = require("./sub/b.js");
    this.exports = {
        name: "a",
        bName: b.f()
    };
});
