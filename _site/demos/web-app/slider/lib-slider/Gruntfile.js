'use strict';

module.exports = function (grunt) {
    // Project configuration.
    grunt.config.init({
        pkg: grunt.file.readJSON('package.json'),
        assetsPath: 'assets',
        srcPath: 'src',
        libPath: 'lib',
        distPath: 'build',
        
        copy : {
            main: {
                files: [{
                    expand: true,
                    cwd: './',
                    src: ['package.json'],
                    dest: '<%= distPath %>'
                }]
            }
        },

        depconcat: {
            main: {
                src: ['<%= srcPath%>/slider.js'],
                dest: '<%= distPath%>/slider.debug.js'
            },
            main2: {
                src: ['<%= srcPath%>/slider.nozepto.js'],
                dest: '<%= distPath%>/slider.nozepto.js'
            }
        },

        uglify: {
            main:{
                files: [{
                    expand: true,
                    cwd: '<%= distPath%>',
                    src: ['*.debug.js'],
                    dest: '<%= distPath %>',
                    ext: '.js'
                }]
            },
            main2:{
                files: [{
                    expand: true,
                    cwd: '<%= distPath%>',
                    src: ['*.nozepto.js'],
                    dest: '<%= distPath %>',
                    ext: '.nz.js'
                }]
            }
        },

        
        depcombo: {
            main: {
                options: {
                  useDebug: false,
                  useDaily: true,
                  output: 'url'
                },
                dest: '<%= distPath%>/combo.js'
            }
        }
    });

    // grunt plugins
    grunt.loadNpmTasks('grunt-depconcat');
    grunt.loadNpmTasks('grunt-depcombo');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Default grunt
    grunt.registerTask('default', ['copy', 'depconcat', 'uglify', 'depcombo']);

};