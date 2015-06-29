define(["./Employee.js", "exports", "./Company.js"], function (Employee, exports, Company) {
    var john = new Employee("John");
    var bigCorp = new Company("Big Corp");
    bigCorp.addEmployee("Mary");
    exports.Company = bigCorp;
    exports.Employee = john;
});
