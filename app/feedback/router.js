define(["app", "moxie.conf", "underscore", "backbone", "feedback/collections/FeedbackCollection", "feedback/views/FeedbackView"],
    function(app, conf, _, Backbone, Feedbacks, FeedbackView){
        var FeedbackRouter = Backbone.SubRoute.extend({
            feedbacks: new Feedbacks(),
            routes: {
                '': 'feedback'
            },
            feedback: function() {
                app.renderView(new FeedbackView());
            }
        });
        return FeedbackRouter;
});
