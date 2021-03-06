(function () {
    "use strict";
    
    var doc = window.document,
        head = doc.getElementsByTagName('head')[0],
        a = doc.createElement("a"); //for resolving urls
    
    var debug = function (e) {
        if (require.debug && console) { console.log(e); }
    };
    
    var SELF_URL = (function () {
        var script_tags = document.getElementsByTagName('script'),
            path = script_tags[script_tags.length - 1].src;
        path = path.match(/(.*\/).*\.js/);
        return path[1];
    })(), Global_Path = SELF_URL;
    
    function isArray (obj) {
        return Object.prototype.toString.call(obj) === "[object Array]";
    }
    
    function isURL (url) {
        if (/^(f|ht)tps?:\/\//i.test(url)) { return true; }
        return false;
    }
    
    function resolveUri (uri, parent) {
        var fullURI;

        if (uri.indexOf('/') === 0){
            fullURI = uri;
        } else {
            fullURI = parent + uri;
        }

        var resolved;
        a.href = fullURI;
        resolved = a.href;
        return resolved;
    }
    
    function Module (id, cb, parent) {
        this.id = id;
        this.exports = {};
        this.cb = [cb];
        this.parent = parent;
        if (parent && parent.children) {
            parent.children.push(this);
        }
        this.filename = null;
        this.loaded = false;
        this.fired = false;
        this.children = [];
    }
    
    var __require = Module.prototype.require = function (path,cb) {
        return Module._load(path, cb, this);
    };
    
    Module._cache = {};
    Module._Native = {};
    Module._resolveFilename = function (request, parent) {
        var path   = '';
        var _imports = [];

        if (typeof request === 'object'){
            _imports = request.imports || [];
            request = request.file;
        }

        if (Module._Native[request]) {
            request = Module._Native[request];
            if (typeof request === 'object'){
                _imports = request.imports;
                request = request.file;
            }

            if (!isURL(request)) { path = Global_Path; }
        } else if (isURL(request)) {
            //nothing to do
        } else if (parent && parent.id) {
            path = resolveUri('./../', parent.id);
        } else {
            path = Global_Path;
        }

        return {
            file    : resolveUri(request, path),
            imports : _imports
        };
    };
    
    var definedObjects = [];
    window.define = function () {
        var args = [];
        Array.prototype.push.apply( args, arguments );
        var cb = args.pop();
        var requireList = [];
        if (typeof cb !== 'function') {
            throw new Error("define must has a cb function as last argument");
        }
        
        if (isArray(args[0])) {
            requireList = args[0];
        } else if (args[0] && typeof args[0] === 'string'){
            requireList = [args[0]];
        }

        var hasExportsRequire = [];
        var list = [];
        for (var i = 0; i < requireList.length; i++){
            if (requireList[i] === 'require' || requireList[i] === 'exports'){
                hasExportsRequire[i] = requireList[i];
            } else {
                list.push(requireList[i]);
            }
        }

        if (hasExportsRequire.length){
            requireList = list;
            var _cb = cb;
            cb = function(){
                var self = this;
                var args = [];
                Array.prototype.push.apply( args, arguments );
                for (var i =0; i < hasExportsRequire.length; i++){
                    var name = hasExportsRequire[i];
                    if (name){
                        if ( args[i]){ args[i+1] = args[i]; }
                        args.splice(i, 1, self[name]);
                    }
                }
                _cb.apply(this, args);
            };
        }

        definedObjects.push({
            cb   : cb,
            list : requireList
        });
    };
    
    Module.prototype.load = function (filename) {

        var self = this;
        debug('load ' + JSON.stringify(filename) +
              ' for module ' + JSON.stringify(this.id));
        
        if(this.loaded) { throw('should not be loaded yet!'); }
        this.filename = filename;

        var $require = function () {
            return __require.apply(self, arguments);
        };
        
        var el = doc.createElement('script');
        el.onload = el.onerror = el.onreadystatechange = function () {
            if ((el.readyState && el.readyState !== "complete" &&
                 el.readyState !== "loaded") || self.loaded ){
                return false;
            }
            
            self.loaded = true;
            el.onload = el.onreadystatechange = null;

            var _run = function () {
                self.require = $require;
                var _fireNestedCb = function () {
                    var imports   = self.imports;
                    var importLen = imports.length;
                    if (importLen > 0){
                        for (var i = 0; i < importLen; i++){
                            var toImport = imports[i];
                            if (window[toImport]){
                                if (importLen == 1){
                                    self.exports = window[toImport];
                                } else {
                                    self.exports[toImport] = window[toImport];
                                }
                                delete [window[toImport]];
                            }
                        }
                    }

                    if (self.children.length) {
                        var childs = self.children;
                        var allcalled = true;
                        for (var y = 0; y < childs.length; y++){
                            if (!childs[y].fired) {
                                allcalled = false;
                                break;
                            }
                        }
                        if (!allcalled && !self.callNow) {
                            setTimeout(function () {
                                _fireNestedCb();
                            },25);
                            return;
                        }
                    }
                    if (!self.fired) {
                        for (var x = 0; x < self.cb.length; x++){
                            var _cb = self.cb[x];
                            if (typeof _cb === 'function') {
                                _cb(self.exports);
                            }
                        }
                        self.fired = true;
                    }
                };
                
                var definedObject = definedObjects.shift();
                if (definedObject) {
                    var callback = definedObject.cb;
                    var list = definedObject.list;
                    if (list.length) {
                        var e = [], nested = function () {
                            Array.prototype.push.apply( e, arguments );
                            if (list.length) {
                                var mid = list.shift();

                                var cb = list.length ? nested : function () {
                                    Array.prototype.push.apply( e, arguments );
                                    var args = [].concat(e);
                                    callback.apply(self, args);
                                    _fireNestedCb();
                                };
                                Module._load(mid, cb, self);
                            }
                        };
                        nested();
                        return;
                    }
                    callback.apply(self);
                }
                _fireNestedCb();
            };
            _run();
            return true;
        };
        el.async = true;
        if (require.noCache){
            el.src = filename + "?" + Date.now();
        } else {
            el.src = filename;
        }
        head.insertBefore(el, head.lastChild);
    };
    
    Module._load = function (request, cb, parent) {
        if (!cb){ cb = function(){}; }
        if (isArray(request)) {
            var e = [], nested = function () {
                Array.prototype.push.apply( e, arguments );
                if (request.length) {
                    var id = request.shift();
                    var callback = request.length ? nested : function () {
                        Array.prototype.push.apply( e, arguments );
                        cb.apply({}, e);
                    };
                    Module._load(id, callback, parent);
                }
            };
            nested();
            return e;
        }
        
        if (parent) {
            debug('Module._load REQUEST ' + (request) +
                  ' parent: ' + parent.id);
        }
        
        var obj = Module._resolveFilename(request, parent);
        var filename = obj.file;
        var imports  = obj.imports || [];
        var cachedModule = Module._cache[filename];
        if (cachedModule) {
            debug("Loading " + filename + " from cache");
            if (typeof cb === 'function') {
                if (cachedModule.fired === true) {
                    cb(cachedModule.exports);
                } else {
                    if (parent && parent.parent &&
                         parent.parent.id === cachedModule.id) {
                        
                        debug("WARNING: Circular Dependency Detected at " +
                                cachedModule.id + ' from ' + parent.id);

                        cb(cachedModule.exports);
                    } else {
                        cachedModule.cb.push(cb);
                    }
                }
            }
            return cachedModule.exports;
        }
        
        var module = new Module(filename, cb, parent);
        module.imports = imports;
        Module._cache[filename] = module;
        module.load(filename);
        return module.exports;
    };
    
    var require = function (path, cb) {
        return Module._load(path,cb);
    };
    
    require.Path = function (path) {
        var old = Global_Path;
        var self_path = isURL(path) ? '' : SELF_URL;
        Global_Path = resolveUri(path, self_path);
        debug("PATH: Change Global Path From " + old + " to " + Global_Path);
    };
    
    require.scriptr = true;
    require.noCache = false;
    require.debug = false;
    require.Register = function (obj) {
        for (var property in obj){
            if (obj.hasOwnProperty(property)) {
                Module._Native[property] = obj[property];
            }
        }
    };
    
    window.require = require;
}());
