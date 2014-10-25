QUnit.test( "require function Defined", function( assert ) {
    assert.ok( require, "Passed!" );
});

QUnit.test( "define function Defined", function( assert ) {
    assert.ok( define, "Passed!" );
});

QUnit.asyncTest( "Loading Simple Module!", function( assert ) {
    expect( 1 );
    require('./tests/Modules/a.js',function(test){
        assert.strictEqual(test.file, 'a.js');
        QUnit.start();
    });
});

QUnit.asyncTest( "Simple Anon", function( assert ) {
    expect( 4 );
    require([
        './tests/Modules/Anon/sub/b.js',
        './tests/Modules/Anon/a.js',
        './tests/Modules/Anon/c.js'
    ],function(b,a,c){
        assert.strictEqual(a.name, 'a');
        assert.strictEqual(a.bName, 'sub/b');
        assert.strictEqual(c.name, 'c');
        assert.strictEqual(c.aName, 'a');
        QUnit.start();
    });
});

QUnit.asyncTest( "Nested Loading!", function( assert ) {
    expect( 2 );
    require('./tests/Modules/b.js',function(test){
        assert.strictEqual(test.file, 'b.js');
        assert.strictEqual(test.b, 9);
        QUnit.start();
    });
});

QUnit.asyncTest( "Nested Loading Again!", function( assert ) {
    expect( 2 );
    require('./tests/Modules/b.js',function(test){
        assert.strictEqual(test.file, 'b.js');
        assert.strictEqual(test.b, 9);
        QUnit.start();
    });
});

QUnit.asyncTest( "Load External Library!", function( assert ) {
    expect( 2 );
    require({
        file    : 'http://cdnjs.cloudflare.com/ajax/libs/Colors.js/1.2.4/colors.min.js',
        imports : ['Colors'] 
    }, function(Colors){
        assert.ok(typeof Colors === 'object', 'Colors Loaded');
        assert.ok(typeof Colors.hex2hsv === 'function')
        QUnit.start();
    });
});

QUnit.asyncTest( "Lazy Export", function( assert ) {
    expect( 1 );
    require('./tests/Modules/lazy.js',function(test){
        setTimeout(function(){
            assert.strictEqual(test.file, 'lazy.js');
            QUnit.start();
        },1000);
    });
});


QUnit.asyncTest( "Parent Child", function( assert ) {
    expect( 1 );
    require('./tests/Modules/parent.js',function(parent){
        assert.strictEqual(parent.file, 'parent.js');
        QUnit.start();
    });
});

QUnit.asyncTest( "Child", function( assert ) {
    expect( 1 );
    require('./tests/Modules/child.js',function(child){
        assert.strictEqual(child.file, 'child.js');
        QUnit.start();
    });
});


QUnit.asyncTest( "Define Dependencies", function( assert ) {
    expect( 4 );
    require('./tests/Modules/dep.js',function(e,module){
        assert.strictEqual(e.aFile, 'deps/a.js');
        assert.strictEqual(e.bFile, 'deps/b.js');
        assert.strictEqual(e.cFile, 'deps/c.js');
        assert.strictEqual(e._from_b_from_c_from_d_from_a, 'deps/a.js');
        QUnit.start();
    });
});

QUnit.asyncTest( "Define Dependencies Again", function( assert ) {
    expect( 4 );
    require('./tests/Modules/dep.js',function(e,module){
        assert.strictEqual(e.aFile, 'deps/a.js');
        assert.strictEqual(e.bFile, 'deps/b.js');
        assert.strictEqual(e.cFile, 'deps/c.js');
        assert.strictEqual(e._from_b_from_c_from_d_from_a, 'deps/a.js');
        QUnit.start();
    });
});

window.GLOBAL_COUNTER = 0;
QUnit.asyncTest( "Require Dependencies", function( assert ) {
    expect( 11 );
    require([
        './tests/Modules/require-deps/a.js',
        './tests/Modules/require-deps/b.js',
        './tests/Modules/require-deps/c.js'
    ],function(a,b,c){
        assert.deepEqual(a, {name: 'a.js', counter : 1});
        assert.deepEqual(b, {name: 'b.js'});
        assert.deepEqual(c, {name: 'c.js', name2: 'c.js'});
        assert.deepEqual(GLOBAL_COUNTER, 1);
        QUnit.start();
    });
});

QUnit.asyncTest( "Require Dependencies Again", function( assert ) {
    //small delay to avoid running before Require
    //Dependencies main tests
    setTimeout(function(){
        expect( 3 );
        require([
            './tests/Modules/require-deps/b.js',
            './tests/Modules/require-deps/a.js',
            './tests/Modules/require-deps/c.js'
        ],function(b,a,c){
            assert.deepEqual(a, {name: 'a.js', counter : 1});
            assert.deepEqual(b, {name: 'b.js'});
            assert.deepEqual(c, {name: 'c.js', name2: 'c.js'});
            QUnit.start();
        });
    },10);
});

QUnit.asyncTest( "Predefined Native Modules", function( assert ) {
    require.Register({
        'a'        : './tests/Modules/Native/a.js',
        'b'        : './tests/Modules/Native/b.js',
        'c'        : './tests/Modules/Native/c.js',
        'knockout' : {
            file   : 'http://cdnjs.cloudflare.com/ajax/libs/knockout/3.1.0/knockout-min.js',
            imports: ['ko']
        }
    });
    
    expect( 7 );
    require([
        'a',
        'knockout'
    ],function(a, ko){
        assert.ok(typeof ko.observableArray === 'function');
        QUnit.start();
    });
});

QUnit.asyncTest( "Deep Recursion", function( assert ) {
    expect( 2 );
    require('./tests/Modules/deep/b.js',function(b){
        assert.strictEqual(b.name, "b.js");
        assert.strictEqual(b.a.name, "a.js");
        QUnit.start();
    });
});


QUnit.asyncTest( "Circular", function( assert ) {
    expect( 5 );
    require('./tests/Modules/Circular/Main.js',function(a){
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

QUnit.asyncTest( "Circular2", function( assert ) {
    expect( 5 );
    
    require([
        "./tests/Modules/Circular2/Employee.js",
        "./tests/Modules/Circular2/Company.js"
    ], function (Employee, Company) {
        
        var john = new Employee.Employee("John");
        var bigCorp = new Company("Big Corp");
        bigCorp.addEmployee("Mary");
        assert.strictEqual(john.name, "John");
        assert.strictEqual(john.company.name, "John's own company");
        assert.deepEqual(john.company.employees, []);
        assert.deepEqual(bigCorp.employees[0].name, 'Mary');
        assert.deepEqual(bigCorp.employees[0].company.name, 'Big Corp');
        QUnit.start();
    });
});
