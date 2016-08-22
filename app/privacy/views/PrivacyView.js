define(['backbone', 'hbs!app/privacy/templates/privacy'], function(Backbone, privacyTemplate) {
    var PrivacyView = Backbone.View.extend({

        template: privacyTemplate,

        beforeRender: function() {
            Backbone.trigger('domchange:title', "Mobile Oxford Privacy Prolicy");
        },

        manage: true
    });
    return PrivacyView;
});
