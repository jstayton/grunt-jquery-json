module.exports = function (grunt) {
  'use strict';

  var fields = {
        required: ['name', 'version', 'title', 'author', 'licenses', 'dependencies'],
        optional: ['description', 'keywords', 'homepage', 'docs', 'demo', 'download', 'bugs', 'maintainers']
      },
      isFieldRequired = function (field) {
        return fields.required.indexOf(field) >= 0;
      },
      isFieldOptional = function (field) {
        return fields.optional.indexOf(field) >= 0;
      },
      isField = function (field) {
        return isFieldRequired(field) || isFieldOptional(field);
      },
      removeJqueryFromName = function (name) {
        return name.replace(/^jquery[\-. ]?/i, '');
      },
      jsonFileName = function (name) {
        return name + '.jquery.json';
      },
      isObjectObject = function (value) {
        return Object.prototype.toString.call(value) === '[object Object]';
      };

  grunt.registerTask('jquery-json', 'Generates a jquery.json file from package.json.', function () {
    this.requiresConfig('pkg');

    grunt.helper('write-jquery-json', grunt.config('pkg'), grunt.config('jquery-json'));
  });

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

    // Remove any form of 'jquery' from the name, as recommended.
    jqueryJson.name = removeJqueryFromName(jqueryJson.name);

    return jqueryJson;
  });

  grunt.registerHelper('write-jquery-json', function (pkg, config) {
    var jqueryJson = grunt.helper('get-jquery-json', pkg, config),
        fileName = jsonFileName(jqueryJson.name);

    return grunt.file.write(fileName, JSON.stringify(jqueryJson, null, 2));
  });
};
