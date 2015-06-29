define(function() {

    var Company;
    this.require("./Company.js", function( C ){
        // Delayed loading
        Company = C;
    });
    
    this.exports =  function (name) {
        this.name = name;
        this.company = new Company(name + "'s own company");
    };
    
});
