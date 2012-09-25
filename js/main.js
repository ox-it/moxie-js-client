// Sets the require.js configuration for your application.
require.config({
    // 3rd party script alias names (Easier to type "jquery" than "libs/jquery-1.7.2.min")
    paths: {

        // Core Libraries
        "modernizr": "libs/modernizr",
        "jquery": "libs/jquery",
        "underscore": "libs/underscore",
        "backbone": "libs/backbone",
        "handlebars": "libs/handlebars",
        "leaflet": "libs/leaflet",
        "backbone.queryparams": "plugins/backbone.queryparams",
    },

    // Sets the configuration for your third party scripts that are not AMD compatible
    shim: {
        "backbone": {
            "deps": ["underscore", "jquery"],
            "exports": "Backbone"  //attaches "Backbone" to the window object
        },
        "underscore": {
            "exports": "_",
        },
        "backbone.queryparams": {
            "deps": ["backbone"],
        },
        "handlebars": {
            "exports": "Handlebars",
        },
        "leaflet": {
            "exports": "L",
        },
        "moxie.places.templates": {
            "deps": ["handlebars"],
        },
    }
});

require(['modernizr','jquery','backbone','places/router','backbone.queryparams', 'moxie.places.templates', 'plugins/moxie.handlebars.helpers'], function(Modernizr, $, Backbone, Router) {

    this.router = new Router();
    Backbone.history.start()

});
