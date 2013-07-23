// Sets the require.js configuration for your application.
var require = {
    // 3rd party script alias names (Easier to type "jquery" than "libs/jquery-1.7.2.min")
    baseUrl: './app',
    paths: {

        // Core Libraries
        "modernizr": "libs/modernizr",
        "jquery": "libs/jquery",
        "underscore": "libs/underscore",
        "backbone": "libs/backbone",
        "handlebars": "libs/Handlebars",
        "hbs": "libs/hbs",
        "json2": "libs/json2",
        "i18nprecompile": "libs/i18nprecompile",
        "leaflet": "libs/leaflet",
        "time_domain": "libs/time_domain",
        "fastclick": "libs/fastclick",
        "moment": "libs/moment",
        "backbone.queryparams": "libs/backbone.queryparams",
        "backbone.subroute": "libs/backbone.subroute",
        "backbone.layoutmanager": "libs/backbone.layoutmanager",
        "backbone.hal": "libs/backbone.hal",
        "localstorage": "libs/backbone.localStorage",
        "raphael": "libs/raphael",
        "justgage": "libs/justgage",

        // Testing libs
        "jasmine": "tests/libs/jasmine-1.3.1/jasmine",
        "jasmine-html": "tests/libs/jasmine-1.3.1/jasmine-html",
        "jasmine-jquery": "tests/libs/jasmine-jquery",

        // Moxie Core modules
        "MoxieModel": "core/models/MoxieModel",
        "MoxieCollection": "core/collections/MoxieCollection"
    },

    // Sets the configuration for your third party scripts that are not AMD compatible
    shim: {
        "backbone": {
            "deps": ["underscore", "jquery"],
            "exports": "Backbone"  //attaches "Backbone" to the window object
        },
        "underscore": {
            "exports": "_"
        },
        "backbone.queryparams": {
            "deps": ["backbone"]
        },
        "backbone.layoutmanager": {
            "deps": ["backbone"],
            "exports": "Backbone.Layout"
        },
        "leaflet": {
            "exports": "L"
        },
        "time_domain": {
            "exports": "TimeDomain"
        },
        "handlebars": {
            "exports": "Handlebars"
        },
        "json2": {
            "exports": "JSON"
        },
        "justgage": {
            "deps": ["raphael"],
            "exports": "justgage"
        },

        // Jasmine Unit Testing
        "jasmine": {
            "exports": "jasmine"
        },
        "jasmine-html": {
            "deps": ["jasmine"],
            "exports": "jasmine"
        },
        "jasmine-jquery": {
            "deps": ["jasmine"]
        }
    },

    hbs: {
        templateExtension: 'handlebars',
        disableI18n: true,
        helperPathCallback: function(name) {return 'templates/helpers/' + name;}
    }
};
