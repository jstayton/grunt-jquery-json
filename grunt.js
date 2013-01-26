module.exports = function (grunt) {
  'use strict';

  grunt.initConfig({
    pkg: '<json:package.json>',
    lint: {
      files: ['grunt.js', 'tasks/*.js'] // test/*.js
    },
    test: {
      files: ['test/*.js']
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'default'
    },
    jshint: {
      options: {
        // Enforcing
        bitwise: true,
        camelcase: true,
        curly: true,
        eqeqeq: true,
        forin: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        noempty: true,
        nonew: true,
        quotmark: 'single',
        regexp: true,
        undef: true,
        unused: true,
        strict: true,
        trailing: true,
        maxlen: 120,
        // Relaxing
        boss: true,
        eqnull: true,
        sub: true,
        // Environment
        node: true,
        es5: true
      },
      globals: {}
    }
  });

  grunt.registerTask('default', 'lint'); // test

  grunt.loadTasks('tasks');
};
