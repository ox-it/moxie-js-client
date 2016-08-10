define(['backbone', 'hbs!app/learning-resources/templates/index'], function(Backbone, indexTemplate) {
    var StaticView = Backbone.View.extend({

        template: indexTemplate,

        beforeRender: function() {
            Backbone.trigger('domchange:title', "Learning Resources");
        },

        manage: true
    });
    return StaticView;
});
