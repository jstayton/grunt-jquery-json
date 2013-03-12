/*jshint immed:false, regexp:false*/
/*global describe:true, it:true, afterEach:true*/

var grunt = require('grunt'),
    fs = require('fs');

require('should');

grunt.loadTasks('tasks');

describe('jquery-json', function () {
  'use strict';

  var pkg = require('./fixtures/testplugin.jquery.json'),
      config = {};

  describe('helper', function () {
    describe('build-jquery-json', function () {
      it('should return an object when no "stringify" argument', function () {
        grunt.helper('build-jquery-json', pkg, config).should.be.a('object');
      });

      it('should return an object when "stringify" is "false"', function () {
        grunt.helper('build-jquery-json', pkg, config, false).should.be.a('object');
      });

      it('should return JSON when "stringify" is "true"', function () {
        (function () {
          JSON.parse(grunt.helper('build-jquery-json', pkg, config, true));
        }).should.not.throwError();
      });

      it('should require a "pkg" argument', function () {
        (function () {
          grunt.helper('build-jquery-json');
        }).should.throwError();
      });

      it('should not require a "config" argument', function () {
        (function () {
          grunt.helper('build-jquery-json', pkg);
        }).should.not.throwError();
      });

      it('should include required fields', function () {
        var manifest = grunt.helper('build-jquery-json', pkg, config);

        manifest.should.have.property('name', 'testplugin');
        manifest.should.have.property('version', '1.2.3');
        manifest.should.have.property('title', 'jQuery Test Plugin');
        manifest.should.have.property('author').and.eql({ name: 'Test Author' });
        manifest.should.have.property('licenses').and.eql([{ type: 'MIT',
                                                             url: 'http://opensource.org/licenses/MIT' }]);
        manifest.should.have.property('dependencies').and.eql({ jquery: '1.4.3' });
      });

      it('should include optional fields', function () {
        var manifest = grunt.helper('build-jquery-json', pkg, config);

        manifest.should.have.property('description', 'A jQuery plugin for testing.');
        manifest.should.have.property('keywords').and.eql(['jquery', 'test', 'plugin']);
        manifest.should.have.property('homepage', 'https://github.com/tauthor/jquery-testplugin');
        manifest.should.have.property('docs', 'https://github.com/tauthor/jquery-testplugin/blob/master/README.md');
        manifest.should.have.property('demo', 'http://tauthor.github.com/jquery-testplugin');
        manifest.should.have.property('download', 'http://tauthor.github.com/jquery-testplugin/latest.zip');
        manifest.should.have.property('bugs', 'https://github.com/tauthor/jquery-testplugin/issues');
        manifest.should.have.property('maintainers').and.eql([{ name: 'Test Maintainer',
                                                                email: 'test@jquerymaintainer.net',
                                                                url: 'http://jquerymaintainer.net' }]);
      });

      it('should exclude unused fields', function () {
        var manifest = grunt.helper('build-jquery-json', pkg, config);

        manifest.should.not.have.property('unused');
      });

      it('should overwrite "pkg" values with "config" values', function () {
        var config = {
              title: 'Different Plugin Name',
              description: 'A different description.'
            },
            manifest = grunt.helper('build-jquery-json', pkg, config);

        manifest.should.have.property('title', 'Different Plugin Name');
        manifest.should.have.property('description', 'A different description.');
      });

      it('should remove "jquery" from the "name" field', function () {
        var manifest = grunt.helper('build-jquery-json', pkg, config);

        manifest.should.have.property('name', 'testplugin');
      });
    });

    describe('build-jquery-json-file', function () {
      afterEach(function () {
        if (fs.existsSync('./testplugin.jquery.json')) {
          fs.unlinkSync('./testplugin.jquery.json');
        }
      });

      it('should return "true" on success', function () {
        grunt.helper('build-jquery-json-file', pkg, config).should.equal(true);
      });

      it('should return "false" when no "name" field', function () {
        grunt.helper('build-jquery-json-file', {}).should.equal(false);
      });

      it('should write a file using the "name" field for the file name', function () {
        grunt.helper('build-jquery-json-file', pkg, config);

        fs.existsSync('./testplugin.jquery.json').should.equal(true);
      });

      it('should write a file with valid JSON', function () {
        grunt.helper('build-jquery-json-file', pkg, config);

        (function () {
          var manifest = JSON.parse(grunt.file.read('testplugin.jquery.json'));

          manifest.should.be.a('object').and.have.property('name', 'testplugin');
        }).should.not.throwError();
      });
    });

    describe('validate-jquery-json', function () {
      var buildAndValidate = function (pkg, config) {
            return grunt.helper('validate-jquery-json', grunt.helper('build-jquery-json', pkg, config, true));
          },
          buildManifest = function (field, value, customManifest) {
            var manifest = {};

            if (customManifest) {
              manifest = customManifest;
            }
            else {
              manifest[field] = value;
            }

            return manifest;
          },
          itShouldBeValid = function (field, manifest) {
            it('should be valid', function () {
              buildAndValidate(manifest).should.not.have.property(field);
            });
          },
          itShouldBeInvalid = function (shouldText, regex, field, value, customManifest) {
            it(shouldText, function () {
              var manifest = buildManifest(field, value, customManifest),
                  errors = buildAndValidate(manifest);
              
              errors.should.have.property(field);
              errors[field][0].should.match(regex);
            });
          },
          itShouldBeRequired = function (field, customManifest) {
            it('should be required', function () {
              var errors = buildAndValidate(customManifest || {});
              
              errors.should.have.property(field);
              errors[field][0].should.match(/^Required/);
            });
          },
          itShouldNotBeRequired = function (field) {
            it('should not be required', function () {
              buildAndValidate({}).should.not.have.property(field);
            });
          },
          itShouldBeAString = function (field, manifest) {
            itShouldBeInvalid('should be a string', /^Invalid type:.*?must be a string$/, field, 123, manifest);
          },
          itShouldBeAnObject = function (field, manifest) {
            itShouldBeInvalid('should be an object', /^Invalid type:.*?must be an object$/, field, 'invalid', manifest);
          },
          itShouldBeAnArray = function (field, manifest) {
            itShouldBeInvalid('should be an array', /^Invalid type:.*?must be an array$/, field, 'invalid', manifest);
          },
          itShouldBeALimitedCharset = function (field, manifest) {
            itShouldBeInvalid('should be a limited character set', /^Invalid character/, field, '!@#', manifest);
          },
          itShouldBeAnEmail = function (field, manifest) {
            itShouldBeInvalid('should be an email', /^Invalid email/, field, 'invalid', manifest);
          },
          itShouldBeAUrl = function (field, manifest) {
            itShouldBeInvalid('should be a URL', /^Invalid URL/, field, 'invalid', manifest);
          },
          itShouldBeASemVer = function (field, manifest) {
            itShouldBeInvalid('should be a semantic version number',
                              /^Invalid semantic version number/,
                              field, 'invalid', manifest);
          };

      it('should return "true" when valid', function () {
        buildAndValidate(pkg, config).should.equal(true);
      });

      it('should return an object when there are errors', function () {
        grunt.helper('validate-jquery-json', 'invalid').should.be.a('object');
      });

      it('should return an error if the JSON is invalid', function () {
        grunt.helper('validate-jquery-json', 'invalid')
          .should.have.property('json')
          .and.eql(['Invalid JSON']);
      });

      describe('"name" field', function () {
        itShouldBeRequired('name');
        itShouldBeAString('name');
        itShouldBeALimitedCharset('name');
        itShouldBeValid('name', { name: 'abc123_.-' });
      });

      describe('"version" field', function () {
        itShouldBeRequired('version');
        itShouldBeAString('version');
        itShouldBeASemVer('version');
        itShouldBeValid('version', { version: '1.2.3' });
      });

      describe('"title" field', function () {
        itShouldBeRequired('title');
        itShouldBeAString('title');
        itShouldBeValid('title', { title: 'valid' });
      });

      describe('"author" field', function () {
        itShouldBeRequired('author');
        itShouldBeAnObject('author');

        describe('"name" field', function () {
          itShouldBeRequired('author', { author: {} });
          itShouldBeAString('author', { author: { name: 123 } });
          itShouldBeValid('author', { author: { name: 'valid' } });
        });

        describe('"email" field', function () {
          itShouldBeAString('author', { author: { name: 'valid', email: 123 }});
          itShouldBeAnEmail('author', { author: { name: 'valid', email: 'invalid' }});
          itShouldBeValid('author', { author: { name: 'valid', email: 'valid@valid.com' }});
        });

        describe('"url" field', function () {
          itShouldBeAString('author', { author: { name: 'valid', url: 123 }});
          itShouldBeAUrl('author', { author: { name: 'valid', url: 'invalid' }});
          itShouldBeValid('author', { author: { name: 'valid', url: 'http://valid.com' }});
        });
      });

      describe('"licenses" field', function () {
        itShouldBeRequired('licenses');
        itShouldBeAnArray('licenses');

        it('should have at least one element', function () {
          buildAndValidate({ licenses: [] })
            .should.have.property('licenses')
            .and.eql(['Invalid length: must be at least one']);
        });

        describe('license', function () {
          itShouldBeAnObject('licenses', { licenses: ['invalid'] });

          describe('"url" field', function () {
            itShouldBeRequired('licenses', { licenses: [{}] });
            itShouldBeAString('licenses', { licenses: [{ url: 123 }] });
            itShouldBeAUrl('licenses', { licenses: [{ url: 'invalid' }] });
            itShouldBeValid('licenses', { licenses: [{ url: 'http://valid.com' }] });
          });

          describe('"type" field', function () {
            itShouldBeAString('licenses', { licenses: [{ url: 'http://valid.com', type: 123 }] });
            itShouldBeValid('licenses', { licenses: [{ url: 'http://valid.com', type: 'valid' }] });
          });
        });
      });

      describe('"dependencies" field', function () {
        itShouldBeRequired('dependencies');
        itShouldBeAnObject('dependencies');

        describe('dependency', function () {
          it('should require "jquery"', function () {
            buildAndValidate({ dependencies: {} })
              .should.have.property('dependencies')
              .and.eql(['Missing required dependency: `jquery`']);
          });

          itShouldBeAString('dependencies', { dependencies: { jquery: 123 } });
          itShouldBeASemVer('dependencies', { dependencies: { jquery: 'invalid' } });
          itShouldBeValid('dependencies', { dependencies: { jquery: '1.2.3' } });
        });
      });

      describe('"description" field', function () {
        itShouldNotBeRequired('description');
        itShouldBeAString('description');
        itShouldBeValid('description', { description: 'valid' });
      });

      describe('"keywords" field', function () {
        itShouldNotBeRequired('keywords');
        itShouldBeAnArray('keywords');

        describe('keyword', function () {
          itShouldBeAString('keywords', { keywords: [123] });
          itShouldBeALimitedCharset('keywords', { keywords: ['!@#'] });
          itShouldBeValid('keywords', { keywords: ['abc123.-'] });
        });
      });

      describe('"homepage" field', function () {
        itShouldNotBeRequired('homepage');
        itShouldBeAString('homepage');
        itShouldBeAUrl('homepage');
        itShouldBeValid('homepage', { bugs: 'http://valid.com' });
      });

      describe('"docs" field', function () {
        itShouldNotBeRequired('docs');
        itShouldBeAString('docs');
        itShouldBeAUrl('docs');
        itShouldBeValid('docs', { bugs: 'http://valid.com' });
      });

      describe('"demo" field', function () {
        itShouldNotBeRequired('demo');
        itShouldBeAString('demo');
        itShouldBeAUrl('demo');
        itShouldBeValid('demo', { bugs: 'http://valid.com' });
      });

      describe('"download" field', function () {
        itShouldNotBeRequired('download');
        itShouldBeAString('download');
        itShouldBeAUrl('download');
        itShouldBeValid('download', { bugs: 'http://valid.com' });
      });

      describe('"bugs" field', function () {
        itShouldNotBeRequired('bugs');
        itShouldBeAString('bugs');
        itShouldBeAUrl('bugs');
        itShouldBeValid('bugs', { bugs: 'http://valid.com' });
      });

      describe('"maintainers" field', function () {
        itShouldNotBeRequired('maintainers');
        itShouldBeAnArray('maintainers');

        describe('maintainer', function () {
          itShouldBeAnObject('maintainers', { maintainers: ['invalid'] });

          describe('"name" field', function () {
            itShouldBeRequired('maintainers', { maintainers: [{}] });
            itShouldBeAString('maintainers', { maintainers: [{ name: 123 }] });
            itShouldBeValid('maintainers', { maintainers: [{ name: 'valid' }] });
          });

          describe('"email" field', function () {
            itShouldBeAString('maintainers', { maintainers: [{ name: 'valid', email: 123 }] });
            itShouldBeAnEmail('maintainers', { maintainers: [{ name: 'valid', email: 'invalid' }] });
            itShouldBeValid('maintainers', { maintainers: [{ name: 'valid', email: 'valid@valid.com' }] });
          });

          describe('"url" field', function () {
            itShouldBeAString('maintainers', { maintainers: [{ name: 'valid', url: 123 }] });
            itShouldBeAUrl('maintainers', { maintainers: [{ name: 'valid', url: 'invalid' }] });
            itShouldBeValid('maintainers', { maintainers: [{ name: 'valid', url: 'http://valid.com' }] });
          });
        });
      });
    });

    describe('validate-jquery-json-file', function () {
      it('should return "true" when valid', function () {
        grunt.helper('validate-jquery-json-file', 'test/fixtures/testplugin.jquery.json').should.equal(true);
      });

      it('should return an object when invalid', function () {
        grunt.helper('validate-jquery-json-file', 'test/fixtures/invalid.jquery.json').should.be.a('object');
      });

      it('should return "false" when file cannot be found', function () {
        grunt.helper('validate-jquery-json-file', 'test/fixtures/non-existent.jquery.json').should.equal(false);
      });

      it('should return "false" when more than one file is found', function () {
        grunt.helper('validate-jquery-json-file', 'test/fixtures/*.jquery.json').should.equal(false);
      });
    });
  });
});
