//require.debug = true;
require.Path('http://localhost:9001/');

QUnit.asyncTest( "Loading Simple Module With Delay!", function( assert ) {
    expect( 1 );
    require('test1.js',function(test){
        assert.strictEqual(test.name, 'test1');
        QUnit.start();
    });
});

QUnit.asyncTest( "Loading Simple Module!", function( assert ) {
    expect( 2 );
    require('test2.js',function(test){
        assert.strictEqual(test.name, 'test2');
        QUnit.start();
    });
});


QUnit.asyncTest( "Nested Delay!", function( assert ) {
    expect( 3 );
    require('nested/a.js',function(a){
        assert.strictEqual(a.name, 'a.js');
        assert.strictEqual(a.b.name, 'b.js');
        assert.strictEqual(a.b.c.name, 'c.js');
        QUnit.start();
    });
});


QUnit.asyncTest( "Nested Delay Without Timeout!", function( assert ) {
    expect( 3 );
    var g;
    require('nested/a.js',function(a){
        g = a;
    });
    //now shouldn't pause
    setTimeout(function(){
        assert.strictEqual(g.name, 'a.js');
        assert.strictEqual(g.b.name, 'b.js');
        assert.strictEqual(g.b.c.name, 'c.js');
        QUnit.start();
    },1000);
});

QUnit.asyncTest( "Circular With Delays", function( assert ) {
    expect( 5 );
    require('Circular/Main.js',function(a){
        var john = a.Employee;
        var bigCorp = a.Company;
        assert.strictEqual(john.name, "John");
        assert.strictEqual(john.company.name, "John's own company");
        assert.deepEqual(john.company.employees, []);
        assert.deepEqual(bigCorp.employees[0].name, 'Mary');
        assert.deepEqual(bigCorp.employees[0].company.name, 'Big Corp');
        QUnit.start();
    });
});

