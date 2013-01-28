/*!
 * grunt-jquery-json v0.1.0
 *
 * Grunt plugin that generates a jquery.json manifest file from package.json.
 *
 * https://github.com/jstayton/grunt-jquery-json
 *
 * Copyright 2013 by Justin Stayton
 * Licensed MIT
 */
module.exports = function (grunt) {
  'use strict';

      // Required and optional package manifest fields as defined by the jQuery
      // Plugin Registry: http://plugins.jquery.com/docs/package-manifest/
  var fields = {
        required: ['name', 'version', 'title', 'author', 'licenses', 'dependencies'],
        optional: ['description', 'keywords', 'homepage', 'docs', 'demo', 'download', 'bugs', 'maintainers']
      },
      // Check whether a field is required in the package manifest.
      isFieldRequired = function (field) {
        return fields.required.indexOf(field) >= 0;
      },
      // Check whether a field is optional in the package manifest.
      isFieldOptional = function (field) {
        return fields.optional.indexOf(field) >= 0;
      },
      // Check whether a field is used in the package manifest.
      isField = function (field) {
        return isFieldRequired(field) || isFieldOptional(field);
      },
      // Remove any form of 'jquery' from the beginning of the name, as
      // recommended by the jQuery Plugin Registry.
      removeJqueryFromName = function (name) {
        return name.replace(/^jquery[\-. ]?/i, '');
      },
      // Get the package manifest file name to write to.
      jsonFileName = function (name) {
        return name + '.jquery.json';
      },
      // Check whether a variable is a true object.
      isObjectObject = function (variable) {
        return Object.prototype.toString.call(variable) === '[object Object]';
      };

  // Task that generates a jquery.json file from package.json.
  grunt.registerTask('jquery-json', 'Generates a jquery.json file from package.json.', function () {
    this.requiresConfig('pkg');

    grunt.helper('write-jquery-json', grunt.config('pkg'), grunt.config('jquery-json'));
  });

  // Helper that returns the package manifest as an object. Uses a combination
  // of package.json and 'jquery-json' config values.
  grunt.registerHelper('get-jquery-json', function (pkg, config) {
    var jqueryJson = {};

    // Loop over all of the 'pkg' fields and add those that jquery.json uses.
    Object.keys(pkg).forEach(function (field) {
      if (isField(field)) {
        jqueryJson[field] = pkg[field];
      }
    });

    // Loop over all of the 'jquery-json' config fields and add those that
    // jquery.json uses. This allows for values not specified in 'pkg'.
    if (isObjectObject(config)) {
      Object.keys(config).forEach(function (field) {
        if (isField(field)) {
          jqueryJson[field] = config[field];
        }
      });
    }

    // Remove any form of 'jquery' from the beginning of the name.
    jqueryJson.name = removeJqueryFromName(jqueryJson.name);

    return jqueryJson;
  });

  // Helper that writes the package manifest to the jquery.json file.
  grunt.registerHelper('write-jquery-json', function (pkg, config) {
    var jqueryJson = grunt.helper('get-jquery-json', pkg, config),
        fileName = jsonFileName(jqueryJson.name);

    return grunt.file.write(fileName, JSON.stringify(jqueryJson, null, 2));
  });
};
