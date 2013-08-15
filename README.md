Moxie JS Client
===============

Client for a new (in development) version of [Mobile Oxford](http://m.ox.ac.uk).

[Online documentation](https://moxie-js-client.readthedocs.org)

The Code
--------

There is a lot of JavaScript in this project. To manage this we're using [require.js](http://requirejs.org/) this allows us to write modular JavaScript following the API defined by AMD.

Tests
-----

The easiest way to run Moxie's Jasmine test suite is simply opening `SpecRunner.html` in your browser. However if you have phantomjs installed (`npm install phantomjs -g`) you can run the tests with the following command:

    phantomjs run-jasmine.js SpecRunner.html

The Build
---------

**index.html:** For development you need to create a symlink for index.html -> index-dev.html this uses require.js. Production builds should use r.js and create index.html -> index-prod.html.

**CSS:** This project uses SASS. In order to compile to CSS you will need to have installed [zurb-foundation](http://foundation.zurb.com/) and [compass](http://compass-style.org/install/). These can both me installed through `bundle install` provided you have [bundler](http://gembundler.com/) installed. Now you're ready to compile our CSS, just type `compass compile` in the root of the project.
 - If you'd rather not polute your system packages (*recommended*) then install with:

   ``bundle install --path .bundle`` and run the SASS compiler with ``bundle exec compass compile`` or watch for changes: ``bundle exec compass watch``

**Webfonts:** Whilst not a requirement, this project uses [Symbolset's](https://symbolset.com/) 'standard' vector icons which provide smooth scaling and semantic markup. If you wish to use these, please buy a copy and place the `webfonts` folder in the root of the repository. If not, the site will still display, but you will have text displayed instead of icons. 

**JavaScript:** Minification is handled by UglifyJS by way of r.js. This correctly walks our dependency graph and will only minify files which are used. So install r.js `npm install -g requirejs` and optimise:

    r.js -o js/moxie.build.js

PhoneGap build
--------------

Alternatively, you can build a package that contains all required files by typing `make` at the root of the repository. This is mainly targeted for PhoneGap (there is a configuration file `config.xml` used by PhoneGap) but the content can be reused.

Development
-----------

Avoid Nginx expires / HTTP 304:

	location / {
    	expires epoch;
    	add_header Cache-Control no-cache;
    	if_modified_since off;
	}

