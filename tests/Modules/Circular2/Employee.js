define(["./Company.js"], function(Company) {
    
    function Employee(name) {
        this.name = name;
        this.company = new Company(name + "'s own company");
    };
    
    this.exports.Employee = Employee;
});
