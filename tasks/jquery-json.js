/*!
 * grunt-jquery-json v0.2.0
 *
 * Grunt plugin that builds and validates a jquery.json package manifest.
 *
 * https://github.com/jstayton/grunt-jquery-json
 *
 * Copyright 2013 by Justin Stayton
 * Licensed MIT
 */
module.exports = function (grunt) {
  'use strict';

  var semver = require('semver'),
      jQueryJson = {};

  // Required and optional package manifest fields as defined by the jQuery
  // Plugin Registry: http://plugins.jquery.com/docs/package-manifest/
  jQueryJson.fields = {
    name: {
      required: true,
      validate: function (manifest) {
        var errors = [];

        if (!manifest.name) {
          errors.push('Required');
        }
        else if (!jQueryJson.isString(manifest.name)) {
          errors.push('Invalid type: must be a string');
        }
        else if (!(/^[a-z0-9_\.\-]+$/i).test(manifest.name)) {
          errors.push('Invalid character(s): must be alphanumeric, underscore, period, or dash');
        }

        return errors.length ? errors : true;
      }
    },
    version: {
      required: true,
      validate: function (manifest) {
        var errors = [];

        if (!manifest.version) {
          errors.push('Required');
        }
        else if (!jQueryJson.isString(manifest.version)) {
          errors.push('Invalid type: must be a string');
        }
        else if (!semver.valid(manifest.version)) {
          errors.push('Invalid semantic version number');
        }

        return errors.length ? errors : true;
      }
    },
    title: {
      required: true,
      validate: function (manifest) {
        var errors = [];

        if (!manifest.title) {
          errors.push('Required');
        }
        else if (!jQueryJson.isString(manifest.title)) {
          errors.push('Invalid type: must be a string');
        }

        return errors.length ? errors : true;
      }
    },
    author: {
      required: true,
      validate: function (manifest) {
        var errors = [];

        if (!manifest.author) {
          errors.push('Required');
        }
        else if (!jQueryJson.isObject(manifest.author)) {
          errors.push('Invalid type: must be an object');
        }
        else if (!manifest.author.name) {
          errors.push('Required: `name`');
        }
        else if (!jQueryJson.isString(manifest.author.name)) {
          errors.push('Invalid type: `name` must be a string');
        }
        else {
          if ('email' in manifest.author) {
            if (!jQueryJson.isString(manifest.author.email)) {
              errors.push('Invalid type: `email` must be a string');
            }
            else if (!jQueryJson.isValidEmail(manifest.author.email)) {
              errors.push('Invalid email: `email`');
            }
          }

          if ('url' in manifest.author) {
            if (!jQueryJson.isString(manifest.author.url)) {
              errors.push('Invalid type: `url` must be a string');
            }
            else if (!jQueryJson.isValidUrl(manifest.author.url)) {
              errors.push('Invalid URL: `url`');
            }
          }
        }

        return errors.length ? errors : true;
      }
    },
    licenses: {
      required: true,
      validate: function (manifest) {
        var errors = [];

        if (!manifest.licenses) {
          errors.push('Required');
        }
        else if (!Array.isArray(manifest.licenses)) {
          errors.push('Invalid type: must be an array');
        }
        else if (!manifest.licenses.length) {
          errors.push('Invalid length: must be at least one');
        }
        else {
          manifest.licenses.forEach(function (license, i) {
            if (!jQueryJson.isObject(license)) {
              errors.push('Invalid type: `licenses[' + i + ']` must be an object');
            }
            else if (!license.url) {
              errors.push('Required: `url` in `licenses[' + i + ']`');
            }
            else if (!jQueryJson.isString(license.url)) {
              errors.push('Invalid type: `url` in `licenses[' + i + ']` must be a string');
            }
            else if (!jQueryJson.isValidUrl(license.url)) {
              errors.push('Invalid URL: `url` in `licenses[' + i + ']`');
            }
            else {
              if ('type' in license) {
                if (!jQueryJson.isString(license.type)) {
                  errors.push('Invalid type: `type` in `licenses[' + i + ']` must be a string');
                }
              }
            }
          });
        }

        return errors.length ? errors : true;
      }
    },
    dependencies: {
      required: true,
      validate: function (manifest) {
        var errors = [];

        if (!manifest.dependencies) {
          errors.push('Required');
        }
        else if (!jQueryJson.isObject(manifest.dependencies)) {
          errors.push('Invalid type: must be an object');
        }
        else {
          if (!manifest.dependencies.jquery) {
            errors.push('Missing required dependency: `jquery`');
          }

          Object.keys(manifest.dependencies).forEach(function (dependency) {
            if (!jQueryJson.isString(manifest.dependencies[dependency])) {
              errors.push('Invalid type: `dependencies[' + dependency + ']` must be a string');
            }
            else if (!semver.validRange(manifest.dependencies[dependency])) {
              errors.push('Invalid semantic version number: `dependencies[' + dependency + ']`');
            }
          });
        }

        return errors.length ? errors : true;
      }
    },
    description: {
      required: false,
      validate: function (manifest) {
        var errors = [];

        if ('description' in manifest) {
          if (!jQueryJson.isString(manifest.description)) {
            errors.push('Invalid type: must be a string');
          }
        }

        return errors.length ? errors : true;
      }
    },
    keywords: {
      required: false,
      validate: function (manifest) {
        var errors = [];

        if ('keywords' in manifest) {
          if (!Array.isArray(manifest.keywords)) {
            errors.push('Invalid type: must be an array');
          }
          else {
            manifest.keywords.forEach(function (keyword, i) {
              if (!jQueryJson.isString(keyword)) {
                errors.push('Invalid type: `keywords[' + i + ']` must be a string');
              }
              else if (!(/^[a-z0-9\.\-]+$/i).test(keyword)) {
                errors.push('Invalid character(s): `keywords[' + i + ']` must be alphanumeric, period, or dash');
              }
            });
          }
        }

        return errors.length ? errors : true;
      }
    },
    homepage: {
      required: false,
      validate: function (manifest) {
        var errors = [];

        if ('homepage' in manifest) {
          if (!jQueryJson.isString(manifest.homepage)) {
            errors.push('Invalid type: must be a string');
          }
          else if (!jQueryJson.isValidUrl(manifest.homepage)) {
            errors.push('Invalid URL');
          }
        }

        return errors.length ? errors : true;
      }
    },
    docs: {
      required: false,
      validate: function (manifest) {
        var errors = [];

        if ('docs' in manifest) {
          if (!jQueryJson.isString(manifest.docs)) {
            errors.push('Invalid type: must be a string');
          }
          else if (!jQueryJson.isValidUrl(manifest.docs)) {
            errors.push('Invalid URL');
          }
        }

        return errors.length ? errors : true;
      }
    },
    demo: {
      required: false,
      validate: function (manifest) {
        var errors = [];

        if ('demo' in manifest) {
          if (!jQueryJson.isString(manifest.demo)) {
            errors.push('Invalid type: must be a string');
          }
          else if (!jQueryJson.isValidUrl(manifest.demo)) {
            errors.push('Invalid URL');
          }
        }

        return errors.length ? errors : true;
      }
    },
    download: {
      required: false,
      validate: function (manifest) {
        var errors = [];

        if ('download' in manifest) {
          if (!jQueryJson.isString(manifest.download)) {
            errors.push('Invalid type: must be a string');
          }
          else if (!jQueryJson.isValidUrl(manifest.download)) {
            errors.push('Invalid URL');
          }
        }

        return errors.length ? errors : true;
      }
    },
    bugs: {
      required: false,
      validate: function (manifest) {
        var errors = [];

        if ('bugs' in manifest) {
          if (!jQueryJson.isString(manifest.bugs)) {
            errors.push('Invalid type: must be a string');
          }
          else if (!jQueryJson.isValidUrl(manifest.bugs)) {
            errors.push('Invalid URL');
          }
        }

        return errors.length ? errors : true;
      }
    },
    maintainers: {
      required: false,
      validate: function (manifest) {
        var errors = [];

        if ('maintainers' in manifest) {
          if (!Array.isArray(manifest.maintainers)) {
            errors.push('Invalid type: must be an array');
          }
          else {
            manifest.maintainers.forEach(function (maintainer, i) {
              if (!jQueryJson.isObject(maintainer)) {
                errors.push('Invalid type: `maintainers[' + i + ']` must be an object');
              }
              else if (!maintainer.name) {
                errors.push('Required: `name` in `maintainers[' + i + ']`');
              }
              else if (!jQueryJson.isString(maintainer.name)) {
                errors.push('Invalid type: `name` in `maintainers[' + i + ']` must be a string');
              }
              else {
                if ('email' in maintainer) {
                  if (!jQueryJson.isString(maintainer.email)) {
                    errors.push('Invalid type: `email` in `maintainers[' + i + ']` must be a string');
                  }
                  else if (!jQueryJson.isValidEmail(maintainer.email)) {
                    errors.push('Invalid email: `email` in `maintainers[' + i + ']`');
                  }
                }

                if ('url' in maintainer) {
                  if (!jQueryJson.isString(maintainer.url)) {
                    errors.push('Invalid type: `url` in `maintainers[' + i + ']` must be a string');
                  }
                  else if (!jQueryJson.isValidUrl(maintainer.url)) {
                    errors.push('Invalid URL: `url` in `maintainers[' + i + ']`');
                  }
                }
              }
            });
          }
        }

        return errors.length ? errors : true;
      }
    }
  };

  // Get all required and optional package manifest fields.
  jQueryJson.getFields = function () {
    return Object.keys(this.fields);
  };

  // Check whether a field is used in the package manifest.
  jQueryJson.isField = function (field) {
    return !!this.fields[field];
  };

  // Check whether a field is required in the package manifest.
  jQueryJson.isFieldRequired = function (field) {
    return this.fields[field] && this.fields[field].required;
  };

  // Check whether a field is optional in the package manifest.
  jQueryJson.isFieldOptional = function (field) {
    return this.fields[field] && !this.fields[field].required;
  };

  // Check whether a field value is valid in a package manifest.
  jQueryJson.isFieldValid = function (field, manifest) {
    return this.fields[field] && this.fields[field].validate(manifest);
  };

  // Log the validation results of a package manifest.
  jQueryJson.logValidation = function (manifest, errors) {
    var fields = Object.keys(errors);

    if (fields.length) {
      fields.forEach(function (field) {
        grunt.log.subhead(field);

        errors[field].forEach(function (error) {
          grunt.log.error(error);
        });
      });
    }
    else {
      grunt.log.ok('Valid');
    }

    return true;
  };

  // Remove any form of 'jquery' from the beginning of the name, as recommended
  // by the jQuery Plugin Registry.
  jQueryJson.cleanName = function (name) {
    return name.replace(/^jquery[\-\. ]?/i, '');
  };

  // Get the package manifest file name to write to.
  jQueryJson.jsonFileName = function (name) {
    return name + '.jquery.json';
  };

  // Check whether a variable is a string.
  jQueryJson.isString = function (variable) {
    return Object.prototype.toString.call(variable) === '[object String]';
  };

  // Check whether a variable is a true object.
  jQueryJson.isObject = function (variable) {
    return Object.prototype.toString.call(variable) === '[object Object]';
  };

  // Check whether a URL is valid.
  jQueryJson.isValidUrl = function (url) {
    // Source: http://mathiasbynens.be/demo/url-regex
    //         https://gist.github.com/dperini/729294
    var regex = new RegExp(
      '^' +
        '(?:(?:https?|ftp)://)' +
        '(?:\\S+(?::\\S*)?@)?' +
        '(?:' +
          '(?!10(?:\\.\\d{1,3}){3})' +
          '(?!127(?:\\.\\d{1,3}){3})' +
          '(?!169\\.254(?:\\.\\d{1,3}){2})' +
          '(?!192\\.168(?:\\.\\d{1,3}){2})' +
          '(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})' +
          '(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])' +
          '(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}' +
          '(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))' +
        '|' +
          '(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)' +
          '(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*' +
          '(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))' +
        ')' +
        '(?::\\d{2,5})?' +
        '(?:/[^\\s]*)?' +
      '$', 'i'
    );

    return regex.test(url);
  };

  // Check whether an email is valid.
  jQueryJson.isValidEmail = function (email) {
    // Source: http://plugins.jquery.com/resources/validate.js
    return (/^[a-zA-Z0-9.!#$%&'*+\/=?\^_`{|}~\-]+@[a-zA-Z0-9\-]+(?:\.[a-zA-Z0-9\-]+)*$/).test(email);
  };

  // Convert a package manifest object to a JSON string.
  jQueryJson.stringify = function (manifest) {
    return JSON.stringify(manifest, null, 2);
  };

  // Build a package manifest as JSON from package.json and `jqueryjson` config
  // values.
  jQueryJson.build = function (pkg, config, stringify) {
    var self = this,
        manifest = {};

    // Loop over all of the `pkg` fields and add those that jquery.json uses.
    Object.keys(pkg).forEach(function (field) {
      if (self.isField(field)) {
        manifest[field] = pkg[field];
      }
    });

    // Loop over all of the `jqueryjson` config fields and add those that
    // jquery.json uses. This allows for values not specified in `pkg`.
    if (self.isObject(config)) {
      Object.keys(config).forEach(function (field) {
        if (self.isField(field)) {
          manifest[field] = config[field];
        }
      });
    }

    // Remove any form of 'jquery' from the beginning of the name.
    if (self.isString(manifest.name)) {
      manifest.name = self.cleanName(manifest.name);
    }

    return stringify ? self.stringify(manifest) : manifest;
  };

  // Validate a package manifest. Returns `true` or an object with each invalid
  // field as a key, with the value being an array of errors.
  jQueryJson.validate = function (manifest, log) {
    var self = this,
        fields = self.getFields(),
        errors = {};

    // Try parsing the manifest as valid JSON.
    try {
      manifest = JSON.parse(manifest);

      fields.forEach(function (field) {
        var fieldErrors = self.isFieldValid(field, manifest);

        if (fieldErrors.length) {
          errors[field] = fieldErrors;
        }
      });
    }
    catch (e) {
      errors.json = ['Invalid JSON'];
    }

    if (log) {
      self.logValidation(manifest, errors);
    }

    return Object.keys(errors).length ? errors : true;
  };

  // Task that builds and validates a jquery.json package manifest file from
  // package.json and `jqueryjson` config values.
  grunt.registerTask('jquery-json', 'Builds and validates a jquery.json package manifest file.', function () {
    this.requiresConfig('pkg');

    grunt.helper('build-jquery-json-file', grunt.config('pkg'), grunt.config('jqueryjson'));

    grunt.helper('validate-jquery-json-file', null, true);
  });

  // Task that validates a jquery.json package manifest file in the directory
  // where grunt.js resides.
  grunt.registerTask('validate-jquery-json', 'Validates a jquery.json package manifest file.', function () {
    grunt.helper('validate-jquery-json-file', null, true);
  });

  // Helper that builds a package manifest from package.json and `jqueryjson`
  // config values.
  grunt.registerHelper('build-jquery-json', function (pkg, config, stringify) {
    return jQueryJson.build(pkg, config, stringify);
  });

  // Helper that builds and writes a package manifest to a jquery.json file from
  // package.json and `jqueryjson` config values.
  grunt.registerHelper('build-jquery-json-file', function (pkg, config) {
    var manifest = jQueryJson.build(pkg, config, false);

    if (manifest.name) {
      return grunt.file.write(jQueryJson.jsonFileName(manifest.name), jQueryJson.stringify(manifest));
    }
    else {
      return false;
    }
  });

  // Helper that validates a package manifest. Returns `true` or an object with
  // each invalid field as a key, with the value being an array of errors.
  grunt.registerHelper('validate-jquery-json', function (manifest, log) {
    return jQueryJson.validate(manifest, log);
  });

  // Helper that validates a jquery.json package manifest file. Returns `true`
  // or an object with each invalid field as a key, with the value being an
  // array of errors.
  grunt.registerHelper('validate-jquery-json-file', function (fileName, log) {
    var filePattern = fileName ? fileName : jQueryJson.jsonFileName('*'),
        files = grunt.file.expandFiles(filePattern);

    if (files.length === 1) {
      return jQueryJson.validate(grunt.file.read(files[0]), log);
    }
    else if (log) {
      if (files.length > 1) {
        grunt.log.error('More than one jquery.json file was found');
      }
      else {
        grunt.log.error('No jquery.json file could be found');
      }
    }

    return false;
  });
};
