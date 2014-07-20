var http = require('http');
var fs = require('fs');
var path = require('path');

function getFile(url) {
    var file = __dirname + '/server-files' + url;
    return fs.readFileSync(path.resolve(file));
}

var Responses = {
    '/test1.js' : function(res,url){
        setTimeout(function(){
            res.end(getFile(url));
        },1000);
    },
    
    '/nested/a.js' : function(res,url){
        setTimeout(function(){
            res.end(getFile(url));
        },1000);
    },
    
    '/nested/b.js' : function(res,url){
        setTimeout(function(){
            res.end(getFile(url));
        },1000);
    },
    
    '/nested/c.js' : function(res,url){
        setTimeout(function(){
            res.end(getFile(url));
        },1000);
    },
    
    '/Circular/Main.js' : function(res,url){
        setTimeout(function(){
            res.end(getFile(url));
        },500);
    },
    
    '/Circular/Company.js' : function(res,url){
        setTimeout(function(){
            res.end(getFile(url));
        },1500);
    },
    
    '/Circular/Employee.js' : function(res,url){
        setTimeout(function(){
            res.end(getFile(url));
        },1000);
    },
    
    'default' : function(res,url){
        res.end(getFile(url));
    },
    
    'Delay' : function(res,url){
         setTimeout(function(){
            res.end(fs.readFileSync(url));
        },250);
    },
    
    'Normal' : function(res,url){
         setTimeout(function(){
            res.end(fs.readFileSync(url));
        },0);
    }
};

var srv = http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/javascript'});
    var uri = req.url;
    var splitPath = uri.split(/WithServerTests/);
    
    if (splitPath.length > 1) {
        var last = splitPath.pop();
        var split2 = last.split(/(Delay|Normal)/);
        if (split2.length > 1) {
            uri = split2.pop();
            uri = '/..' + uri;
            uri = path.resolve(__dirname + uri);
            Responses[split2[1]](res,uri);
        }
    } else if (Responses[uri]) {
        Responses[uri](res,uri);
    } else {
        Responses['default'](res,uri);
    }
});

srv.listen(9001, '127.0.0.1', function(){
    console.log("listening on 9001");
});
