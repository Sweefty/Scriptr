define(["./Employee.js"], function(require, exports, Employee) {
    
    function Company(name) {
        this.name = name;
        this.employees = [];
    };
    
    Company.prototype.addEmployee = function(name) {
        var employee = new Employee.Employee(name);
        this.employees.push(employee);
        employee.company = this;
    };
    
    this.exports = Company;
});
