/*jshint immed:false*/
/*global describe:true, it:true*/

var grunt = require('grunt');

require('should');

grunt.loadTasks('tasks');

describe('jquery-json', function () {
  'use strict';

  var pkg = require('./fixtures/package.json'),
      config = {};

  describe('helper', function () {
    describe('get-jquery-json', function () {
      it('should return an object', function () {
        var jqueryJson = grunt.helper('get-jquery-json', pkg, config);

        jqueryJson.should.be.a('object');
      });

      it('should require a "pkg" argument', function () {
        (function () {
          grunt.helper('get-jquery-json');
        }).should.throwError();
      });

      it('should not require a "config" argument', function () {
        var jqueryJson = grunt.helper('get-jquery-json', pkg);

        jqueryJson.should.be.a('object');
      });

      it('should include required fields', function () {
        var jqueryJson = grunt.helper('get-jquery-json', pkg, config);

        jqueryJson.should.have.property('name', 'testplugin');
        jqueryJson.should.have.property('version', '1.2.3');
        jqueryJson.should.have.property('title', 'jQuery Test Plugin');
        jqueryJson.should.have.property('author').and.have.keys('name');
        jqueryJson.should.have.property('licenses').and.have.length(1);
        jqueryJson.should.have.property('dependencies').and.have.keys('jquery');
      });

      it('should include optional fields', function () {
        var jqueryJson = grunt.helper('get-jquery-json', pkg, config);

        jqueryJson.should.have.property('description', 'A jQuery plugin for testing.');
        jqueryJson.should.have.property('keywords').and.have.length(3);
        jqueryJson.should.have.property('homepage', 'https://github.com/tauthor/jquery-testplugin');
        jqueryJson.should.have.property('docs', 'https://github.com/tauthor/jquery-testplugin/blob/master/README.md');
        jqueryJson.should.have.property('demo', 'http://tauthor.github.com/jquery-testplugin');
        jqueryJson.should.have.property('download', 'http://tauthor.github.com/jquery-testplugin/latest.zip');
        jqueryJson.should.have.property('bugs', 'https://github.com/tauthor/jquery-testplugin/issues');
        jqueryJson.should.have.property('maintainers').and.have.length(1);
      });

      it('should exclude unused fields', function () {
        var jqueryJson = grunt.helper('get-jquery-json', pkg, config);

        jqueryJson.should.not.have.property('unused');
      });

      it('should overwrite "pkg" values with "config" values', function () {
        var config = {
              title: 'Different Plugin Name',
              description: 'A different description.'
            },
            jqueryJson = grunt.helper('get-jquery-json', pkg, config);

        jqueryJson.should.have.property('title', 'Different Plugin Name');
        jqueryJson.should.have.property('description', 'A different description.');
      });

      it('should remove "jquery" from the "name" field', function () {
        var jqueryJson = grunt.helper('get-jquery-json', pkg, config);

        jqueryJson.should.have.property('name', 'testplugin');
      });
    });
  });
});
