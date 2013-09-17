define(["underscore", "core/collections/MoxieCollection", "feedback/models/FeedbackModel"], function(_, MoxieCollection, Feedback) {

    var Feedbacks = MoxieCollection.extend({
        model: Feedback,
        url: 'http://127.0.0.1:5000/feedback/'
    });

    return Feedbacks;

});
