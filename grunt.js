module.exports = function (grunt) {
  'use strict';

  grunt.initConfig({
    pkg: '<json:package.json>',
    meta: {
      banner: '/*!\n' +
              ' * <%= pkg.name %> v<%= pkg.version %>\n' +
              ' *\n' +
              ' * <%= pkg.description %>\n' +
              ' *\n' +
              ' * <%= pkg.homepage %>\n' +
              ' *\n' +
              ' * Copyright <%= grunt.template.today("yyyy") %> by <%= pkg.author.name %>\n' +
              ' * Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>\n' +
              ' */'
    },
    concat: {
      tasks: {
        src: ['<banner>', '<file_strip_banner:tasks/jquery-json.js:block>'],
        dest: 'tasks/jquery-json.js',
        separator: ''
      }
    },
    lint: {
      files: ['grunt.js', 'tasks/**/*.js', 'test/**/*.js']
    },
    simplemocha: {
      all: {
        src: 'test/**/*.js'
      }
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
      globals: {
        describe: true,
        it: true
      }
    }
  });

  grunt.registerTask('test', 'simplemocha');
  grunt.registerTask('default', 'lint test concat');

  grunt.loadTasks('tasks');
  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-simple-mocha');
};
