define(["underscore", "core/collections/MoxieCollection", "news/models/FeedModel"], function(_, MoxieCollection, Feed) {

    var Feeds = MoxieCollection.extend({
        initialize: function() {
            this.feedsLoaded = false;
        },
        loadedGoogleFeedsAPI: function() {
            return Boolean(window.google && window.google.feeds);
        },
        loadGoogleFeedsAPI: function(cb) {
            // Load the Google JS API async
            //
            // Using the autoload option to the jsapi we also load the feeds API in a single request
            window.googleFeedsAPICallback = cb;
            var modules = {
                "modules" : [
                    {
                        "name": "feeds",
                        "version": "1.0",
                        "callback": "googleFeedsAPICallback"
                    }
                ]
            };
            modules = encodeURIComponent(JSON.stringify(modules));
            var script = document.createElement("script");
            // Protocol relative URL
            var src = "//www.google.com/jsapi?autoload=" + modules;
            if ('location' in window && 'href' in window.location && window.location.href.indexOf('file')===0) {
                src = "http://www.google.com/jsapi?autoload=" + modules;
            }
            script.src = src;
            script.type = "text/javascript";
            document.getElementsByTagName("head")[0].appendChild(script);
        },
        load: function() {
            if (!this.feedsLoaded) {
                if (this.loadedGoogleFeedsAPI()) {
                    this.requestFeeds();
                } else {
                    // Bind our callback with the correct context variable
                    this.loadGoogleFeedsAPI(_.bind(this.requestFeeds, this));
                }
            }
        },
        requestFeeds: function() {
            // Callback from Google feeds API
            this.each(function(model) {
                model.load();
            });
            this.feedsLoaded = true;
        },
        model: Feed
    });

    return Feeds;

});
