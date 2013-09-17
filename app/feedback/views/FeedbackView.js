define(['jquery', 'backbone', 'underscore', 'moxie.conf', 'feedback/models/FeedbackModel', 'hbs!feedback/templates/feedback'],
    function($, Backbone, _, MoxieConf, FeedbackModel, feedbackTemplate){

    var FeedbackView = Backbone.View.extend({

        initialize: function() {
            _.bindAll(this);
            this.model = new FeedbackModel();
        },

        events: {
            'click #submit-feedback': "submitFeedback"
        },

        attributes: {
            'class': 'generic'
        },

        manage: true,

        template: feedbackTemplate,

        beforeRender: function() {
            Backbone.trigger('domchange:title', "Feedback");
        },

        submitFeedback: function(ev) {
            var feedback = {};
            if (this.$("#input-email").val()) { feedback.email = this.$("#input-email").val(); }
            if (this.$("#input-message").val()) { feedback.message = this.$("#input-message").val(); }
            this.model.save(feedback);
            this.model.sync();
        }
    });

    return FeedbackView;
});
