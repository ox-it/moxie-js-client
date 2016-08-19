// Sets the require.js configuration for your application.
var requireConfig = {
    // 3rd party script alias names (Easier to type "jquery" than "libs/jquery-1.7.2.min")
    // baseUrl: 'app',
    paths: {

        // Core Libraries
        "jquery": "app/libs/jquery",
        "underscore": "app/libs/underscore",
        "backbone": "app/libs/backbone",
        "handlebars": "app/libs/Handlebars",
        "hbs": "app/libs/hbs",
        "json2": "app/libs/json2",
        "i18nprecompile": "app/libs/i18nprecompile",
        "leaflet": "app/libs/leaflet",
        "time_domain": "app/libs/time_domain",
        "fastclick": "app/libs/fastclick",
        "moment": "app/libs/moment",
        "backbone.queryparams": "app/libs/backbone.queryparams",
        "backbone.subroute": "app/libs/backbone.subroute",
        "backbone.layoutmanager": "app/libs/backbone.layoutmanager",
        "localstorage": "app/libs/backbone.localStorage",
        "raphael": "app/libs/raphael",
        "justgage": "app/libs/justgage",
        "matchMedia": "app/libs/matchMedia",
        "modernizr": "app/libs/modernizr",
        "foundation": "app/libs/foundation/foundation",
        "foundation.tooltips": "app/libs/foundation/foundation.tooltips",

        // Testing libs
        "jasmine": "tests/libs/jasmine-1.3.1/jasmine",
        "jasmine-html": "tests/libs/jasmine-1.3.1/jasmine-html",
        "jasmine-jquery": "tests/libs/jasmine-jquery",

        // Moxie Core modules
        // "app/core/models/MoxieModel": "app/core/models/MoxieModel",
        // "MoxieCollection": "app/core/collections/MoxieCollection"
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
        "foundation": {
            "deps": ["jquery", "modernizr"]
        },
        "foundation.tooltips": {
            "deps": ["foundation"]
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
        helperPathCallback: function(name) {return 'app/templates/helpers/' + name;}
    }
};

require.config(requireConfig);

require(['app/main']);
