define(['backbone', 'jquery'], function(Backbone, $) {
    //
    // Common Google Analytics API for the Cordova GAPlugin and Google's async ga.js
    //
    // API is currently:
    // - init(trackingID [, period])
    // - trackPage()
    //
    // Both of which have 2 concrete implementations for Cordova and "web"
    function GA(options) {
        // Debug boolean if we want to produce console output
        options = options || {};
        var debug = options.debug || false;
        var consoleAvailable = 'console' in window; // Convenience

        // Public boolean to see if GA has been initialised
        this.initialised = false;
        //
        // Public boolean to see if GA is tracking hashchanges
        this.tracking = false;

        // Access the plugin directly from window
        var gaPluginAvailable = false;
        var gaPlugin;
        if ('plugins' in window && 'gaPlugin' in window.plugins) {
            gaPlugin = window.plugins.gaPlugin;
            gaPluginAvailable = true;
        }

        function errorCB(message) {
            return function(error) {
                if (debug && consoleAvailable) {
                    console.log("Error: "+ message);
                    console.log(error);
                }
            };
        }
        function successCB(message) {
            return function() {
                if (debug && consoleAvailable) {
                    console.log("Success: "+ message);
                }
            };
        }

        function trackPageCordova(path) {
            gaPlugin.trackPage(successCB("trackPage"), errorCB("trackPage"), path);
        }

        function trackPageWeb(path) {
            window._gaq.push(['_trackPageview', path]);
        }

        function getNormalisedPath() {
            // Retrieve the fragment from backbone and prepend with a '/'
            //
            // GA expects paths and will prepend with '/' regardless
            // if we do it for our app views also we get a good view on
            // the data itself.
            //
            // Only call getFragment if the router has started
            return Backbone.History.started ? '/' + Backbone.history.getFragment() : '/';
        }

        function trackPage() {
            var path = getNormalisedPath();
            try {
                if (gaPluginAvailable) {
                    trackPageCordova(path);
                } else {
                    trackPageWeb(path);
                }
            } catch (e) {
                if (consoleAvailable) {
                    console.log(e);
                }
            }
        }

        function initGACordova(trackingID, period) {
            gaPlugin.init(successCB("init GA"), errorCB("init GA"), trackingID, period);
        }

        function initGAWeb(trackingID) {
            // Initialise the "standard" Google analytics
            //
            // Code is lifted from: https://developers.google.com/analytics/devguides/collection/gajs/
            window._gaq = [];
            window._gaq.push(['_setAccount', trackingID]);

            (function() {
              var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
              ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
              var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
            })();
        }

        this.init = function(trackingID, period) {
            // trackingID - should be the unique app identifier from Google Analytics
            // period - required for Cordova GAPlugin,
            //          number of seconds between each upload of analytics
            try {
                if (gaPluginAvailable) {
                    initGACordova(trackingID, period);
                } else {
                    initGAWeb(trackingID);
                }
                this.initialised = true;
                trackPage();
            } catch (e) {
                if (consoleAvailable) {
                    console.log(e);
                }
            }
        };

        this.startListening = function() {
            if (this.initialised) {
                $(window).on("hashchange", trackPage);
                this.tracking = true;
            }
        };
    }
    return GA;
});
