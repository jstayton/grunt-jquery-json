grunt-jquery-json
=================

[![Build Status](https://travis-ci.org/jstayton/grunt-jquery-json.png?branch=master)](https://travis-ci.org/jstayton/grunt-jquery-json)

[Grunt](http://gruntjs.com) plugin that builds and validates a jquery.json
package manifest, which is used by the [jQuery Plugin Registry](http://plugins.jquery.com)
to identify jQuery plugins.

*   [Release Notes](https://github.com/jstayton/grunt-jquery-json/wiki/Release-Notes)

Requirements
------------

*   Grunt ~0.3.17

Installation
------------

In the same directory as your project's `grunt.js` file, install the package via
[npm](https://npmjs.org):

    npm install grunt-jquery-json

Then load the `jquery-json` task in your `grunt.js` file:

    grunt.loadNpmTasks('grunt-jquery-json');

And, optionally, add it to the `default` task (or any other):

    grunt.registerTask('default', '[...] jquery-json');

Getting Started
---------------

To start, make sure your `grunt.js` file has a `pkg` config object that has
loaded `package.json`:

    grunt.initConfig({
      pkg: '<json:package.json>',
      ...
    });

This is a standard Grunt practice, and `grunt-jquery-json` uses this `pkg`
config object to build your `jquery.json`.

Next, run the following `grunt` command in the same directory as your `grunt.js`
file:

    grunt jquery-json

If everything was successful, there should now be a `yourplugin.jquery.json`
manifest file in that same directory, where `yourplugin` is the name of your
jQuery plugin. All of the fields used by the jQuery Plugin Registry have been
pulled in from your `package.json`.

To add or overwrite any fields specific to your `jquery.json`, simply add a
`jqueryjson` object with the desired values to your Grunt config:

    grunt.initConfig({
      ...
      jqueryjson: {
        dependencies: {
          jquery: '>=1.4.3'
        },
        docs: 'https://github.com/jstayton/jquery-plugin/blob/master/README.md',
        demo: 'http://jstayton.github.com/jquery-plugin'
      }
    });

In addition to the `jquery-json` task, there is a `validate-jquery-json` task
for validation only, as well as various helper methods.

Tasks
-----

*   **jquery-json**

    Builds and validates a jquery.json package manifest file from package.json
    and `jqueryjson` config values.

*   **validate-jquery-json**

    Validates a jquery.json package manifest file in the directory where
    grunt.js resides.

Helpers
-------

*   **build-jquery-json**

    Builds a package manifest using a combination of package.json and
    `jqueryjson` config values.

    _Parameters:_

    *   **pkg** _object_ package.json values.
    *   **config** _object_, _null_ `jqueryjson` config values.
    *   **stringify** _boolean_ Whether to JSON stringify.

    _Returns:_ _object_ or _JSON_ encoded package manifest.

    _Example:_

        grunt.helper('build-jquery-json', grunt.config('pkg'), grunt.config('jqueryjson'));

*   **build-jquery-json-file**

    Builds and writes a package manifest to a jquery.json file using a
    combination of package.json and `jqueryjson` config values.

    _Parameters:_

    *   **pkg** _object_ package.json values.
    *   **config** _object_, _null_ `jqueryjson` config values.

    _Returns:_ _boolean_ of whether the file was written.

    _Example:_

        grunt.helper('build-jquery-json-file', grunt.config('pkg'), grunt.config('jqueryjson'));

*   **validate-jquery-json**

    Validates a package manifest.

    _Parameters:_

    *   **manifest** _JSON_ Package manifest to validate.
    *   **log** _boolean_ Whether to output the results to the console.

    _Returns:_ _true_ if valid, _object_ if invalid, with each invalid field as
               a key and an array of errors as the value.

    _Example:_

        grunt.helper('validate-jquery-json', manifest, false);

*   **validate-jquery-json-file**

    Validates a jquery.json package manifest file.

    _Parameters:_

    *   **fileName** _string_, _null_ File name to read and validate, _null_ to
                                      look in directory where grunt.js resides.
    *   **log** _boolean_ Whether to output the results to the console.

    _Returns:_ _true_ if valid, _object_ if invalid, with each invalid field as
               a key and an array of errors as the value. _false_ if no file or
               more than one was found.

    _Example:_

        grunt.helper('validate-jquery-json-file', 'yourplugin.jquery.json', false);

Feedback
--------

Please open an issue to request a feature or submit a bug report. Or even if
you just want to provide some feedback, I'd love to hear. I'm also available on
Twitter as [@jstayton](http://twitter.com/jstayton).

Contributing
------------

1.  Fork it.
2.  Create your feature branch (`git checkout -b my-new-feature`).
3.  Commit your changes (`git commit -am 'Added some feature'`).
4.  Push to the branch (`git push origin my-new-feature`).
5.  Create a new Pull Request.
