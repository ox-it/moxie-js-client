define(['jquery', 'backbone', 'underscore', 'moxie.conf', 'hbs!feedback/templates/feedback'],
    function($, Backbone, _, MoxieConf, feedbackTemplate){

    var FeedbackView = Backbone.View.extend({

        initialize: function() {
            _.bindAll(this);
        },

        manage: true,

        template: feedbackTemplate,

        beforeRender: function() {
            Backbone.trigger('domchange:title', "Feedback");
        }

    });

    return FeedbackView;
});
