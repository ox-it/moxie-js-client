define(["underscore", "core/collections/MoxieCollection", "news/models/FeedModel"], function(_, MoxieCollection, Feed) {

    var Feeds = MoxieCollection.extend({
        loading: false,
        load: function() {
            // Load the Google JS API async
            //
            // Using the autoload option to the jsapi we also load the feeds API in a single request
            if (this.loading) { return; }
            // Bind our callback with the correct context variable
            window.requestFeeds = _.bind(this.requestFeeds, this);
            this.loading = true;
            var modules = {
                "modules" : [
                    {
                        "name": "feeds",
                        "version": "1.0",
                        "callback": "requestFeeds"
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
        requestFeeds: function() {
            // Callback from Google feeds API
            this.each(function(model) {
                model.load();
            });
        },
        model: Feed
    });

    return Feeds;

});
