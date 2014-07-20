define(["./Company.js"], function(require,exports,Company) {
    
    function Employee(name) {
        this.name = name;
        this.company = new Company(name + "'s own company");
    };
    
    exports.Employee = Employee;
});
