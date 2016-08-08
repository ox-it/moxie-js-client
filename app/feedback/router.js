define(["app/app", "app/moxie.conf", "underscore", "backbone", "app/feedback/views/FeedbackView"],
    function(app, conf, _, Backbone, FeedbackView){
        var FeedbackRouter = Backbone.SubRoute.extend({
            routes: {
                '': 'feedback'
            },
            feedback: function() {
                app.renderView(new FeedbackView());
            }
        });
        return FeedbackRouter;
});
