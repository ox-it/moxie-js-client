define(["app", "underscore", "backbone", "news/collections/FeedCollection", "news/views/BrowseView", "news/views/ReadView"], function(app, _, Backbone, Feeds, BrowseView, ReadView){
    var NewsRouter = Backbone.SubRoute.extend({
        feeds: new Feeds([
            {title: "What's on?", slug: "whats-on", url: "http://www.ox.ac.uk/events_rss.rm"},
            {title: "Kellogg College News", slug: "kellogg-news", url: "http://www.kellogg.ox.ac.uk/rss.xml"},
                ]),
        routes: {
            '': 'browse',
            ':slug/': 'read'
        },
        browse: function() {
            console.log("BROWSE");
            app.renderView(new BrowseView({collection: this.feeds}), {menu: true});
        },
        read: function(slug) {
            console.log("READ");
            var feed = this.feeds.get(slug);
            app.renderView(new ReadView({model: feed}));
        }
    });
    return NewsRouter;
});
