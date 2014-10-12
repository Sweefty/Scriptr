(function () {
    "use strict";

    var _window;
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
    })(), Clobal_Path = SELF_URL;
    
    function isArray (obj) {
        return Object.prototype.toString.call(obj) === "[object Array]";
    }
    
    function isURL (url) {
        if (/^(f|ht)tps?:\/\//i.test(url)) { return true; }
        return false;
    }
    
    function resolveUri (uri) {
        var resolved;
        a.href = uri;
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
    
    Module.prototype.require = function (path,cb) {
        return Module._load(path, cb, this);
    };
    
    Module._cache = {};
    Module._Native = {};
    Module._resolveFilename = function (request, parent) {
        var path = '';
        if (Module._Native[request]) {
            request = Module._Native[request];
            if (!isURL(request)) { path = Clobal_Path; }
        } else if (isURL(request)) {
            //nothing to do
        } else if (parent && parent.id) {
            path = resolveUri(parent.id + '/../');
        } else {
            path = Clobal_Path;
        }
        
        return resolveUri(path + request);
    };
    
    var definedObjects = [];
    window.define = function () {
        var args = [];
        Array.prototype.push.apply( args, arguments );
        var cb = args.pop();
        var requireList = [];
        if (typeof cb !== 'function') {
            throw("define must has a cb function as last argument");
        }
        
        if (isArray(args[0])) {
            requireList = args[0];
        }
        
        definedObjects.push({
            cb : cb,
            list : requireList
        });
    };
    
    Module.prototype.load = function (filename) {
        if (!_window) {
            _window = {};
            for (var prop in window) {
                if( window.hasOwnProperty( prop ) ) {
                    _window[prop] = 1;
                }
            }
        }

        var $this = this;
        debug('load ' + JSON.stringify(filename) +
              ' for module ' + JSON.stringify(this.id));
        
        if(this.loaded) { throw('should not be loaded yet!'); }
        this.filename = filename;

        var $require = function () {
            return $this.require.apply($this, arguments);
        };
        
        var el = doc.createElement('script');
        el.onload = el.onerror = el.onreadystatechange = function () {
            if ((el.readyState && el.readyState !== "complete" &&
                 el.readyState !== "loaded") || $this.loaded ){
                return false;
            }
            
            $this.loaded = true;
            el.onload = el.onreadystatechange = null;

            var _run = function () {
                var _fireNestedCb = function () {
                    for (var prop in window) {
                        if( window.hasOwnProperty( prop ) ) {
                            if (!_window[prop]){
                                try {
                                    var ex = window[prop];
                                    delete window[prop];
                                    $this.exports = ex;
                                } catch (e){}
                            }
                        }
                    }

                    if ($this.children.length) {
                        var childs = $this.children;
                        var allcalled = true;
                        for (var i = 0; i < childs.length; i++){
                            if (!childs[i].fired) {
                                allcalled = false;
                                break;
                            }
                        }
                        if (!allcalled && !$this.callNow) {
                            setTimeout(function () {
                                _fireNestedCb();
                            },25);
                            return;
                        }
                    }
                    if (!$this.fired) {
                        for (var x = 0; x < $this.cb.length; x++){
                            var _cb = $this.cb[x];
                            if (typeof _cb === 'function') {
                                _cb($this.exports);
                            }
                        }
                        $this.fired = true;
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
                                    var args = [$require, $this.exports].concat(e);
                                    callback.apply($this, args);
                                    _fireNestedCb();
                                };
                                Module._load(mid,cb,$this);
                            }
                        };
                        nested();
                        return;
                    }
                    callback.apply($this, [$require, $this.exports]);
                }
                _fireNestedCb();
            };
            _run();
            return true;
        };
        el.async = true;
        el.src = filename;
        head.insertBefore(el, head.lastChild);
    };
    
    Module._load = function (request, cb, parent) {
        if (isArray(request)) {
            var e = [], nested = function () {
                Array.prototype.push.apply( e, arguments );
                if (request.length) {
                    var id = request.shift();
                    var callback = request.length ? nested : function () {
                        Array.prototype.push.apply( e, arguments );
                        cb.apply({}, e);
                    };
                    Module._load(id,callback,parent);
                }
            };
            nested();
            return e;
        }
        
        if (parent) {
            debug('Module._load REQUEST ' + (request) +
                  ' parent: ' + parent.id);
        }
        
        var filename = Module._resolveFilename(request, parent);
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
        Module._cache[filename] = module;
        module.load(filename);
        return module.exports;
    };
    
    var require = function (path, cb) {
        return Module._load(path,cb);
    };
    
    require.Path = function (path) {
        var old = Clobal_Path;
        var self_path = isURL(path) ? '' : SELF_URL;
        Clobal_Path = resolveUri(self_path + path);
        debug("PATH: Change Global Path From " + old + " to " + Clobal_Path);
    };
    
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
