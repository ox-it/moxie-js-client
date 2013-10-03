define(["app", "moxie.conf", "underscore", "backbone", "security/views/StaticView",
    "hbs!security/templates/index"],
    function(app, conf, _, Backbone, StaticView, indexTemplate){

        var SecurityRouter = Backbone.SubRoute.extend({
            routes: {
                '': 'index',
            },

            index: function() {
                app.renderView(new StaticView({template: indexTemplate}));
            },
        });
        return SecurityRouter;
});
