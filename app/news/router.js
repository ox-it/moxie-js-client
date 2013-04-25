define(["app", "underscore", "backbone", "news/collections/FeedCollection", "news/views/BrowseView", "news/views/ReadView", "news/views/EntryView"], function(app, _, Backbone, Feeds, BrowseView, ReadView, EntryView){
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
            var feed = this.feeds.get(slug);
            if (!feed && this.feeds.length===0) {
                this.feeds.once('reset', _.bind(this.entryListing, this, slug));
            } else if (!feed) {
                console.log("Feed not found");
                Backbone.history.navigate('', {trigger: true});
            } else {
                app.renderView(new ReadView({model: feed}));
            }
        },
        readEntry: function(feedslug, entryslug) {
            var feed = this.feeds.get(feedslug);
            if (!feed && this.feeds.length===0) {
                this.feeds.once('reset', _.bind(this.readEntry, this, feedslug, entryslug));
            } else if (!feed) {
                console.log("Feed not found");
            } else {
                var entry = feed.entries.get(entryslug);
                if (!entry && feed.entries.length===0) {
                    feed.entries.once('reset', _.bind(this.readEntry, this, feedslug, entryslug));
                } else if (!entry) {
                    console.log("Entry not found");
                } else {
                    app.renderView(new EntryView({model: entry}));
                }
            }
        }
    });
    return NewsRouter;
});
