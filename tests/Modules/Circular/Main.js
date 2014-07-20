define(["./Employee.js", "./Company.js"], function (require, exports, Employee, Company) {
    var john = new Employee("John");
    var bigCorp = new Company("Big Corp");
    bigCorp.addEmployee("Mary");
    exports.Company = bigCorp;
    exports.Employee = john;
});
