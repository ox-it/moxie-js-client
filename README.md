Moxie JS Client
===============

Client for a new (in development) version of [Mobile Oxford](http://m.ox.ac.uk).

The Code
--------

There is a lot of JavaScript in this project. To manage this we're using [require.js](http://requirejs.org/) this allows us to write modular JavaScript following the API defined by AMD.

The Build
---------

**index.html:** For development you need to create a symlink for index.html -> index-dev.html this uses require.js. Production builds should use r.js and create index.html -> index-prod.html.

**CSS:** This project uses SASS. In order to compile to CSS you will need to have installed [zurb-foundation](http://foundation.zurb.com/) and [compass](http://compass-style.org/install/). These can both me installed through `bundle install` provided you have [bundler](http://gembundler.com/) installed. Now you're ready to compile our CSS, just type `compass compile` in the root of the project.

**Webfonts:** Whilst not a requirement, this project uses [Symbolset's](https://symbolset.com/) 'standard' vector icons which provide smooth scaling and semantic markup. If you wish to use these, please buy a copy and place the `webfonts` folder in the root of the repository. If not, the site will still display, but you will have text displayed instead of icons. 

**JavaScript:** Minification is handled by UglifyJS by way of r.js. This correctly walks our dependency graph and will only minify files which are used. So install r.js `npm install -g requirejs` and optimise:

    r.js -o js/moxie.build.js


Development
-----------

Avoid Nginx expires / HTTP 304:

	location / {
    	expires epoch;
    	add_header Cache-Control no-cache;
    	if_modified_since off;
	}

