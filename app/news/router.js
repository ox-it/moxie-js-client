define(["app/app", "app/moxie.conf", "underscore", "backbone", "app/news/collections/FeedCollection", "app/news/views/BrowseView", "app/news/views/ReadView", "app/news/views/EntryView"], function(app, conf, _, Backbone, Feeds, BrowseView, ReadView, EntryView){
    var errorHandler = function(resource) {
        alert("Sorry the "+ resource +" you requested could not be found.");
        Backbone.history.navigate("#news/", {trigger: true});
    };
    var NewsRouter = Backbone.SubRoute.extend({
        feeds: new Feeds(conf.news.feeds),
        routes: {
            '': 'browse',
            ':slug/': 'entryListing',
            ':feedslug/:entryslug/': 'readEntry'
        },
        browse: function() {
            this.feeds.load();
            app.renderView(new BrowseView({collection: this.feeds}), {menu: true});
        },
        entryListing: function(slug) {
            this.feeds.load();
            this.feeds.getAsync(slug, {success: function(feed) {
                app.renderView(new ReadView({model: feed}));
            }, failure: _.bind(errorHandler, this, 'feed')});
        },
        readEntry: function(feedslug, entryslug) {
            this.feeds.load();
            this.feeds.getAsync(feedslug, {success: function(feed) {
                feed.entries.getAsync(entryslug, {success: function(entry) {
                    app.renderView(new EntryView({model: entry}));
                }, failure: _.bind(errorHandler, this, 'entry')});
            }, failure: _.bind(errorHandler, this, 'feed')});
        },
    });
    return NewsRouter;
});
