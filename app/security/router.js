define(["app/app", "app/moxie.conf", "underscore", "backbone", "app/security/views/StaticView",
    "hbs!app/security/templates/index", "app/news/collections/FeedCollection"],
    function(app, conf, _, Backbone, StaticView, indexTemplate, Feeds){

        var SecurityRouter = Backbone.SubRoute.extend({
            feed: new Feeds(conf.security.feed),
            routes: {
                '': 'index',
            },

            index: function() {
                var security_feed;
                if (this.feed.length === 1) {
                    this.feed.load();
                    security_feed = this.feed.first();
                } else {
                    security_feed = null;
                }
                app.renderView(new StaticView({feed: security_feed, template: indexTemplate}), {menu: true});
            },
        });
        return SecurityRouter;
});
