define(["app", "underscore", "backbone", "news/collections/FeedCollection", "news/views/BrowseView", "news/views/ReadView", "news/views/EntryView"], function(app, _, Backbone, Feeds, BrowseView, ReadView, EntryView){
    var errorHandler = function(resource) {
        alert("Sorry the "+ resource +" you requested could not be found.");
        Backbone.history.navigate("#news/", {trigger: true});
    };
    var NewsRouter = Backbone.SubRoute.extend({
        feeds: new Feeds([
            {title: "What's on?", slug: "whats-on", url: "http://www.ox.ac.uk/events_rss.rm"},
            {title: "BBC Oxford", slug: "bbc-oxford", url: "http://feeds.bbci.co.uk/news/england/oxford/rss.xml"},
            {title: "Kellogg College News", slug: "kellogg-news", url: "http://www.kellogg.ox.ac.uk/rss.xml"},
                ]),
        routes: {
            '': 'browse',
            ':slug/': 'entryListing',
            ':feedslug/:entryslug/': 'readEntry'
        },
        browse: function() {
            app.renderView(new BrowseView({collection: this.feeds}), {menu: true});
        },
        entryListing: function(slug) {
            this.feeds.getAsync(slug, {success: function(feed) {
                app.renderView(new ReadView({model: feed}));
            }, failure: _.bind(errorHandler, this, 'feed')});
        },
        readEntry: function(feedslug, entryslug) {
            this.feeds.getAsync(feedslug, {success: function(feed) {
                feed.entries.getAsync(entryslug, {success: function(entry) {
                    app.renderView(new EntryView({model: entry}));
                }, failure: _.bind(errorHandler, this, 'entry')});
            }, failure: _.bind(errorHandler, this, 'feed')});
        },
    });
    return NewsRouter;
});
