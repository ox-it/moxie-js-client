Moxie JS Client
===============

Client for a new (in development) version of [Mobile Oxford](http://m.ox.ac.uk).

The Code
--------

There is a lot of JavaScript in this project. To manage this we're using [require.js](http://requirejs.org/) this allows us to write modular JavaScript following the API defined by AMD.

The Build
---------

**CSS:** This project uses SASS. In order to compile to CSS you will need to have installed [zurb-foundation](http://foundation.zurb.com/) and [compass](http://compass-style.org/install/). These can both me installed through `bundle install` provided you have [bundler](http://gembundler.com/) installed. Now you're ready to compile our CSS, just type `compass compile` in the root of the project.

**Webfonts:** Whilst not a requirement, this project uses [Symbolset's](https://symbolset.com/) 'standard' vector icons which provide smooth scaling and semantic markup. If you wish to use these, please buy a copy and place the `webfonts` folder in the root of the repository. If not, the site will still display, but you will have text displayed instead of icons. 

**Templates:** Our JS templates are written using [handlebars](http://handlebarsjs.com/) and need to be precompiled before running Moxie. Install Handlebars `npm install -g handlebars` and compile with the following command:

    handlebars handlebars/places/ -f js/moxie.places.templates.js

**JavaScript:** Minification is handled by UglifyJS by way of r.js. This correctly walks our dependency graph and will only minify files which are used. So install r.js `npm install -g requirejs` and optimise:

    r.js -o js/moxie.build.js

