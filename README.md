grunt-jquery-json
=================

Grunt plugin that generates a jquery.json manifest file from package.json.
jquery.json manifest files are used by the
[jQuery Plugin Registry](http://plugins.jquery.com) to identify jQuery plugins.

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

Run the following `grunt` command in the same directory as your project's
`grunt.js` file:

    grunt jquery-json

If everything was successful, there should now be a `yourplugin.jquery.json`
manifest file in that same directory, where `yourplugin` is the name of your
jQuery plugin. All of the fields used by the jQuery Plugin Registry have been
pulled in from your project's `package.json`.

To add or overwrite any fields specific to your `jquery.json`, simply add a
`jquery-json` object with the desired values to your Grunt config:

    grunt.initConfig({
      ...
      'jquery-json': {
        dependencies: {
          'jquery': '>=1.4.3'
        },
        docs: 'https://github.com/jstayton/jquery-plugin/blob/master/README.md',
        demo: 'http://jstayton.github.com/jquery-plugin'
      }
    });

In addition to the `jquery-json` task, there are also two helpers at your
disposal:

*   `get-jquery-json` returns the manifest as an object.
*   `write-jquery-json` writes the manifest to the `jquery.json` file.

Both accept the `pkg` object and `jquery-json` config object as parameters:

    grunt.helper('get-jquery-json', grunt.config('pkg'), grunt.config('jquery-json'));

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
