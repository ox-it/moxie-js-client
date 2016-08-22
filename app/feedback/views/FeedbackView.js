define(['jquery', 'backbone', 'underscore', 'app/moxie.conf', 'app/feedback/models/FeedbackModel', 'hbs!app/feedback/templates/feedback'],
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

        serialize: function() {
            return {thanks: this.thanks};
        },

        manage: true,

        template: feedbackTemplate,

        beforeRender: function() {
            Backbone.trigger('domchange:title', "Feedback and Support");
        },

        submitFeedback: function(ev) {
            if (this.validFeedback()) {
                this.sendFeedback();
                this.thanks = true;
                this.render();
            }
        },

        validFeedback: function() {
            var message = this.$("#input-message").val();
            if (message.trim() == "") {
                alert("You must enter a message!");
                return false;
            }
            return true;
        },

        sendFeedback: function() {
            var feedback = {};
            if (this.$("#input-email").val()) { feedback.email = this.$("#input-email").val(); }
            if (this.$("#input-message").val()) { feedback.message = this.$("#input-message").val(); }
            feedback.device = this.getDeviceProperties();
            // TODO referer?
            this.model.save(feedback);
        },

        getDeviceProperties: function() {
            var device = "";
            if (window.device) {
                if (window.device.name) {
                    device +=  " " + window.device.name;
                }
                if (window.device.platform) {
                    device += " " + window.device.platform;
                }
                if (window.device.version) {
                    device += " " + window.device.version;
                }
                if (window.device.phonegap) {
                    device += " Phonegap: " + window.device.phonegap;
                }
            }
            return device;
        }
    });

    return FeedbackView;
});
