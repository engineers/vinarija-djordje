module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        concat: {
            dist: {
                src: ['app/**/*.js'],
                dest: 'dist/<%= pkg.name %>.js'
            }
        },

        ngAnnotate: {
            options: {
                singleQuotes: true,
            },
            app: {
                files: [
                    {
                        'dist/<%= pkg.name %>.js': ['dist/<%= pkg.name %>.js']
                    },
                ],
            }
        },

        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= pkg.version %> <%= grunt.template.today("dd-mm-yyyy hh:mm:ss") %> */\n'
            },
            dist: {
                files: {
                    'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
                }
            }
        },

        clean: ['assets/style/bundle.css'],

        cssmin: {
            options: {
                shorthandCompacting: false,
                roundingPrecision: -1
            },
            target: {
                files: {
                    'assets/style/bundle.css': ['assets/style/main.css', 'assets/style/responsive.css']
                }
            }
        },

        usebanner: {
            taskName: {
                options: {
                    position: 'top',
                    banner: '/*! <%= pkg.name %> <%= pkg.version %> <%= grunt.template.today("dd-mm-yyyy hh:mm:ss") %> */\n'
                },
                files: {
                    src: ['assets/style/bundle.css']
                }
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-ng-annotate');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-banner');

    grunt.registerTask('default', ['concat', 'ngAnnotate', 'uglify', 'clean', 'cssmin', 'usebanner']);
};