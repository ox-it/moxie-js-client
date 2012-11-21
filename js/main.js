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
        "time_domain": "libs/time_domain",
        "backbone.queryparams": "plugins/backbone.queryparams",
		"backbone.hal": "plugins/backbone.hal",
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
        "time_domain": {
            "exports": "TimeDomain",
        },
        "moxie.templates": {
            "deps": ["handlebars"],
        },
    }
});

require(['modernizr','jquery','backbone','places/router', 'today/router', 'backbone.queryparams', 'moxie.templates', 'plugins/moxie.handlebars.helpers'], function(Modernizr, $, Backbone, PlacesRouter, TodayRouter) {

    placesRouter = new PlacesRouter();
    todayRouter = new TodayRouter();

    // Extend the View class to include a navigation method goTo
    Backbone.View.prototype.goTo = function (loc, options) {
        placesRouter.navigate(loc, options);	// this should be on Backbone.Router.routes I guess??
    };
    Backbone.history.start();
    $('#home a').click(function(ev) {
        ev.preventDefault();
        window.history.back();
        return false;
    });

});
