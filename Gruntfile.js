module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks("grunt-extend-config");

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/* <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            }
        },
        cssmin: {
            options: {
                banner: '/** <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> **/'
            }
        },
        jshint: {
            options: {
                jshintrc: 'src/.jshintrc'
            },
            ignore_warning: {
                options: {
                    '-W014': true,
                    '-W102': true
                },
                src: ['src/**/*.js']
            }
        },

        concat: {
            options: {
                stripBanners: true
            }
        }
    });

    
    grunt.extendConfig({
        'jshint': {
            'all': [
                'src/js/*.js'
            ]
        },
        'watch': {
            'page': {
                files: [
                    'src/**/*'
                ],
                'tasks': ['page']
            }
        },
        'less': {
            'page': {
                files: {
                    'asset/css/main.css': 'src/css/main.less'
                }
            }
        },
        'cssmin': {
            'page': {
                files: {
                    'asset/css/main.css': 'asset/css/main.css'
                }
            }
        },
        'concat': {
            'page': {
                files: {
                    'asset/js/main.js': [
                        'src/js/common/Dialog.js',
                        'src/js/common/util.js',
                        'src/js/main.js',
                        'src/js/content.js'
                    ]
                }
            }
        },
        'uglify': {
            'options': {
                'mangle': {
                    'except': ['require', 'define', 'export']
                }
            },
            'page': {
                files: {
                    'asset/js/main.js': ['asset/js/main.js']
                }
            }
        },
        'clean': {
            'page': [
                'asset/js/main.js',
                'asset/css/main.css'
            ]
        }
    });


    // 通用模块 
    grunt.registerTask('page', [
        'less:page',
        'concat:page'
    ]);

    grunt.registerTask('page-release', [
        'less:page',
        'cssmin:page',
        'concat:page',
        'uglify:page'
    ]);

    grunt.registerTask('release', [
        'jshint:all',
        'page-release'
    ]);

    grunt.registerTask('default', 'Log some stuff.', function() {
        grunt.log.write('Logging some stuff...').ok();
    });


};