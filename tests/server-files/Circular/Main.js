define(["./Employee.js", "./Company.js"], function (Employee, Company) {
    var john = new Employee("John");
    var bigCorp = new Company("Big Corp");
    bigCorp.addEmployee("Mary");
    this.exports.Company = bigCorp;
    this.exports.Employee = john;
});
