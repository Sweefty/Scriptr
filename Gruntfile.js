module.exports = function(grunt) {
    
    //registering a local server running on port 9001
    grunt.registerTask('Server', 'Run Local Server', function() {
        require('./tests/server.js');
    });
    
    grunt.initConfig({
        // Load bower file
        bower: grunt.file.readJSON('bower.json'),
        // Remove obsolete files
        clean: {
            old: ['*.min.js']
        },
        
        qunit: {
            all: ['tests/*.html']
        },
        
        // Lint
        jshint: {
            library: ['scriptr.js'],
            options: {
                browser  : true,
                predef   : ['require', 'define', 'module', 'console'],
                boss     : true,
                curly    : true,
                eqnull   : true,
                newcap   : true,
                undef    : true,
                loopfunc : true,
                evil     : true,
                proto    : true,
                es3      : true,
            }
        },
        // Minify
        uglify: {
            library: {
                files: {
                    'scriptr-<%= bower.version %>.min.js': ['scriptr.js']
                }
            }
        }
    });
    
    //Load plugins
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    // Define tasks
    grunt.registerTask('test', ['Server', 'jshint', 'qunit']);
    grunt.registerTask('minify', ['jshint', 'clean', 'uglify']);
};
