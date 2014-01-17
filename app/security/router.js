define(["app", "moxie.conf", "underscore", "backbone", "security/views/StaticView",
    "hbs!security/templates/index", "news/collections/FeedCollection"],
    function(app, conf, _, Backbone, StaticView, indexTemplate, Feeds){

        var SecurityRouter = Backbone.SubRoute.extend({
            feed: new Feeds([conf.security.feed]),
            routes: {
                '': 'index',
            },

            index: function() {
                this.feed.load();
                var security_feed = this.feed.first();
                app.renderView(new StaticView({feed: security_feed, template: indexTemplate}));
            },
        });
        return SecurityRouter;
});
